"use client";

interface Scene {
  number: number;
  title: string;
  description: string;
  camera: string;
  duration: string;
  mood: string;
  imagePrompt: string;
  transition: string;
}

interface StoryboardData {
  title: string;
  duration: string;
  soundtrack: string;
  scenes: Scene[];
}

export default function StoryboardView({
  data,
  images,
  onGenerateImage,
  loadingImages,
}: {
  data: StoryboardData;
  images: Record<string, string>;
  onGenerateImage: (prompt: string, key: string) => void;
  loadingImages: Set<string>;
}) {
  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">
          {data.title}
        </h2>
        <div className="flex items-center justify-center gap-3 mt-3">
          <span className="px-3 py-1 rounded-full bg-purple-400/10 text-purple-400 text-xs font-medium border border-purple-400/20">
            {data.duration}
          </span>
          <span className="px-3 py-1 rounded-full bg-white/5 text-white/40 text-xs border border-white/10">
            {data.soundtrack}
          </span>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-gold-400 via-purple-400 to-blue-400" />

        <div className="space-y-6">
          {data.scenes?.map((scene, i) => {
            const imageKey = `scene-${i}`;
            return (
              <div key={i} className="relative pl-16">
                {/* Dot */}
                <div className="absolute left-4 top-4 w-5 h-5 rounded-full bg-gold-400/20 border-2 border-gold-400 flex items-center justify-center">
                  <span className="text-[8px] font-bold text-gold-400">{scene.number || i + 1}</span>
                </div>

                <div className="p-5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-white/90">{scene.title}</h4>
                        <span className="text-xs text-white/20 font-mono">{scene.duration}</span>
                      </div>
                      <p className="text-sm text-white/50 mb-3">{scene.description}</p>

                      <div className="flex flex-wrap gap-2">
                        <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-blue-400/10 text-blue-400 text-xs">
                          <span>📹</span> {scene.camera}
                        </span>
                        <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-purple-400/10 text-purple-400 text-xs">
                          <span>🎭</span> {scene.mood}
                        </span>
                        {scene.transition && (
                          <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/5 text-white/30 text-xs">
                            ↝ {scene.transition}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Scene image thumbnail */}
                    <div className="w-32 h-20 rounded-lg border border-white/10 overflow-hidden flex-shrink-0">
                      {images[imageKey] ? (
                        <img
                          src={images[imageKey]}
                          alt={scene.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <button
                          onClick={() => onGenerateImage(scene.imagePrompt, imageKey)}
                          disabled={loadingImages.has(imageKey)}
                          className="w-full h-full bg-white/[0.02] flex items-center justify-center hover:bg-white/[0.05] transition-colors"
                        >
                          {loadingImages.has(imageKey) ? (
                            <div className="w-4 h-4 border-2 border-gold-400/40 border-t-gold-400 rounded-full animate-spin" />
                          ) : (
                            <span className="text-xs text-white/20">Gerar</span>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Generate all scene images */}
      {data.scenes?.length > 0 && (
        <button
          onClick={() => data.scenes.forEach((s, i) => onGenerateImage(s.imagePrompt, `scene-${i}`))}
          className="mt-6 w-full py-3 rounded-xl bg-purple-400/10 text-purple-400 text-sm font-medium border border-purple-400/30 hover:bg-purple-400/20 transition-colors"
        >
          Gerar Imagens de Todas as Cenas
        </button>
      )}
    </div>
  );
}
