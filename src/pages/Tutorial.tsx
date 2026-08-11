import PageLayout from "@/components/layout/PageLayout";
import { Card } from "@/components/ui/card";
import { Users, FolderOpen, Contact, Tag, Play } from "lucide-react";

const tutorials = [
  {
    icon: Play,
    title: "📹 Come usare Lori",
    description: "Panoramica generale su come usare Lori al meglio.",
    src: "/videos/tutorial.mp4",
  },
  {
    icon: Users,
    title: "👥 Operatori",
    description: "Come creare e gestire gli operatori del tuo team.",
    src: "/videos/tutorial-operatori.mp4",
  },
  {
    icon: FolderOpen,
    title: "📂 Liste",
    description: "Come funzionano le liste e la gestione dei fogli.",
    src: "/videos/tutorial-liste.mp4",
  },
  {
    icon: Contact,
    title: "📇 Tutti i Lead",
    description: "Come visualizzare e gestire tutti i tuoi lead.",
    src: "/videos/tutorial-lead.mp4",
  },
  {
    icon: Tag,
    title: "🏷️ Etichette",
    description: "Come creare e personalizzare le etichette.",
    src: "/videos/tutorial-etichette.mp4",
  },
];

const Tutorial = () => {
  return (
    <PageLayout title="Tutorial" breadcrumbLabel="Tutorial">
      <div className="max-w-2xl space-y-4">
        {tutorials.map((t) => (
          <Card key={t.src} className="p-5 space-y-3">
            <h3 className="font-semibold text-foreground">{t.title}</h3>
            <p className="text-sm text-muted-foreground">{t.description}</p>
            <video
              controls
              className="w-full rounded-lg border border-border"
              preload="metadata"
            >
              <source src={t.src} type="video/mp4" />
            </video>
          </Card>
        ))}
      </div>
    </PageLayout>
  );
};

export default Tutorial;
