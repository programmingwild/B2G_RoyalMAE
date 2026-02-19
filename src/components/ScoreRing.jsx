import { useData } from '../contexts/DataContext';

export default function ScoreRing({ size = 140 }) {
  const { score, health } = useData();
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const filled = (score / 100) * circumference;
  const gap = circumference - filled;

  const strokeColor =
    score >= 70 ? '#059669' : score >= 40 ? '#d97706' : '#e11d48';

  const glowColor = score >= 70 ? 'rgba(5, 150, 105, 0.25)' : score >= 40 ? 'rgba(217, 119, 6, 0.25)' : 'rgba(225, 29, 72, 0.25)';

  return (
    <div className="score-ring animate-fade-in" style={{ width: size, height: size }}>
      {/* Glow backdrop */}
      <div className="absolute inset-0 rounded-full animate-glow" style={{ boxShadow: `0 0 30px ${glowColor}, 0 0 60px ${glowColor}` }} />
      <svg width={size} height={size} className="-rotate-90 relative z-10">
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(231, 229, 228, 0.4)"
          strokeWidth={10}
        />
        {/* Score ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={10}
          strokeDasharray={`${filled} ${gap}`}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
          style={{ filter: `drop-shadow(0 0 6px ${strokeColor}50)` }}
        />
      </svg>
      <div className="absolute flex flex-col items-center z-10">
        <span className="text-3xl font-bold text-gradient">{score}</span>
        <span className={`text-xs font-semibold ${health.color}`}>{health.label}</span>
      </div>
    </div>
  );
}
