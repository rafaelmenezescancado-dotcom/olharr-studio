import { NextRequest, NextResponse } from "next/server";
import { ORCHESTRATOR_PROMPT } from "@/app/lib/personas";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY não configurada. Adicione no .env.local" },
        { status: 500 }
      );
    }

    // Build the briefing from form data
    const briefing = buildBriefing(body);

    // Call Claude API (Haiku 3.5 - cheapest option)
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 8192,
        temperature: 0.8,
        system: ORCHESTRATOR_PROMPT,
        messages: [
          {
            role: "user",
            content: `--- BRIEFING DO EVENTO ---\n${briefing}\n\nGere o JSON completo do moodboard e storyboard. Responda APENAS com o JSON válido.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Claude API error:", errorData);
      return NextResponse.json(
        { error: `Erro na API do Claude: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const text = data.content?.[0]?.text;

    if (!text) {
      return NextResponse.json(
        { error: "Resposta vazia do Claude" },
        { status: 500 }
      );
    }

    // Parse the JSON response
    let result;
    try {
      result = JSON.parse(text);
    } catch {
      // Try to extract JSON from markdown code blocks
      const jsonMatch =
        text.match(/```json?\s*([\s\S]*?)```/) || text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[1] || jsonMatch[0]);
      } else {
        throw new Error("Could not parse JSON from response");
      }
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Generate error:", error);
    return NextResponse.json(
      { error: error.message || "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

function buildBriefing(data: any): string {
  const parts: string[] = [];

  if (data.eventType) parts.push(`Tipo de evento: ${data.eventType}`);
  if (data.eventName) parts.push(`Nome: ${data.eventName}`);
  if (data.eventDate) parts.push(`Data: ${data.eventDate}`);
  if (data.eventLocation) parts.push(`Local: ${data.eventLocation}`);
  if (data.audience) parts.push(`Público-alvo: ${data.audience}`);
  if (data.guestCount) parts.push(`Convidados: ~${data.guestCount}`);
  if (data.mood) parts.push(`Mood/Atmosfera: ${data.mood}`);
  if (data.colorPalette?.length)
    parts.push(`Paleta de cores: ${data.colorPalette.join(", ")}`);
  if (data.picTimeLink) parts.push(`Link do álbum Pic-Time: ${data.picTimeLink}`);
  if (data.albumAnalysis) parts.push(`Análise do álbum (feita por IA): ${data.albumAnalysis}`);
  if (data.durationSeconds) {
    const min = Math.floor(data.durationSeconds / 60);
    const sec = data.durationSeconds % 60;
    const durStr = min > 0 ? (sec > 0 ? `${min}min ${sec}s` : `${min}min`) : `${sec}s`;
    parts.push(`Duração do aftermovie: ${durStr}`);
  }
  if (data.keyMoments?.length)
    parts.push(`Momentos-chave: ${data.keyMoments.join(", ")}`);
  if (data.videoLinks?.filter((l: string) => l).length)
    parts.push(
      `Vídeos de referência: ${data.videoLinks.filter((l: string) => l).join(", ")}`
    );
  if (data.soundtrack) parts.push(`Trilha sonora: ${data.soundtrack}`);
  if (data.soundtrackLink) parts.push(`Ref. trilha: ${data.soundtrackLink}`);
  if (data.notes) parts.push(`Notas adicionais: ${data.notes}`);
  if (data.equipment?.length)
    parts.push(`Equipamento: ${data.equipment.join(", ")}`);
  if (data.restrictions) parts.push(`Restrições: ${data.restrictions}`);
  if (data.deliverables?.length)
    parts.push(`Entregáveis: ${data.deliverables.join(", ")}`);
  if (data.meetingKeyPoints)
    parts.push(`\n--- PONTOS-CHAVE DA REUNIÃO COM CLIENTE ---\n${data.meetingKeyPoints}`);

  return parts.join("\n");
}
