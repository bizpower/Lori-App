import { useState, useCallback, useMemo, useRef } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { Upload, FileText, Loader2, CheckCircle2, AlertCircle, Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import ResponsiveModal from "@/components/ResponsiveModal";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useListe, useOperatori } from "@/hooks/useCrmData";

const DEFAULT_NUOVO_ETICHETTA_ID = "18ae05ca-2907-42f5-89a4-6a2be16a3eb9";
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const CHUNK_SIZE = 500;

type CrmField =
  | "nome"
  | "azienda"
  | "link_profilo"
  | "link_azienda"
  | "note_contatto"
  | "note_retargeting"
  | "messaggio_contatto"
  | "messaggio_retargeting"
  | "__skip__";

const CRM_FIELDS: { value: CrmField; label: string; required?: boolean }[] = [
  { value: "nome", label: "Nome", required: true },
  { value: "azienda", label: "Azienda", required: true },
  { value: "link_profilo", label: "Link profilo (LinkedIn)" },
  { value: "link_azienda", label: "Link azienda" },
  { value: "note_contatto", label: "Note contatto" },
  { value: "note_retargeting", label: "Note retargeting" },
  { value: "messaggio_contatto", label: "Messaggio contatto" },
  { value: "messaggio_retargeting", label: "Messaggio retargeting" },
  { value: "__skip__", label: "— Ignora colonna —" },
];

// fuzzy header → CRM field
function suggestMapping(header: string): CrmField {
  const h = header.toLowerCase().trim().replace(/[_\-\s]+/g, "");
  if (/^(nome|name|fullname|nomecognome|nominativo|firstname)/.test(h)) return "nome";
  if (/^(azienda|company|society|societ|organizzazione|organization|business)/.test(h)) return "azienda";
  if (/(linkedin|profilo|profile|linkprofilo)/.test(h)) return "link_profilo";
  if (/(sito|website|web|linkazienda|companyurl|url)/.test(h)) return "link_azienda";
  if (/(messaggiocontatto|message|messaggio)/.test(h)) return "messaggio_contatto";
  if (/(messaggioretargeting|retargetingmessage)/.test(h)) return "messaggio_retargeting";
  if (/(noteretargeting|retargetingnote)/.test(h)) return "note_retargeting";
  if (/(note|notes|appunti)/.test(h)) return "note_contatto";
  return "__skip__";
}

type Row = Record<string, string>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  presetListaId?: string;
  onComplete?: () => void;
}

export default function ImportLeadsModal({ open, onOpenChange, presetListaId, onComplete }: Props) {
  const { user } = useAuth();
  const { liste, addLista, reload: reloadListe } = useListe();
  const { operatori } = useOperatori();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [fileName, setFileName] = useState("");
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<Row[]>([]);
  const [mapping, setMapping] = useState<Record<string, CrmField>>({});
  const [skipDuplicates, setSkipDuplicates] = useState(true);
  const [parsing, setParsing] = useState(false);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [result, setResult] = useState<{ ok: number; errors: { row: number; reason: string; data: Row }[]; duplicates: number } | null>(null);

  // Destination list state
  const [destMode, setDestMode] = useState<"existing" | "new">(presetListaId ? "existing" : "existing");
  const [destListaId, setDestListaId] = useState<string>(presetListaId || "");
  const [newListaNome, setNewListaNome] = useState("");
  const [newListaOperatore, setNewListaOperatore] = useState("");

  const reset = useCallback(() => {
    setStep(1);
    setFileName("");
    setHeaders([]);
    setRows([]);
    setMapping({});
    setProgress(0);
    setResult(null);
    setSkipDuplicates(true);
    if (!presetListaId) {
      setDestListaId("");
      setNewListaNome("");
      setNewListaOperatore("");
    }
  }, [presetListaId]);

  const handleClose = (o: boolean) => {
    if (!o && !importing) {
      reset();
      onOpenChange(false);
    } else {
      onOpenChange(o);
    }
  };

  const parseFile = useCallback(async (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File troppo grande (max 10MB)");
      return;
    }
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!["csv", "xlsx", "xls"].includes(ext || "")) {
      toast.error("Formato non supportato. Usa .csv, .xlsx o .xls");
      return;
    }
    setParsing(true);
    setFileName(file.name);
    try {
      let data: Row[] = [];
      let hdrs: string[] = [];
      if (ext === "csv") {
        const text = await file.text();
        const parsed = Papa.parse<Row>(text, {
          header: true,
          skipEmptyLines: true,
          transformHeader: (h) => h.trim(),
        });
        hdrs = parsed.meta.fields || [];
        data = (parsed.data as Row[]).filter((r) => Object.values(r).some((v) => v && String(v).trim()));
      } else {
        const buf = await file.arrayBuffer();
        const wb = XLSX.read(buf, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json<Row>(ws, { defval: "", raw: false });
        data = json.filter((r) => Object.values(r).some((v) => v && String(v).trim()));
        hdrs = data.length > 0 ? Object.keys(data[0]) : [];
      }
      // dedupe header names
      const seen = new Set<string>();
      hdrs = hdrs.map((h) => {
        let n = h || "Colonna";
        let i = 1;
        while (seen.has(n)) n = `${h}_${++i}`;
        seen.add(n);
        return n;
      });
      if (hdrs.length === 0 || data.length === 0) {
        toast.error("File vuoto o senza intestazioni");
        setParsing(false);
        return;
      }
      setHeaders(hdrs);
      setRows(data);
      const auto: Record<string, CrmField> = {};
      const used = new Set<CrmField>();
      hdrs.forEach((h) => {
        const s = suggestMapping(h);
        if (s !== "__skip__" && !used.has(s)) {
          auto[h] = s;
          used.add(s);
        } else {
          auto[h] = "__skip__";
        }
      });
      setMapping(auto);
      setStep(2);
    } catch (e) {
      console.error(e);
      toast.error("Errore parsing file");
    } finally {
      setParsing(false);
    }
  }, []);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) parseFile(f);
  };

  // Validation summary for step 3
  const validation = useMemo(() => {
    const nomeCol = Object.entries(mapping).find(([, v]) => v === "nome")?.[0];
    const aziendaCol = Object.entries(mapping).find(([, v]) => v === "azienda")?.[0];
    if (!nomeCol || !aziendaCol) return null;
    const valid: Row[] = [];
    const errors: { row: number; reason: string; data: Row }[] = [];
    const seenKeys = new Set<string>();
    let internalDup = 0;
    rows.forEach((r, i) => {
      const nome = String(r[nomeCol] || "").trim();
      const azienda = String(r[aziendaCol] || "").trim();
      if (!nome || !azienda) {
        errors.push({ row: i + 2, reason: "Nome o azienda mancanti", data: r });
        return;
      }
      const key = `${nome.toLowerCase()}|${azienda.toLowerCase()}`;
      if (seenKeys.has(key)) {
        internalDup++;
        if (!skipDuplicates) valid.push(r);
        return;
      }
      seenKeys.add(key);
      valid.push(r);
    });
    return { valid, errors, duplicates: internalDup };
  }, [rows, mapping, skipDuplicates]);

  const canImport = useMemo(() => {
    const hasNome = Object.values(mapping).includes("nome");
    const hasAzienda = Object.values(mapping).includes("azienda");
    if (!hasNome || !hasAzienda) return false;
    if (destMode === "existing" && !destListaId) return false;
    if (destMode === "new" && (!newListaNome.trim() || !newListaOperatore)) return false;
    return true;
  }, [mapping, destMode, destListaId, newListaNome, newListaOperatore]);

  const resolveDestList = async (): Promise<string | null> => {
    if (destMode === "existing") return destListaId || null;
    // create new
    const ok = await addLista(newListaNome.trim(), newListaOperatore);
    if (!ok) return null;
    await reloadListe();
    // refetch
    const { data } = await supabase
      .from("liste")
      .select("id")
      .eq("user_id", user!.id)
      .eq("nome", newListaNome.trim())
      .order("created_at", { ascending: false })
      .limit(1);
    return data?.[0]?.id || null;
  };

  const startImport = async () => {
    if (!user || !validation) return;
    setImporting(true);
    setProgress(0);
    setStep(4);

    const listaId = await resolveDestList();
    if (!listaId) {
      toast.error("Impossibile determinare la lista di destinazione");
      setImporting(false);
      setStep(3);
      return;
    }

    // Fetch existing lead keys (nome|azienda) in DB for this user
    const existingKeys = new Set<string>();
    if (skipDuplicates) {
      const { data: existing } = await supabase
        .from("leads")
        .select("nome, azienda")
        .eq("user_id", user.id);
      existing?.forEach((l: any) => existingKeys.add(`${String(l.nome).toLowerCase()}|${String(l.azienda).toLowerCase()}`));
    }

    const nomeCol = Object.entries(mapping).find(([, v]) => v === "nome")![0];
    const aziendaCol = Object.entries(mapping).find(([, v]) => v === "azienda")![0];

    const toInsert: any[] = [];
    let dbDuplicates = 0;
    const errors: { row: number; reason: string; data: Row }[] = [...validation.errors];

    validation.valid.forEach((r, i) => {
      const nome = String(r[nomeCol] || "").trim().slice(0, 500);
      const azienda = String(r[aziendaCol] || "").trim().slice(0, 500);
      const key = `${nome.toLowerCase()}|${azienda.toLowerCase()}`;
      if (skipDuplicates && existingKeys.has(key)) {
        dbDuplicates++;
        return;
      }
      existingKeys.add(key);
      const lead: any = {
        user_id: user.id,
        lista_id: listaId,
        nome,
        azienda,
        etichetta_id: DEFAULT_NUOVO_ETICHETTA_ID,
        link_profilo: "",
        link_azienda: "",
        note_contatto: "",
        note_retargeting: "",
        messaggio_contatto: "",
        messaggio_retargeting: "",
      };
      Object.entries(mapping).forEach(([csvCol, field]) => {
        if (field === "__skip__" || field === "nome" || field === "azienda") return;
        const v = String(r[csvCol] || "").trim().slice(0, 5000);
        if (v) lead[field] = v;
      });
      toInsert.push(lead);
    });

    let inserted = 0;
    for (let i = 0; i < toInsert.length; i += CHUNK_SIZE) {
      const chunk = toInsert.slice(i, i + CHUNK_SIZE);
      let attempt = 0;
      let success = false;
      while (attempt < 3 && !success) {
        const { error } = await supabase.from("leads").insert(chunk);
        if (!error) {
          success = true;
          inserted += chunk.length;
        } else {
          attempt++;
          if (attempt >= 3) {
            errors.push({ row: i + 2, reason: `Batch fallito: ${error.message}`, data: chunk[0] as any });
          } else {
            await new Promise((r) => setTimeout(r, 500 * attempt));
          }
        }
      }
      setProgress(Math.round(((i + chunk.length) / Math.max(toInsert.length, 1)) * 100));
    }

    setResult({ ok: inserted, errors, duplicates: validation.duplicates + dbDuplicates });
    setImporting(false);
    onComplete?.();
  };

  const downloadErrors = () => {
    if (!result || result.errors.length === 0) return;
    const csv = Papa.unparse(
      result.errors.map((e) => ({ riga: e.row, errore: e.reason, ...e.data })),
    );
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `errori_import_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ResponsiveModal
      title="Importa lead da CSV / Excel"
      open={open}
      onOpenChange={handleClose}
    >
      <div className="space-y-4">
        {/* Stepper */}
        <div className="flex items-center gap-1 text-xs">
          {["Carica", "Mappa", "Verifica", "Importa"].map((label, i) => {
            const n = (i + 1) as 1 | 2 | 3 | 4;
            const active = step === n;
            const done = step > n;
            return (
              <div key={label} className="flex items-center gap-1 flex-1">
                <div
                  className={`h-6 w-6 rounded-full flex items-center justify-center font-semibold ${
                    done ? "bg-primary text-primary-foreground" : active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {done ? "✓" : n}
                </div>
                <span className={active ? "font-medium" : "text-muted-foreground"}>{label}</span>
                {i < 3 && <div className="flex-1 h-px bg-border mx-1" />}
              </div>
            );
          })}
        </div>

        {/* STEP 1: Upload */}
        {step === 1 && (
          <div className="space-y-4">
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              }`}
            >
              <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
              <p className="font-medium">Trascina qui il file o clicca per selezionarlo</p>
              <p className="text-xs text-muted-foreground mt-1">CSV, XLSX o XLS — max 10MB</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) parseFile(f); }}
              />
            </div>
            {parsing && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Lettura file in corso…
              </div>
            )}
          </div>
        )}

        {/* STEP 2: Mapping */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium truncate">{fileName}</span>
              <span className="text-muted-foreground">· {rows.length} righe</span>
            </div>

            <div className="space-y-2 max-h-64 overflow-auto pr-1">
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">Associa colonne</Label>
              {headers.map((h) => (
                <div key={h} className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                  <div className="text-sm truncate" title={h}>{h}</div>
                  <span className="text-muted-foreground">→</span>
                  <Select
                    value={mapping[h] || "__skip__"}
                    onValueChange={(v) => setMapping((m) => ({ ...m, [h]: v as CrmField }))}
                  >
                    <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CRM_FIELDS.map((f) => (
                        <SelectItem key={f.value} value={f.value}>
                          {f.label}{f.required ? " *" : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>

            {/* Preview */}
            <div className="border rounded-md overflow-auto max-h-40">
              <table className="text-xs w-full">
                <thead className="bg-muted sticky top-0">
                  <tr>{headers.map((h) => <th key={h} className="px-2 py-1 text-left font-medium">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {rows.slice(0, 5).map((r, i) => (
                    <tr key={i} className="border-t">
                      {headers.map((h) => <td key={h} className="px-2 py-1 truncate max-w-[140px]">{r[h]}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between gap-2">
              <Button variant="outline" onClick={() => { reset(); }}>Annulla</Button>
              <Button onClick={() => setStep(3)} disabled={!Object.values(mapping).includes("nome") || !Object.values(mapping).includes("azienda")}>
                Avanti
              </Button>
            </div>
            {(!Object.values(mapping).includes("nome") || !Object.values(mapping).includes("azienda")) && (
              <p className="text-xs text-destructive">Mappa almeno i campi obbligatori Nome e Azienda.</p>
            )}
          </div>
        )}

        {/* STEP 3: Validation + destination */}
        {step === 3 && validation && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="border rounded-md p-3">
                <div className="text-2xl font-bold text-green-600">{validation.valid.length}</div>
                <div className="text-xs text-muted-foreground">Validi</div>
              </div>
              <div className="border rounded-md p-3">
                <div className="text-2xl font-bold text-amber-600">{validation.duplicates}</div>
                <div className="text-xs text-muted-foreground">Duplicati nel file</div>
              </div>
              <div className="border rounded-md p-3">
                <div className="text-2xl font-bold text-destructive">{validation.errors.length}</div>
                <div className="text-xs text-muted-foreground">Errori</div>
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <Checkbox checked={skipDuplicates} onCheckedChange={(v) => setSkipDuplicates(!!v)} />
              Salta duplicati (per Nome + Azienda, anche già presenti nel CRM)
            </label>

            {/* Destination */}
            {!presetListaId && (
              <div className="space-y-2 border-t pt-3">
                <Label className="text-xs uppercase tracking-wide text-muted-foreground">Lista di destinazione</Label>
                <div className="flex gap-2">
                  <Button variant={destMode === "existing" ? "default" : "outline"} size="sm" onClick={() => setDestMode("existing")}>Esistente</Button>
                  <Button variant={destMode === "new" ? "default" : "outline"} size="sm" onClick={() => setDestMode("new")}>Nuova lista</Button>
                </div>
                {destMode === "existing" ? (
                  <Select value={destListaId} onValueChange={setDestListaId}>
                    <SelectTrigger><SelectValue placeholder="Seleziona lista" /></SelectTrigger>
                    <SelectContent>
                      {liste.map((l) => <SelectItem key={l.id} value={l.id}>{l.nome}</SelectItem>)}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="space-y-2">
                    <Input placeholder="Nome nuova lista" value={newListaNome} onChange={(e) => setNewListaNome(e.target.value)} />
                    <Select value={newListaOperatore} onValueChange={setNewListaOperatore}>
                      <SelectTrigger><SelectValue placeholder="Operatore" /></SelectTrigger>
                      <SelectContent>
                        {operatori.map((o) => <SelectItem key={o.id} value={o.id}>{o.nome}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            )}

            <p className="text-xs text-muted-foreground">Tutti i lead importati riceveranno l'etichetta <span className="font-medium">Nuovo</span>.</p>

            <div className="flex justify-between gap-2">
              <Button variant="outline" onClick={() => setStep(2)}>Indietro</Button>
              <Button onClick={startImport} disabled={!canImport || validation.valid.length === 0}>
                Importa {validation.valid.length} lead
              </Button>
            </div>
          </div>
        )}

        {/* STEP 4: Import progress / result */}
        {step === 4 && (
          <div className="space-y-4">
            {importing ? (
              <>
                <div className="flex items-center gap-2 text-sm">
                  <Loader2 className="h-4 w-4 animate-spin" /> Importazione in corso…
                </div>
                <Progress value={progress} />
                <p className="text-xs text-muted-foreground text-center">{progress}%</p>
              </>
            ) : result ? (
              <>
                <div className="flex flex-col items-center gap-2 py-4">
                  <CheckCircle2 className="h-12 w-12 text-green-600" />
                  <p className="font-semibold text-lg">Import completato</p>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-sm">
                  <div className="border rounded-md p-2">
                    <div className="font-bold text-green-600">{result.ok}</div>
                    <div className="text-xs text-muted-foreground">Importati</div>
                  </div>
                  <div className="border rounded-md p-2">
                    <div className="font-bold text-amber-600">{result.duplicates}</div>
                    <div className="text-xs text-muted-foreground">Duplicati saltati</div>
                  </div>
                  <div className="border rounded-md p-2">
                    <div className="font-bold text-destructive">{result.errors.length}</div>
                    <div className="text-xs text-muted-foreground">Errori</div>
                  </div>
                </div>
                {result.errors.length > 0 && (
                  <Button variant="outline" className="w-full" onClick={downloadErrors}>
                    <Download className="h-4 w-4 mr-2" /> Scarica errori (.csv)
                  </Button>
                )}
                <Button className="w-full" onClick={() => handleClose(false)}>Chiudi</Button>
              </>
            ) : null}
          </div>
        )}
      </div>
    </ResponsiveModal>
  );
}
