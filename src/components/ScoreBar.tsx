// Continuous color gradient: red (0) → orange (33) → yellow (60) → green (100)
function getScoreColor(score: number): string {
  const s = Math.max(0, Math.min(100, score));
  // Hue: 0 (red) → 25 (orange) → 50 (yellow) → 142 (green)
  let hue: number;
  if (s <= 33) {
    hue = (s / 33) * 25; // 0→25
  } else if (s <= 60) {
    hue = 25 + ((s - 33) / 27) * 25; // 25→50
  } else {
    hue = 50 + ((s - 60) / 40) * 92; // 50→142
  }
  return `hsl(${Math.round(hue)}, 80%, 45%)`;
}

function getScoreLabel(score: number): string {
  if (score >= 80) return "Eccellente";
  if (score >= 60) return "Buono";
  if (score >= 40) return "Discreto";
  if (score >= 20) return "Da migliorare";
  return "Critico";
}

const ScoreBar = ({ score, compact = false }: { score: number; compact?: boolean }) => {
  const color = getScoreColor(score);
  const label = getScoreLabel(score);

  if (compact) {
    return (
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium" style={{ color }}>{label}</span>
          <span className="text-[11px] font-bold" style={{ color }}>{score}</span>
        </div>
        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${score}%`,
              background: `linear-gradient(90deg, ${color}cc, ${color})`,
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 min-w-[160px]">
      <div className="flex-1 space-y-0.5">
        <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${score}%`,
              background: `linear-gradient(90deg, ${color}99, ${color})`,
            }}
          />
        </div>
      </div>
      <span
        className="text-xs font-bold tabular-nums min-w-[28px] text-right"
        style={{ color }}
      >
        {score}
      </span>
    </div>
  );
};

export default ScoreBar;
