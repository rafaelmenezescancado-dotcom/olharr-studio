import { NextRequest, NextResponse } from "next/server";
import { ORCHESTRATOR_PROMPT } from "@/app/lib/personas";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY não configurada. Adicione no .env.local" },
        { status: 500 }
      );
    }

    // Build the briefing from form data
    const briefing = buildBriefing(body);

    // Call Gemini API for the orchestrator
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `${ORCHESTRATOR_PROMPT}\n\n--- BRIEFING DO EVENTO ---\n${briefing}\n\nGere o JSON completo do moodboard e storyboard.`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.8,
            topP: 0.95,
            maxOutputTokens: 8192,
            responseMimeType: "application/json",
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Gemini API error:", errorData);
      return NextResponse.json(
        { error: `Erro na API do Gemini: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return NextResponse.json(
        { error: "Resposta vazia do Gemini" },
        { status: 500 }
      );
    }

    // Parse the JSON response
    let result;
    try {
      result = JSON.parse(text);
    } catch {
      // Try to extract JSON from markdown code blocks
      const jsonMatch = text.match(/```json?\s*([\s\S]*?)```/) || text.match(/\{[\s\S]*\}/);
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
  if (data.photoStyle) parts.push(`Estilo fotográfico: ${data.photoStyle}`);
  if (data.duration) parts.push(`Duração do aftermovie: ${data.duration}`);
  if (data.keyMoments?.length)
    parts.push(`Momentos-chave: ${data.keyMoments.join(", ")}`);
  if (data.videoLinks?.filter((l: string) => l).length)
    parts.push(`Vídeos de referência: ${data.videoLinks.filter((l: string) => l).join(", ")}`);
  if (data.soundtrack) parts.push(`Trilha sonora: ${data.soundtrack}`);
  if (data.soundtrackLink) parts.push(`Ref. trilha: ${data.soundtrackLink}`);
  if (data.notes) parts.push(`Notas adicionais: ${data.notes}`);
  if (data.equipment?.length)
    parts.push(`Equipamento: ${data.equipment.join(", ")}`);
  if (data.restrictions) parts.push(`Restrições: ${data.restrictions}`);
  if (data.deliverables?.length)
    parts.push(`Entregáveis: ${data.deliverables.join(", ")}`);

  return parts.join("\n");
}
