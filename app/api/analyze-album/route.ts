import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY não configurada" },
        { status: 500 }
      );
    }

    if (!url) {
      return NextResponse.json(
        { error: "URL do álbum é obrigatória" },
        { status: 400 }
      );
    }

    // Fetch the Pic-Time album page to get metadata and image URLs
    let pageContent = "";
    try {
      const pageResponse = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; OlharrStudio/1.0; +https://olharr-studio.vercel.app)",
        },
      });
      if (pageResponse.ok) {
        const html = await pageResponse.text();
        // Extract relevant text content (title, descriptions, meta tags, image alt texts)
        const titleMatch = html.match(/<title>(.*?)<\/title>/i);
        const metaDesc = html.match(
          /<meta\s+name="description"\s+content="(.*?)"/i
        );
        const ogImage = html.match(
          /<meta\s+property="og:image"\s+content="(.*?)"/i
        );
        const altTexts = [...html.matchAll(/alt="(.*?)"/gi)]
          .map((m) => m[1])
          .filter((t) => t.length > 3)
          .slice(0, 20);

        pageContent = [
          titleMatch ? `Título: ${titleMatch[1]}` : "",
          metaDesc ? `Descrição: ${metaDesc[1]}` : "",
          ogImage ? `Imagem principal: ${ogImage[1]}` : "",
          altTexts.length > 0
            ? `Textos das imagens: ${altTexts.join(", ")}`
            : "",
          `URL do álbum: ${url}`,
        ]
          .filter(Boolean)
          .join("\n");
      }
    } catch (fetchError) {
      console.log("Could not fetch album page, analyzing URL only:", fetchError);
      pageContent = `URL do álbum: ${url}`;
    }

    // Use Claude to analyze the album style
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 500,
        messages: [
          {
            role: "user",
            content: `Analise este álbum de fotos de evento e descreva em 2-3 frases curtas o estilo visual provável.
Considere: paleta de cores predominante, estilo de iluminação, composição, mood geral e estilo fotográfico (cinematic, documental, editorial, fine-art, etc).
Responda em português brasileiro, de forma concisa e técnica.

Dados do álbum:
${pageContent}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Claude analysis error:", err);
      return NextResponse.json(
        { error: "Erro ao analisar álbum" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const analysis = data.content?.[0]?.text;

    return NextResponse.json({ analysis: analysis || "Análise não disponível" });
  } catch (error: any) {
    console.error("Album analysis error:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao analisar álbum" },
      { status: 500 }
    );
  }
}
