import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY não configurada" },
        { status: 500 }
      );
    }

    // Try Imagen 3 first (available on free tier)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instances: [{ prompt }],
          parameters: {
            sampleCount: 1,
            aspectRatio: "16:9",
            safetyFilterLevel: "BLOCK_MEDIUM_AND_ABOVE",
          },
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      const imageData = data.predictions?.[0]?.bytesBase64Encoded;
      if (imageData) {
        return NextResponse.json({
          image: `data:image/png;base64,${imageData}`,
        });
      }
    }

    // Fallback: use Gemini 2.5 Flash with native image generation
    const fallbackResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: `Generate a cinematic, high-quality image: ${prompt}` },
              ],
            },
          ],
          generationConfig: {
            responseModalities: ["TEXT", "IMAGE"],
          },
        }),
      }
    );

    if (!fallbackResponse.ok) {
      const err = await fallbackResponse.text();
      console.error("Image generation error:", err);
      return NextResponse.json(
        { error: "Erro na geração de imagem. Tente novamente.", fallback: true },
        { status: fallbackResponse.status }
      );
    }

    const fallbackData = await fallbackResponse.json();
    const parts = fallbackData.candidates?.[0]?.content?.parts || [];
    const imagePart = parts.find((p: any) => p.inlineData);

    if (imagePart) {
      return NextResponse.json({
        image: `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`,
      });
    }

    return NextResponse.json({ error: "Nenhuma imagem gerada. Tente outro prompt." }, { status: 500 });
  } catch (error: any) {
    console.error("Image generation error:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao gerar imagem" },
      { status: 500 }
    );
  }
}
