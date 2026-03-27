"use client";

import { useState } from "react";

interface MoodboardData {
  title: string;
  subtitle?: string;
  colorPalette: string[];
  mood: string;
  style: string;
  imagePrompts: string[];
  references: string[];
  lighting: string;
  typography?: string;
}

export default function MoodboardView({
  data,
  images,
  onGenerateImage,
  loadingImages,
}: {
  data: MoodboardData;
  images: Record<number, string>;
  onGenerateImage: (prompt: string, index: number) => void;
  loadingImages: Set<number>;
}) {
  const [expandedImage, setExpandedImage] = useState<number | null>(null);

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gold-400 bg-clip-text text-transparent">
          {data.title}
        </h2>
        {data.subtitle && (
          <p className="text-white/40 mt-2">{data.subtitle}</p>
        )}
        <div className="flex items-center justify-center gap-3 mt-4">
          <span className="px-3 py-1 rounded-full bg-gold-400/10 text-gold-400 text-xs font-medium border border-gold-400/20">
            {data.mood}
          </span>
          <span className="px-3 py-1 rounded-full bg-white/5 text-white/40 text-xs border border-white/10">
            {data.style}
          </span>
        </div>
      </div>

      {/* Color Palette */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-white/40 mb-3 uppercase tracking-wider">Paleta de Cores</h3>
        <div className="flex gap-3">
          {data.colorPalette?.map((color, i) => (
            <div key={i} className="flex-1 group">
              <div
                className="h-20 rounded-xl border border-white/10 transition-transform group-hover:scale-105"
                style={{ backgroundColor: color }}
              />
              <div className="text-xs text-white/30 text-center mt-2 font-mono">{color}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Lighting & Style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
          <div className="text-xs font-medium text-white/30 uppercase tracking-wider mb-2">Iluminação</div>
          <p className="text-sm text-white/70">{data.lighting}</p>
        </div>
        {data.typography && (
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
            <div className="text-xs font-medium text-white/30 uppercase tracking-wider mb-2">Tipografia</div>
            <p className="text-sm text-white/70">{data.typography}</p>
          </div>
        )}
      </div>

      {/* References */}
      {data.references?.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-medium text-white/40 mb-3 uppercase tracking-wider">Referências Cinematográficas</h3>
          <div className="flex flex-wrap gap-2">
            {data.references.map((ref, i) => (
              <span
                key={i}
                className="px-3 py-1.5 rounded-lg bg-white/[0.04] text-white/50 text-sm border border-white/10"
              >
                {ref}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Image Grid */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-white/40 mb-3 uppercase tracking-wider">Imagens do Moodboard</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {data.imagePrompts?.map((prompt, i) => (
            <div
              key={i}
              className={`relative aspect-[16/10] rounded-xl border border-white/10 overflow-hidden group cursor-pointer transition-all ${
                expandedImage === i ? "col-span-2 row-span-2" : ""
              }`}
              onClick={() => setExpandedImage(expandedImage === i ? null : i)}
            >
              {images[i] ? (
                <img
                  src={images[i]}
                  alt={prompt}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-white/[0.03] flex flex-col items-center justify-center p-4">
                  {loadingImages.has(i) ? (
                    <>
                      <div className="w-6 h-6 border-2 border-gold-400/40 border-t-gold-400 rounded-full animate-spin mb-2" />
                      <span className="text-xs text-white/20">Gerando...</span>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onGenerateImage(prompt, i);
                        }}
                        className="px-4 py-2 rounded-lg bg-gold-400/10 text-gold-400 text-xs font-medium border border-gold-400/30 hover:bg-gold-400/20 transition-colors"
                      >
                        Gerar Imagem
                      </button>
                      <p className="text-[10px] text-white/20 mt-2 text-center line-clamp-2">
                        {prompt}
                      </p>
                    </>
                  )}
                </div>
              )}
              {images[i] && (
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <p className="text-[10px] text-white/70 line-clamp-3">{prompt}</p>
                </div>
              )}
            </div>
          ))}
        </div>
        {data.imagePrompts?.length > 0 && !Object.keys(images).length && (
          <button
            onClick={() => data.imagePrompts.forEach((p, i) => onGenerateImage(p, i))}
            className="mt-4 w-full py-3 rounded-xl bg-gold-400/10 text-gold-400 text-sm font-medium border border-gold-400/30 hover:bg-gold-400/20 transition-colors"
          >
            Gerar Todas as Imagens com Nano Banana
          </button>
        )}
      </div>
    </div>
  );
}
