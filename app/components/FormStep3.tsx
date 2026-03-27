"use client";

const keyMoments = [
  { id: "preparativos", label: "Preparativos" },
  { id: "entrada", label: "Entrada" },
  { id: "cerimonia", label: "Cerimônia" },
  { id: "discursos", label: "Discursos" },
  { id: "festa", label: "Festa/Celebração" },
  { id: "detalhes", label: "Detalhes/Decor" },
  { id: "drone", label: "Aéreas/Drone" },
  { id: "saida", label: "Saída/Encerramento" },
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

function formatDuration(seconds: number): string {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  if (min === 0) return `${sec}s`;
  if (sec === 0) return `${min}min`;
  return `${min}min ${sec}s`;
}

export default function FormStep3({
  data,
  onChange,
}: {
  data: any;
  onChange: (field: string, value: any) => void;
}) {
  const durationValue = data.durationSeconds || 180; // default 3min

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <label className="block text-sm font-medium text-white/60 mb-2">Duração do Aftermovie</label>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-white/30">30s</span>
          <span className="text-lg font-bold text-gold-400">{formatDuration(durationValue)}</span>
          <span className="text-xs text-white/30">10min</span>
        </div>
        <input
          type="range"
          min={30}
          max={600}
          step={30}
          value={durationValue}
          onChange={(e) => onChange("durationSeconds", Number(e.target.value))}
          className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-[#c8a44e] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gold-400 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(200,164,78,0.4)]"
        />
        <div className="flex justify-between mt-1 text-xs text-white/20">
          <span>Teaser</span>
          <span>Highlight</span>
          <span>Padrão</span>
          <span>Completo</span>
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
                className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                  selected
                    ? "border-gold-400/60 bg-gold-400/10 text-gold-300"
                    : "border-white/10 bg-white/[0.02] text-white/50 hover:bg-white/5"
                }`}
              >
                {moment.label}
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
