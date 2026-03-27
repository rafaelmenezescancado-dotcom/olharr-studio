"use client";

const equipment = [
  { id: "camera-cinema", label: "Câmera Cinema", emoji: "🎥" },
  { id: "drone", label: "Drone", emoji: "🚁" },
  { id: "gimbal", label: "Gimbal/Steadicam", emoji: "📹" },
  { id: "slider", label: "Slider/Trilho", emoji: "🛤️" },
  { id: "iluminacao", label: "Iluminação extra", emoji: "💡" },
  { id: "audio", label: "Captação de áudio", emoji: "🎙️" },
];

const deliverables = [
  { id: "moodboard", label: "Moodboard Visual", default: true },
  { id: "storyboard", label: "Storyboard Narrativo", default: true },
  { id: "shotlist", label: "Shot List", default: false },
  { id: "higgsfield", label: "Briefing Higgsfield", default: false },
];

export default function FormStep4({
  data,
  onChange,
}: {
  data: any;
  onChange: (field: string, value: any) => void;
}) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <label className="block text-sm font-medium text-white/60 mb-2">Notas Adicionais</label>
        <textarea
          value={data.notes || ""}
          onChange={(e) => onChange("notes", e.target.value)}
          placeholder="Detalhes extras sobre o evento, pedidos especiais, referências, etc."
          rows={4}
          className="w-full px-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-gold-400/40 transition-colors resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white/60 mb-3">Equipamento Previsto</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {equipment.map((equip) => {
            const selected = (data.equipment || []).includes(equip.id);
            return (
              <button
                key={equip.id}
                onClick={() => {
                  const current = data.equipment || [];
                  onChange(
                    "equipment",
                    selected ? current.filter((e: string) => e !== equip.id) : [...current, equip.id]
                  );
                }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selected
                    ? "border-gold-400/60 bg-gold-400/10"
                    : "border-white/10 bg-white/[0.02] hover:bg-white/5"
                }`}
              >
                <span>{equip.emoji}</span>
                <span className="text-sm ml-2 text-white/60">{equip.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white/60 mb-2">Restrições / Limitações</label>
        <textarea
          value={data.restrictions || ""}
          onChange={(e) => onChange("restrictions", e.target.value)}
          placeholder="Locais com restrição de acesso, limitações de luz, horários, etc."
          rows={2}
          className="w-full px-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-gold-400/40 transition-colors resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white/60 mb-3">Entregáveis</label>
        <div className="space-y-2">
          {deliverables.map((del) => {
            const selected = (data.deliverables || ["moodboard", "storyboard"]).includes(del.id);
            return (
              <label
                key={del.id}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  selected
                    ? "border-gold-400/40 bg-gold-400/5"
                    : "border-white/10 bg-white/[0.02]"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={() => {
                    const current = data.deliverables || ["moodboard", "storyboard"];
                    onChange(
                      "deliverables",
                      selected ? current.filter((d: string) => d !== del.id) : [...current, del.id]
                    );
                  }}
                  className="accent-[#c8a44e] w-4 h-4"
                />
                <span className="text-sm text-white/70">{del.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="mt-6 p-4 rounded-xl bg-gold-400/5 border border-gold-400/20">
        <div className="text-sm font-medium text-gold-400 mb-1">Pronto para gerar!</div>
        <div className="text-xs text-white/40">
          O agente de IA vai processar seu briefing usando 4 especialistas: Diretor de Fotografia,
          Roteirista, Especialista em Apresentações e Dev Front-End. O processo leva cerca de 30-60 segundos.
        </div>
      </div>
    </div>
  );
}
