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

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt é obrigatório" },
        { status: 400 }
      );
    }

    // Try Imagen 3 first (Google AI Studio free tier format)
    try {
      const imagenResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-fast-generate-001:predict?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: prompt,
            config: {
              numberOfImages: 1,
              aspectRatio: "16:9",
            },
          }),
        }
      );

      if (imagenResponse.ok) {
        const imagenData = await imagenResponse.json();
        const imageBytes =
          imagenData.generatedImages?.[0]?.image?.imageBytes;
        if (imageBytes) {
          return NextResponse.json({
            image: `data:image/png;base64,${imageBytes}`,
          });
        }
      } else {
        const errText = await imagenResponse.text();
        console.log("Imagen 3 failed, trying Gemini fallback:", errText);
      }
    } catch (imagenError) {
      console.log("Imagen 3 error, trying Gemini fallback:", imagenError);
    }

    // Fallback: use Gemini 2.0 Flash with native image generation
    // (gemini-2.0-flash-exp supports responseModalities with IMAGE)
    const fallbackResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Generate a cinematic, high-quality, professional photograph for an event moodboard. The image should be: ${prompt}`,
                },
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
      console.error("Gemini image fallback error:", err);
      return NextResponse.json(
        {
          error: "Não foi possível gerar a imagem. Tente novamente em alguns segundos.",
          details: err,
        },
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

    return NextResponse.json(
      { error: "Nenhuma imagem gerada. Tente outro prompt ou tente novamente." },
      { status: 500 }
    );
  } catch (error: any) {
    console.error("Image generation error:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao gerar imagem" },
      { status: 500 }
    );
  }
}
