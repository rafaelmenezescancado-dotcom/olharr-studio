import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { text, fileName } = await req.json();
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY não configurada" },
        { status: 500 }
      );
    }

    if (!text) {
      return NextResponse.json(
        { error: "Texto do resumo é obrigatório" },
        { status: 400 }
      );
    }

    // Use Claude to extract key points from the meeting summary
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: `Você é um assistente de produção audiovisual. Analise este resumo de reunião com o cliente e extraia os pontos mais importantes para a criação de um moodboard e storyboard de evento.

Foque em:
- Preferências visuais e estéticas do cliente
- Momentos-chave que o cliente quer destacar
- Restrições ou pedidos especiais
- Tom e mood desejado
- Referências mencionadas
- Decisões tomadas sobre o projeto

Responda em português brasileiro, em formato de lista com os pontos principais (sem bullets, use "•" no início de cada ponto). Seja conciso e direto.

--- RESUMO DA REUNIÃO (${fileName || "arquivo"}) ---
${text.slice(0, 10000)}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Claude extraction error:", err);
      return NextResponse.json(
        { error: "Erro ao processar resumo" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const keyPoints = data.content?.[0]?.text;

    return NextResponse.json({
      keyPoints: keyPoints || "Não foi possível extrair os pontos-chave.",
    });
  } catch (error: any) {
    console.error("Meeting extraction error:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao processar resumo" },
      { status: 500 }
    );
  }
}
