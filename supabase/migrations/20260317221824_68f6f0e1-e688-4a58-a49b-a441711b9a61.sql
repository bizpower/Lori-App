-- Update default etichette names
UPDATE public.etichette SET nome = 'Nuovo' WHERE is_default = true AND nome = 'Collegamento';
UPDATE public.etichette SET nome = 'Follow Up' WHERE is_default = true AND nome = 'Nessun collegamento';

-- Insert new default etichette if they don't exist
INSERT INTO public.etichette (nome, colore, is_default)
SELECT 'Trattativa', '#f59e0b', true
WHERE NOT EXISTS (SELECT 1 FROM public.etichette WHERE nome = 'Trattativa' AND is_default = true);

INSERT INTO public.etichette (nome, colore, is_default)
SELECT 'Preventivo Inviato', '#8b5cf6', true
WHERE NOT EXISTS (SELECT 1 FROM public.etichette WHERE nome = 'Preventivo Inviato' AND is_default = true);
