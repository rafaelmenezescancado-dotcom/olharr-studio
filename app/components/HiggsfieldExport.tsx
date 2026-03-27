"use client";

interface HiggsfieldData {
  briefing: string;
  style: string;
  scenes?: string;
}

export default function HiggsfieldExport({ data }: { data: HiggsfieldData }) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-green-400 bg-clip-text text-transparent">
          Briefing para Higgsfield
        </h2>
        <p className="text-white/40 mt-2 text-sm">
          Copie este briefing para usar no Higgsfield e gerar o preview do aftermovie
        </p>
      </div>

      <div className="space-y-4">
        <div className="p-5 rounded-xl bg-white/[0.03] border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-green-400">Estilo</h4>
            <button
              onClick={() => copyToClipboard(data.style)}
              className="text-xs text-white/30 hover:text-white/60 transition-colors"
            >
              Copiar
            </button>
          </div>
          <p className="text-sm text-white/60">{data.style}</p>
        </div>

        <div className="p-5 rounded-xl bg-white/[0.03] border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-green-400">Briefing Completo</h4>
            <button
              onClick={() => copyToClipboard(data.briefing)}
              className="text-xs text-white/30 hover:text-white/60 transition-colors"
            >
              Copiar
            </button>
          </div>
          <pre className="text-sm text-white/50 whitespace-pre-wrap font-sans leading-relaxed">
            {data.briefing}
          </pre>
        </div>

        {data.scenes && (
          <div className="p-5 rounded-xl bg-white/[0.03] border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-green-400">Cenas para Vídeo</h4>
              <button
                onClick={() => copyToClipboard(data.scenes || "")}
                className="text-xs text-white/30 hover:text-white/60 transition-colors"
              >
                Copiar
              </button>
            </div>
            <pre className="text-sm text-white/50 whitespace-pre-wrap font-sans leading-relaxed">
              {data.scenes}
            </pre>
          </div>
        )}

        <a
          href="https://higgsfield.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full py-3 rounded-xl bg-green-400/10 text-green-400 text-sm font-medium border border-green-400/30 hover:bg-green-400/20 transition-colors text-center"
        >
          Abrir Higgsfield →
        </a>
      </div>
    </div>
  );
}
