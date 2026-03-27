"use client";

const eventTypes = [
  { id: "casamento", label: "Casamento", emoji: "💒" },
  { id: "corporativo", label: "Corporativo", emoji: "🏢" },
  { id: "festival", label: "Festival", emoji: "🎵" },
  { id: "aniversario", label: "Aniversário", emoji: "🎂" },
  { id: "institucional", label: "Institucional", emoji: "🎓" },
  { id: "social", label: "Social", emoji: "🎉" },
];

const audiences = [
  "Jovens (18-30)",
  "Adultos (30-50)",
  "Executivos",
  "Família",
  "Misto",
];

export default function FormStep1({
  data,
  onChange,
}: {
  data: any;
  onChange: (field: string, value: any) => void;
}) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <label className="block text-sm font-medium text-white/60 mb-3">Tipo de Evento</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {eventTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => onChange("eventType", type.id)}
              className={`p-4 rounded-xl border text-left transition-all ${
                data.eventType === type.id
                  ? "border-gold-400/60 bg-gold-400/10 text-white"
                  : "border-white/10 bg-white/[0.02] text-white/50 hover:bg-white/5 hover:border-white/20"
              }`}
            >
              <span className="text-2xl">{type.emoji}</span>
              <div className="mt-2 text-sm font-medium">{type.label}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white/60 mb-2">Nome do Evento</label>
        <input
          type="text"
          value={data.eventName || ""}
          onChange={(e) => onChange("eventName", e.target.value)}
          placeholder="Ex: Casamento Ana & Pedro"
          className="w-full px-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-gold-400/40 transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white/60 mb-2">Data (opcional)</label>
          <input
            type="date"
            value={data.eventDate || ""}
            onChange={(e) => onChange("eventDate", e.target.value)}
            className="w-full px-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-white focus:outline-none focus:border-gold-400/40 transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/60 mb-2">Local (opcional)</label>
          <input
            type="text"
            value={data.eventLocation || ""}
            onChange={(e) => onChange("eventLocation", e.target.value)}
            placeholder="Ex: Fazenda Santa Clara"
            className="w-full px-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-gold-400/40 transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white/60 mb-2">Público-alvo</label>
        <div className="flex flex-wrap gap-2">
          {audiences.map((aud) => (
            <button
              key={aud}
              onClick={() => onChange("audience", aud)}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                data.audience === aud
                  ? "bg-gold-400/20 text-gold-300 border border-gold-400/40"
                  : "bg-white/[0.04] text-white/40 border border-white/10 hover:bg-white/[0.08]"
              }`}
            >
              {aud}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white/60 mb-2">
          Número de convidados: <span className="text-gold-400">{data.guestCount || 100}</span>
        </label>
        <input
          type="range"
          min="20"
          max="2000"
          step="10"
          value={data.guestCount || 100}
          onChange={(e) => onChange("guestCount", parseInt(e.target.value))}
          className="w-full accent-[#c8a44e]"
        />
        <div className="flex justify-between text-xs text-white/20 mt-1">
          <span>20</span>
          <span>2000+</span>
        </div>
      </div>
    </div>
  );
}
