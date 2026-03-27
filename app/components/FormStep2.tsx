"use client";

import { useState } from "react";

const moods = [
  { id: "elegante", label: "Elegante", emoji: "✨", desc: "Sofisticado e refinado" },
  { id: "energetico", label: "Enérgico", emoji: "⚡", desc: "Dinâmico e vibrante" },
  { id: "intimo", label: "Íntimo", emoji: "🕯️", desc: "Aconchegante e pessoal" },
  { id: "luxuoso", label: "Luxuoso", emoji: "👑", desc: "Opulento e grandioso" },
  { id: "rustico", label: "Rústico", emoji: "🌿", desc: "Natural e orgânico" },
  { id: "moderno", label: "Moderno", emoji: "🔮", desc: "Clean e contemporâneo" },
  { id: "vintage", label: "Vintage", emoji: "📷", desc: "Nostálgico e atemporal" },
  { id: "minimalista", label: "Minimalista", emoji: "◻️", desc: "Simples e essencial" },
];

const photoStyles = [
  { id: "cinematic", label: "Cinematic", desc: "35mm film look, shallow DOF" },
  { id: "documental", label: "Documental", desc: "Momentos reais e espontâneos" },
  { id: "fashion", label: "Fashion", desc: "Editorial, poses, alta produção" },
  { id: "editorial", label: "Editorial", desc: "Storytelling jornalístico" },
  { id: "fine-art", label: "Fine Art", desc: "Artístico e conceitual" },
];

const defaultPalettes = [
  { name: "Dourado Clássico", colors: ["#c8a44e", "#8b6914", "#f5e6c8", "#2c1810", "#e8d5b0"] },
  { name: "Azul Noturno", colors: ["#1a365d", "#2b6cb0", "#bee3f8", "#0d1b2a", "#63b3ed"] },
  { name: "Rosa Blush", colors: ["#c53030", "#fc8181", "#fef5f5", "#2d1515", "#feb2b2"] },
  { name: "Verde Natureza", colors: ["#276749", "#48bb78", "#f0fff4", "#1a2e1a", "#9ae6b4"] },
  { name: "Roxo Luxo", colors: ["#553c9a", "#9f7aea", "#faf5ff", "#1a0a2e", "#d6bcfa"] },
  { name: "Terracota", colors: ["#c05621", "#ed8936", "#fefcf3", "#2d1a0a", "#fbd38d"] },
];

export default function FormStep2({
  data,
  onChange,
}: {
  data: any;
  onChange: (field: string, value: any) => void;
}) {
  const [customColor, setCustomColor] = useState("#c8a44e");

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <label className="block text-sm font-medium text-white/60 mb-3">Mood / Atmosfera</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {moods.map((mood) => (
            <button
              key={mood.id}
              onClick={() => onChange("mood", mood.id)}
              className={`p-3 rounded-xl border text-center transition-all ${
                data.mood === mood.id
                  ? "border-gold-400/60 bg-gold-400/10"
                  : "border-white/10 bg-white/[0.02] hover:bg-white/5"
              }`}
            >
              <span className="text-2xl">{mood.emoji}</span>
              <div className="text-sm font-medium mt-1 text-white/80">{mood.label}</div>
              <div className="text-xs text-white/30 mt-0.5">{mood.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white/60 mb-3">Paleta de Cores</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {defaultPalettes.map((palette) => (
            <button
              key={palette.name}
              onClick={() => onChange("colorPalette", palette.colors)}
              className={`p-3 rounded-xl border transition-all ${
                JSON.stringify(data.colorPalette) === JSON.stringify(palette.colors)
                  ? "border-gold-400/60 bg-gold-400/10"
                  : "border-white/10 bg-white/[0.02] hover:bg-white/5"
              }`}
            >
              <div className="flex gap-1 mb-2">
                {palette.colors.map((c, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full border border-white/10"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              <div className="text-xs font-medium text-white/60">{palette.name}</div>
            </button>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-3">
          <input
            type="color"
            value={customColor}
            onChange={(e) => setCustomColor(e.target.value)}
            className="w-10 h-10 rounded-lg border border-white/10 bg-transparent cursor-pointer"
          />
          <button
            onClick={() => {
              const current = data.colorPalette || [];
              if (current.length < 6) onChange("colorPalette", [...current, customColor]);
            }}
            className="text-sm text-gold-400 hover:text-gold-300 transition-colors"
          >
            + Adicionar cor customizada
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white/60 mb-3">Estilo Fotográfico</label>
        <div className="flex flex-wrap gap-2">
          {photoStyles.map((style) => (
            <button
              key={style.id}
              onClick={() => onChange("photoStyle", style.id)}
              className={`px-4 py-2.5 rounded-xl text-sm transition-all ${
                data.photoStyle === style.id
                  ? "bg-gold-400/20 text-gold-300 border border-gold-400/40"
                  : "bg-white/[0.04] text-white/40 border border-white/10 hover:bg-white/[0.08]"
              }`}
            >
              <div className="font-medium">{style.label}</div>
              <div className="text-xs opacity-60 mt-0.5">{style.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white/60 mb-2">Imagens de Referência (upload)</label>
        <div className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center hover:border-gold-400/30 transition-colors cursor-pointer">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              onChange("referenceImages", files);
            }}
            className="hidden"
            id="ref-images"
          />
          <label htmlFor="ref-images" className="cursor-pointer">
            <div className="text-3xl mb-2">📸</div>
            <div className="text-sm text-white/40">Arraste imagens de referência ou clique para selecionar</div>
            <div className="text-xs text-white/20 mt-1">PNG, JPG até 10MB cada</div>
          </label>
        </div>
        {data.referenceImages?.length > 0 && (
          <div className="mt-2 text-sm text-gold-400">
            {data.referenceImages.length} imagem(ns) selecionada(s)
          </div>
        )}
      </div>
    </div>
  );
}
