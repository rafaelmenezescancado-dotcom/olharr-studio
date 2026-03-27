"use client";

import { useState, useCallback } from "react";
import Stepper from "./components/Stepper";
import FormStep1 from "./components/FormStep1";
import FormStep2 from "./components/FormStep2";
import FormStep3 from "./components/FormStep3";
import FormStep4 from "./components/FormStep4";
import MoodboardView from "./components/MoodboardView";
import StoryboardView from "./components/StoryboardView";
import HiggsfieldExport from "./components/HiggsfieldExport";
import { generateClientPDF, generateTeamPDF } from "./lib/generatePDF";

type AppState = "landing" | "form" | "loading" | "result";
type ResultTab = "moodboard" | "storyboard" | "higgsfield";

export default function Home() {
  const [appState, setAppState] = useState<AppState>("landing");
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({
    deliverables: ["moodboard", "storyboard"],
  });
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [resultTab, setResultTab] = useState<ResultTab>("moodboard");
  const [moodboardImages, setMoodboardImages] = useState<Record<number, string>>({});
  const [storyboardImages, setStoryboardImages] = useState<Record<string, string>>({});
  const [loadingMoodImages, setLoadingMoodImages] = useState<Set<number>>(new Set());
  const [loadingStoryImages, setLoadingStoryImages] = useState<Set<string>>(new Set());
  const [loadingProgress, setLoadingProgress] = useState("");

  const handleFormChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const generateMoodboardImage = useCallback(async (prompt: string, index: number) => {
    setLoadingMoodImages((prev) => new Set(prev).add(index));
    try {
      const res = await fetch("/api/images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (data.image) {
        setMoodboardImages((prev) => ({ ...prev, [index]: data.image }));
      }
    } catch (err) {
      console.error("Error generating image:", err);
    } finally {
      setLoadingMoodImages((prev) => {
        const next = new Set(prev);
        next.delete(index);
        return next;
      });
    }
  }, []);

  const generateStoryboardImage = useCallback(async (prompt: string, key: string) => {
    setLoadingStoryImages((prev) => new Set(prev).add(key));
    try {
      const res = await fetch("/api/images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (data.image) {
        setStoryboardImages((prev) => ({ ...prev, [key]: data.image }));
      }
    } catch (err) {
      console.error("Error generating image:", err);
    } finally {
      setLoadingStoryImages((prev) => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    }
  }, []);

  const handleGenerate = async () => {
    setAppState("loading");
    setError(null);
    setLoadingProgress("Ativando agente de IA...");

    try {
      const progressSteps = [
        { msg: "🎥 Diretor de Fotografia analisando estética...", delay: 2000 },
        { msg: "✍️ Roteirista criando arco narrativo...", delay: 4000 },
        { msg: "📊 Especialista estruturando apresentação...", delay: 6000 },
        { msg: "💻 Dev Front-End montando visualização...", delay: 8000 },
        { msg: "✨ Finalizando moodboard e storyboard...", delay: 10000 },
      ];

      progressSteps.forEach(({ msg, delay }) => {
        setTimeout(() => setLoadingProgress(msg), delay);
      });

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Erro ao gerar");
      }

      const data = await res.json();
      setResult(data);
      setAppState("result");
    } catch (err: any) {
      setError(err.message);
      setAppState("form");
    }
  };

  const handleExportClient = () => {
    if (!result) return;
    generateClientPDF({
      moodboard: result.moodboard,
      storyboard: result.storyboard,
      higgsfield: result.higgsfield,
      formData,
      moodboardImages,
      storyboardImages,
    });
  };

  const handleExportTeam = () => {
    if (!result) return;
    generateTeamPDF({
      moodboard: result.moodboard,
      storyboard: result.storyboard,
      higgsfield: result.higgsfield,
      formData,
      moodboardImages,
      storyboardImages,
    });
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else handleGenerate();
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  // LANDING
  if (appState === "landing") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-400/5 rounded-full blur-[120px]" />

        <div className="relative z-10 text-center max-w-2xl">
          <div className="inline-block px-4 py-1.5 border border-gold-400/30 rounded-full text-gold-400 text-xs font-semibold tracking-widest uppercase mb-8">
            Powered by Nano Banana + Gemini AI
          </div>

          <h1 className="text-5xl sm:text-7xl font-extrabold leading-[1.05] mb-6">
            <span className="bg-gradient-to-r from-white via-white to-gold-400 bg-clip-text text-transparent">
              Olharr
            </span>
            <br />
            <span className="text-gold-400">Studio</span>
          </h1>

          <p className="text-lg text-white/40 max-w-md mx-auto mb-10 leading-relaxed">
            Crie moodboards e storyboards cinematográficos para seus eventos
            com inteligência artificial.
          </p>

          <button
            onClick={() => setAppState("form")}
            className="px-8 py-4 bg-gold-400 text-black font-bold rounded-2xl text-lg hover:bg-gold-300 transition-all hover:scale-105 active:scale-95 pulse-gold"
          >
            Criar Moodboard & Storyboard
          </button>

          <div className="mt-16 flex items-center justify-center gap-8 text-white/20 text-sm">
            <div className="flex items-center gap-2">
              <span>🎥</span>
              <span>Dir. Fotografia</span>
            </div>
            <div className="flex items-center gap-2">
              <span>✍️</span>
              <span>Roteirista</span>
            </div>
            <div className="flex items-center gap-2">
              <span>📊</span>
              <span>Apresentações</span>
            </div>
            <div className="flex items-center gap-2">
              <span>💻</span>
              <span>Front-End</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // LOADING
  if (appState === "loading") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-gold-400/20 border-t-gold-400 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl">🤖</span>
          </div>
        </div>
        <p className="mt-6 text-white/60 text-center animate-pulse">{loadingProgress}</p>
        <div className="mt-4 flex gap-2">
          {["🎥", "✍️", "📊", "💻"].map((emoji, i) => (
            <span
              key={i}
              className="text-2xl animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            >
              {emoji}
            </span>
          ))}
        </div>
      </div>
    );
  }

  // RESULT
  if (appState === "result" && result) {
    return (
      <div className="min-h-screen">
        {/* Top bar */}
        <div className="sticky top-0 z-50 bg-[#0a0a0b]/90 backdrop-blur-xl border-b border-white/5">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
            <button
              onClick={() => {
                setAppState("form");
                setStep(3);
              }}
              className="text-sm text-white/40 hover:text-white/70 transition-colors"
            >
              ← Voltar ao formulário
            </button>

            <div className="flex gap-1">
              {[
                { id: "moodboard" as ResultTab, label: "Moodboard", emoji: "🎨" },
                { id: "storyboard" as ResultTab, label: "Storyboard", emoji: "🎬" },
                { id: "higgsfield" as ResultTab, label: "Higgsfield", emoji: "🎥" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setResultTab(tab.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    resultTab === tab.id
                      ? "bg-gold-400/10 text-gold-400 border border-gold-400/30"
                      : "text-white/30 hover:text-white/50"
                  }`}
                >
                  <span className="mr-1">{tab.emoji}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              {/* Export buttons */}
              <div className="relative group">
                <button className="px-3 py-2 rounded-lg text-sm font-medium bg-gold-400/10 text-gold-400 border border-gold-400/30 hover:bg-gold-400/20 transition-all">
                  PDF ↓
                </button>
                <div className="absolute right-0 top-full mt-1 bg-[#1a1a1d] border border-white/10 rounded-xl overflow-hidden opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all shadow-xl z-50 min-w-[200px]">
                  <button
                    onClick={handleExportClient}
                    className="w-full px-4 py-3 text-left text-sm hover:bg-white/5 transition-colors"
                  >
                    <div className="text-white/80 font-medium">Para o Cliente</div>
                    <div className="text-white/30 text-xs mt-0.5">Visual, elegante e limpo</div>
                  </button>
                  <div className="border-t border-white/5" />
                  <button
                    onClick={handleExportTeam}
                    className="w-full px-4 py-3 text-left text-sm hover:bg-white/5 transition-colors"
                  >
                    <div className="text-white/80 font-medium">Para a Equipe</div>
                    <div className="text-white/30 text-xs mt-0.5">Técnico, detalhado e completo</div>
                  </button>
                </div>
              </div>

              <button
                onClick={() => {
                  setAppState("landing");
                  setResult(null);
                  setFormData({ deliverables: ["moodboard", "storyboard"] });
                  setStep(0);
                  setMoodboardImages({});
                  setStoryboardImages({});
                }}
                className="text-sm text-white/40 hover:text-white/70 transition-colors"
              >
                Novo projeto
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-5xl mx-auto px-4 py-8">
          {resultTab === "moodboard" && result.moodboard && (
            <MoodboardView
              data={result.moodboard}
              images={moodboardImages}
              onGenerateImage={generateMoodboardImage}
              loadingImages={loadingMoodImages}
            />
          )}
          {resultTab === "storyboard" && result.storyboard && (
            <StoryboardView
              data={result.storyboard}
              images={storyboardImages}
              onGenerateImage={generateStoryboardImage}
              loadingImages={loadingStoryImages}
            />
          )}
          {resultTab === "higgsfield" && result.higgsfield && (
            <HiggsfieldExport data={result.higgsfield} />
          )}
        </div>
      </div>
    );
  }

  // FORM
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="py-6 px-4 text-center">
        <button
          onClick={() => setAppState("landing")}
          className="text-2xl font-bold bg-gradient-to-r from-white to-gold-400 bg-clip-text text-transparent"
        >
          Olharr Studio
        </button>
      </div>

      {/* Form container */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 pb-8">
        <Stepper current={step} onChange={setStep} />

        {error && (
          <div className="mb-4 p-4 rounded-xl bg-red-400/10 border border-red-400/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        {step === 0 && <FormStep1 data={formData} onChange={handleFormChange} />}
        {step === 1 && <FormStep2 data={formData} onChange={handleFormChange} />}
        {step === 2 && <FormStep3 data={formData} onChange={handleFormChange} />}
        {step === 3 && <FormStep4 data={formData} onChange={handleFormChange} />}

        {/* Navigation */}
        <div className="flex gap-3 mt-8">
          {step > 0 && (
            <button
              onClick={handleBack}
              className="px-6 py-3 rounded-xl border border-white/10 text-white/40 hover:text-white/70 hover:bg-white/5 transition-all"
            >
              Voltar
            </button>
          )}
          <button
            onClick={handleNext}
            className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
              step === 3
                ? "bg-gold-400 text-black hover:bg-gold-300 pulse-gold"
                : "bg-white/10 text-white hover:bg-white/15"
            }`}
          >
            {step === 3 ? "Gerar com IA" : "Próximo →"}
          </button>
        </div>
      </div>
    </div>
  );
}
