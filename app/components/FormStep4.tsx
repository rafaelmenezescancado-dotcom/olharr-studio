"use client";

import { useState } from "react";

const equipment = [
  { id: "camera-cinema", label: "Câmera Cinema" },
  { id: "drone", label: "Drone" },
  { id: "gimbal", label: "Gimbal/Steadicam" },
  { id: "slider", label: "Slider/Trilho" },
  { id: "iluminacao", label: "Iluminação extra" },
  { id: "audio", label: "Captação de áudio" },
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
  const [meetingFileStatus, setMeetingFileStatus] = useState<"idle" | "reading" | "done" | "error">("idle");
  const [meetingFileName, setMeetingFileName] = useState<string>("");

  const handleMeetingFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMeetingFileName(file.name);
    setMeetingFileStatus("reading");

    try {
      const text = await file.text();

      // Send to API to extract key points
      const res = await fetch("/api/extract-meeting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, fileName: file.name }),
      });

      const result = await res.json();
      if (result.keyPoints) {
        onChange("meetingKeyPoints", result.keyPoints);
        onChange("meetingRawText", text);
        setMeetingFileStatus("done");
      } else {
        setMeetingFileStatus("error");
      }
    } catch {
      setMeetingFileStatus("error");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Upload de resumo de reunião */}
      <div>
        <label className="block text-sm font-medium text-white/60 mb-2">
          Resumo da Reunião com o Cliente
        </label>
        <p className="text-xs text-white/30 mb-3">
          Envie o arquivo de resumo da reunião e a IA vai extrair os pontos mais importantes
        </p>
        <div
          className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer ${
            meetingFileStatus === "done"
              ? "border-green-400/30 bg-green-400/5"
              : "border-white/10 hover:border-gold-400/30"
          }`}
        >
          <input
            type="file"
            accept=".txt,.doc,.docx,.pdf,.md,.rtf"
            onChange={handleMeetingFile}
            className="hidden"
            id="meeting-file"
          />
          <label htmlFor="meeting-file" className="cursor-pointer">
            {meetingFileStatus === "idle" && (
              <>
                <div className="text-3xl mb-2">📋</div>
                <div className="text-sm text-white/40">
                  Arraste o arquivo de resumo da reunião ou clique para selecionar
                </div>
                <div className="text-xs text-white/20 mt-1">.txt, .doc, .docx, .pdf, .md</div>
              </>
            )}
            {meetingFileStatus === "reading" && (
              <>
                <div className="text-3xl mb-2 animate-pulse">🤖</div>
                <div className="text-sm text-gold-400">Analisando resumo da reunião...</div>
              </>
            )}
            {meetingFileStatus === "done" && (
              <>
                <div className="text-3xl mb-2">✅</div>
                <div className="text-sm text-green-400">
                  {meetingFileName} — pontos extraídos com sucesso
                </div>
                <div className="text-xs text-white/30 mt-1">Clique para trocar o arquivo</div>
              </>
            )}
            {meetingFileStatus === "error" && (
              <>
                <div className="text-3xl mb-2">⚠️</div>
                <div className="text-sm text-red-400">Erro ao analisar. Tente outro formato.</div>
              </>
            )}
          </label>
        </div>

        {meetingFileStatus === "done" && data.meetingKeyPoints && (
          <div className="mt-3 p-4 rounded-xl bg-gold-400/5 border border-gold-400/20">
            <div className="text-xs font-medium text-gold-400 mb-2">
              Pontos-chave extraídos da reunião:
            </div>
            <div className="text-sm text-white/60 whitespace-pre-line">{data.meetingKeyPoints}</div>
          </div>
        )}
      </div>

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
                className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                  selected
                    ? "border-gold-400/60 bg-gold-400/10 text-gold-300"
                    : "border-white/10 bg-white/[0.02] text-white/50 hover:bg-white/5"
                }`}
              >
                {equip.label}
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
