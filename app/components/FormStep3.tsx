"use client";

const durations = [
  { id: "1min", label: "1 min", desc: "Teaser rápido" },
  { id: "2min", label: "2 min", desc: "Highlight reel" },
  { id: "3min", label: "3 min", desc: "Aftermovie padrão" },
  { id: "5min", label: "5+ min", desc: "Filme completo" },
];

const keyMoments = [
  { id: "preparativos", label: "Preparativos", emoji: "💄" },
  { id: "entrada", label: "Entrada", emoji: "🚶" },
  { id: "cerimonia", label: "Cerimônia", emoji: "💍" },
  { id: "discursos", label: "Discursos", emoji: "🎤" },
  { id: "festa", label: "Festa/Celebração", emoji: "🎉" },
  { id: "detalhes", label: "Detalhes/Decor", emoji: "🌸" },
  { id: "drone", label: "Aéreas/Drone", emoji: "🚁" },
  { id: "saida", label: "Saída/Encerramento", emoji: "🌙" },
];

const soundtrackGenres = [
  "Indie/Folk",
  "Eletrônica Suave",
  "Orquestral/Clássica",
  "Pop Acústico",
  "Jazz/Lounge",
  "Rock Alternativo",
  "Instrumental Cinematográfico",
  "R&B/Soul",
];

export default function FormStep3({
  data,
  onChange,
}: {
  data: any;
  onChange: (field: string, value: any) => void;
}) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <label className="block text-sm font-medium text-white/60 mb-3">Duração do Aftermovie</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {durations.map((dur) => (
            <button
              key={dur.id}
              onClick={() => onChange("duration", dur.id)}
              className={`p-4 rounded-xl border text-center transition-all ${
                data.duration === dur.id
                  ? "border-gold-400/60 bg-gold-400/10"
                  : "border-white/10 bg-white/[0.02] hover:bg-white/5"
              }`}
            >
              <div className="text-lg font-bold text-white/80">{dur.label}</div>
              <div className="text-xs text-white/30 mt-1">{dur.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white/60 mb-3">Momentos-chave</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {keyMoments.map((moment) => {
            const selected = (data.keyMoments || []).includes(moment.id);
            return (
              <button
                key={moment.id}
                onClick={() => {
                  const current = data.keyMoments || [];
                  onChange(
                    "keyMoments",
                    selected ? current.filter((m: string) => m !== moment.id) : [...current, moment.id]
                  );
                }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selected
                    ? "border-gold-400/60 bg-gold-400/10"
                    : "border-white/10 bg-white/[0.02] hover:bg-white/5"
                }`}
              >
                <span className="text-lg">{moment.emoji}</span>
                <div className="text-sm mt-1 text-white/60">{moment.label}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white/60 mb-2">Links de Vídeos de Referência</label>
        <div className="space-y-2">
          {[0, 1, 2].map((i) => (
            <input
              key={i}
              type="url"
              value={(data.videoLinks || [])[i] || ""}
              onChange={(e) => {
                const links = [...(data.videoLinks || ["", "", ""])];
                links[i] = e.target.value;
                onChange("videoLinks", links);
              }}
              placeholder={`Link ${i + 1} — YouTube ou Vimeo`}
              className="w-full px-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-gold-400/40 transition-colors text-sm"
            />
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white/60 mb-3">Trilha Sonora</label>
        <div className="flex flex-wrap gap-2">
          {soundtrackGenres.map((genre) => (
            <button
              key={genre}
              onClick={() => onChange("soundtrack", genre)}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                data.soundtrack === genre
                  ? "bg-gold-400/20 text-gold-300 border border-gold-400/40"
                  : "bg-white/[0.04] text-white/40 border border-white/10 hover:bg-white/[0.08]"
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
        <input
          type="text"
          value={data.soundtrackLink || ""}
          onChange={(e) => onChange("soundtrackLink", e.target.value)}
          placeholder="Ou cole o link de uma música de referência..."
          className="mt-3 w-full px-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-gold-400/40 transition-colors text-sm"
        />
      </div>
    </div>
  );
}
