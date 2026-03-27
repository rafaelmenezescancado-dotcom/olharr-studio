"use client";

const steps = [
  { label: "Evento", emoji: "🎪" },
  { label: "Estética", emoji: "🎨" },
  { label: "Narrativa", emoji: "🎬" },
  { label: "Extras", emoji: "✨" },
];

export default function Stepper({ current, onChange }: { current: number; onChange: (step: number) => void }) {
  return (
    <div className="flex items-center justify-center gap-1 mb-8">
      {steps.map((step, i) => (
        <div key={i} className="flex items-center">
          <button
            onClick={() => i <= current && onChange(i)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              i === current
                ? "bg-gold-400/20 text-gold-300 border border-gold-400/40"
                : i < current
                ? "bg-white/5 text-white/60 border border-white/10 cursor-pointer hover:bg-white/10"
                : "bg-white/[0.02] text-white/20 border border-white/5 cursor-default"
            }`}
          >
            <span>{step.emoji}</span>
            <span className="hidden sm:inline">{step.label}</span>
          </button>
          {i < steps.length - 1 && (
            <div className={`w-8 h-px mx-1 ${i < current ? "bg-gold-400/40" : "bg-white/10"}`} />
          )}
        </div>
      ))}
    </div>
  );
}
