import jsPDF from "jspdf";

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

interface StoryboardScene {
  number: number;
  title: string;
  description: string;
  camera: string;
  duration: number;
  mood: string;
  imagePrompt: string;
  transition: string;
}

interface StoryboardData {
  title: string;
  duration: string;
  soundtrack: string;
  scenes: StoryboardScene[];
}

interface HiggsfieldData {
  briefing: string;
  style: string;
  scenes: string;
}

interface ExportData {
  moodboard?: MoodboardData;
  storyboard?: StoryboardData;
  higgsfield?: HiggsfieldData;
  formData?: Record<string, any>;
  moodboardImages?: Record<number, string>;
  storyboardImages?: Record<string, string>;
}

// Helper: hex to RGB
function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : [200, 164, 78];
}

// Helper: add image from base64
function addImageSafe(
  doc: jsPDF,
  imgData: string,
  x: number,
  y: number,
  w: number,
  h: number
) {
  try {
    const format = imgData.includes("image/png") ? "PNG" : "JPEG";
    doc.addImage(imgData, format, x, y, w, h);
  } catch {
    // If image fails, draw placeholder
    doc.setFillColor(30, 30, 30);
    doc.rect(x, y, w, h, "F");
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text("Imagem não disponível", x + w / 2, y + h / 2, { align: "center" });
  }
}

// Helper: wrap text
function wrapText(doc: jsPDF, text: string, maxWidth: number): string[] {
  return doc.splitTextToSize(text, maxWidth);
}

// ============================================
// CLIENT PDF - Visual, clean, for the client
// ============================================
export function generateClientPDF(data: ExportData): void {
  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = 0;

  const gold: [number, number, number] = [200, 164, 78];
  const darkBg: [number, number, number] = [15, 15, 17];
  const white: [number, number, number] = [255, 255, 255];
  const gray: [number, number, number] = [150, 150, 150];

  // --- COVER PAGE ---
  doc.setFillColor(...darkBg);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  // Gold accent line
  doc.setFillColor(...gold);
  doc.rect(margin, 80, 40, 1, "F");

  // Title
  doc.setTextColor(...white);
  doc.setFontSize(32);
  doc.setFont("helvetica", "bold");
  const title = data.moodboard?.title || "Moodboard & Storyboard";
  const titleLines = wrapText(doc, title, contentWidth);
  y = 95;
  titleLines.forEach((line) => {
    doc.text(line, margin, y);
    y += 14;
  });

  // Subtitle
  if (data.moodboard?.subtitle) {
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...gray);
    const subLines = wrapText(doc, data.moodboard.subtitle, contentWidth);
    subLines.forEach((line) => {
      doc.text(line, margin, y);
      y += 6;
    });
  }

  // Event info
  y += 15;
  doc.setFontSize(10);
  doc.setTextColor(...gold);
  if (data.formData?.eventName) {
    doc.text(data.formData.eventName, margin, y);
    y += 6;
  }
  if (data.formData?.eventDate) {
    doc.text(data.formData.eventDate, margin, y);
    y += 6;
  }

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(80, 80, 80);
  doc.text("Criado com Olharr Studio", margin, pageHeight - 20);
  doc.setTextColor(...gold);
  doc.text("olharr-studio.vercel.app", margin, pageHeight - 14);

  // --- MOODBOARD PAGE ---
  if (data.moodboard) {
    doc.addPage();
    doc.setFillColor(...darkBg);
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    y = margin;

    // Section title
    doc.setFontSize(8);
    doc.setTextColor(...gold);
    doc.setFont("helvetica", "bold");
    doc.text("MOODBOARD", margin, y);
    y += 10;

    // Mood & Style tags
    doc.setFontSize(10);
    doc.setTextColor(...white);
    doc.setFont("helvetica", "bold");
    doc.text(data.moodboard.mood, margin, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...gray);
    doc.text(` — ${data.moodboard.style}`, margin + doc.getTextWidth(data.moodboard.mood) + 2, y);
    y += 12;

    // Color Palette
    doc.setFontSize(8);
    doc.setTextColor(...gold);
    doc.setFont("helvetica", "bold");
    doc.text("PALETA DE CORES", margin, y);
    y += 6;

    const swatchSize = 18;
    const swatchGap = 4;
    data.moodboard.colorPalette?.forEach((color, i) => {
      const x = margin + i * (swatchSize + swatchGap);
      const [r, g, b] = hexToRgb(color);
      doc.setFillColor(r, g, b);
      doc.roundedRect(x, y, swatchSize, swatchSize, 2, 2, "F");
      doc.setFontSize(6);
      doc.setTextColor(...gray);
      doc.text(color, x + swatchSize / 2, y + swatchSize + 4, { align: "center" });
    });
    y += swatchSize + 12;

    // Lighting
    doc.setFontSize(8);
    doc.setTextColor(...gold);
    doc.setFont("helvetica", "bold");
    doc.text("ILUMINAÇÃO", margin, y);
    y += 5;
    doc.setFontSize(9);
    doc.setTextColor(...white);
    doc.setFont("helvetica", "normal");
    const lightLines = wrapText(doc, data.moodboard.lighting, contentWidth);
    lightLines.forEach((line) => {
      doc.text(line, margin, y);
      y += 4.5;
    });
    y += 6;

    // References
    if (data.moodboard.references?.length) {
      doc.setFontSize(8);
      doc.setTextColor(...gold);
      doc.setFont("helvetica", "bold");
      doc.text("REFERÊNCIAS", margin, y);
      y += 5;
      doc.setFontSize(9);
      doc.setTextColor(...gray);
      doc.setFont("helvetica", "normal");
      data.moodboard.references.forEach((ref) => {
        doc.text(`• ${ref}`, margin + 2, y);
        y += 5;
      });
      y += 6;
    }

    // Moodboard images (if available)
    const images = data.moodboardImages || {};
    const imgKeys = Object.keys(images).map(Number);
    if (imgKeys.length > 0) {
      doc.setFontSize(8);
      doc.setTextColor(...gold);
      doc.setFont("helvetica", "bold");
      doc.text("IMAGENS DO MOODBOARD", margin, y);
      y += 6;

      const imgW = (contentWidth - 4) / 2;
      const imgH = imgW * 0.6;
      let col = 0;

      imgKeys.forEach((key) => {
        if (y + imgH > pageHeight - margin) {
          doc.addPage();
          doc.setFillColor(...darkBg);
          doc.rect(0, 0, pageWidth, pageHeight, "F");
          y = margin;
        }
        const x = margin + col * (imgW + 4);
        addImageSafe(doc, images[key], x, y, imgW, imgH);
        col++;
        if (col >= 2) {
          col = 0;
          y += imgH + 4;
        }
      });
      if (col > 0) y += imgH + 4;
    }
  }

  // --- STORYBOARD PAGE ---
  if (data.storyboard) {
    doc.addPage();
    doc.setFillColor(...darkBg);
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    y = margin;

    doc.setFontSize(8);
    doc.setTextColor(...gold);
    doc.setFont("helvetica", "bold");
    doc.text("STORYBOARD", margin, y);
    y += 8;

    doc.setFontSize(14);
    doc.setTextColor(...white);
    doc.setFont("helvetica", "bold");
    doc.text(data.storyboard.title, margin, y);
    y += 8;

    doc.setFontSize(9);
    doc.setTextColor(...gray);
    doc.setFont("helvetica", "normal");
    doc.text(`Duração: ${data.storyboard.duration}  |  Trilha: ${data.storyboard.soundtrack}`, margin, y);
    y += 12;

    // Scenes
    data.storyboard.scenes?.forEach((scene) => {
      if (y > pageHeight - 50) {
        doc.addPage();
        doc.setFillColor(...darkBg);
        doc.rect(0, 0, pageWidth, pageHeight, "F");
        y = margin;
      }

      // Scene card background
      doc.setFillColor(25, 25, 28);
      doc.roundedRect(margin, y, contentWidth, 30, 2, 2, "F");

      // Scene number + title
      doc.setFontSize(10);
      doc.setTextColor(...gold);
      doc.setFont("helvetica", "bold");
      doc.text(`Cena ${scene.number}`, margin + 4, y + 7);
      doc.setTextColor(...white);
      doc.text(scene.title, margin + 30, y + 7);

      // Description
      doc.setFontSize(8);
      doc.setTextColor(...gray);
      doc.setFont("helvetica", "normal");
      const descLines = wrapText(doc, scene.description, contentWidth - 8);
      let descY = y + 14;
      descLines.slice(0, 3).forEach((line) => {
        doc.text(line, margin + 4, descY);
        descY += 4;
      });

      // Duration badge
      doc.setFontSize(7);
      doc.setTextColor(...gold);
      doc.text(`${scene.duration}s`, margin + contentWidth - 15, y + 7);

      y += 34;
    });
  }

  // Save
  const fileName = data.formData?.eventName
    ? `${data.formData.eventName.replace(/\s+/g, "_")}_cliente.pdf`
    : "moodboard_cliente.pdf";
  doc.save(fileName);
}

// ============================================
// TEAM PDF - Technical, detailed, for the crew
// ============================================
export function generateTeamPDF(data: ExportData): void {
  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let y = 0;

  const gold: [number, number, number] = [200, 164, 78];
  const darkBg: [number, number, number] = [15, 15, 17];
  const white: [number, number, number] = [255, 255, 255];
  const gray: [number, number, number] = [150, 150, 150];
  const lightGray: [number, number, number] = [200, 200, 200];

  // --- COVER ---
  doc.setFillColor(...darkBg);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  doc.setFillColor(...gold);
  doc.rect(margin, 60, 30, 1, "F");

  y = 72;
  doc.setTextColor(...white);
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  const title = data.moodboard?.title || "Moodboard & Storyboard";
  wrapText(doc, title, contentWidth).forEach((line) => {
    doc.text(line, margin, y);
    y += 12;
  });

  doc.setFontSize(12);
  doc.setTextColor(...gold);
  doc.text("DOCUMENTO TÉCNICO — EQUIPE INTERNA", margin, y + 5);
  y += 20;

  // Event details box
  doc.setFillColor(25, 25, 28);
  doc.roundedRect(margin, y, contentWidth, 50, 2, 2, "F");

  doc.setFontSize(8);
  doc.setTextColor(...gold);
  doc.setFont("helvetica", "bold");
  doc.text("DETALHES DO EVENTO", margin + 5, y + 8);

  doc.setFontSize(9);
  doc.setTextColor(...lightGray);
  doc.setFont("helvetica", "normal");
  let infoY = y + 16;
  const fd = data.formData || {};
  if (fd.eventType) { doc.text(`Tipo: ${fd.eventType}`, margin + 5, infoY); infoY += 5; }
  if (fd.eventName) { doc.text(`Nome: ${fd.eventName}`, margin + 5, infoY); infoY += 5; }
  if (fd.eventDate) { doc.text(`Data: ${fd.eventDate}`, margin + 5, infoY); infoY += 5; }
  if (fd.eventLocation) { doc.text(`Local: ${fd.eventLocation}`, margin + 5, infoY); infoY += 5; }
  if (fd.audience) { doc.text(`Público: ${fd.audience}`, margin + 5, infoY); infoY += 5; }
  if (fd.guestCount) { doc.text(`Convidados: ~${fd.guestCount}`, margin + 100, y + 16); }
  if (fd.durationSeconds) {
    const min = Math.floor(fd.durationSeconds / 60);
    const sec = fd.durationSeconds % 60;
    const dur = min > 0 ? (sec > 0 ? `${min}min ${sec}s` : `${min}min`) : `${sec}s`;
    doc.text(`Duração aftermovie: ${dur}`, margin + 100, y + 21);
  }
  if (fd.equipment?.length) {
    doc.text(`Equipamento: ${fd.equipment.join(", ")}`, margin + 100, y + 26);
  }

  // Footer
  doc.setFontSize(7);
  doc.setTextColor(60, 60, 60);
  doc.text("CONFIDENCIAL — USO INTERNO | Olharr Studio", margin, pageHeight - 12);

  // --- MOODBOARD PAGE ---
  if (data.moodboard) {
    doc.addPage();
    doc.setFillColor(...darkBg);
    doc.rect(0, 0, pageWidth, pageHeight, "F");
    y = margin;

    doc.setFontSize(8);
    doc.setTextColor(...gold);
    doc.setFont("helvetica", "bold");
    doc.text("01 — MOODBOARD", margin, y);
    y += 10;

    // Color palette
    doc.setFontSize(7);
    doc.text("PALETA DE CORES", margin, y);
    y += 5;
    const sw = 14;
    data.moodboard.colorPalette?.forEach((color, i) => {
      const x = margin + i * (sw + 3);
      const [r, g, b] = hexToRgb(color);
      doc.setFillColor(r, g, b);
      doc.roundedRect(x, y, sw, sw, 1.5, 1.5, "F");
      doc.setFontSize(5);
      doc.setTextColor(...gray);
      doc.text(color, x + sw / 2, y + sw + 3, { align: "center" });
    });
    y += sw + 10;

    // Two columns: Lighting + Typography
    const colW = (contentWidth - 6) / 2;

    doc.setFillColor(25, 25, 28);
    doc.roundedRect(margin, y, colW, 35, 2, 2, "F");
    doc.setFontSize(7);
    doc.setTextColor(...gold);
    doc.setFont("helvetica", "bold");
    doc.text("ILUMINAÇÃO", margin + 4, y + 7);
    doc.setFontSize(8);
    doc.setTextColor(...lightGray);
    doc.setFont("helvetica", "normal");
    wrapText(doc, data.moodboard.lighting, colW - 8).slice(0, 5).forEach((line, i) => {
      doc.text(line, margin + 4, y + 13 + i * 4);
    });

    if (data.moodboard.typography) {
      doc.setFillColor(25, 25, 28);
      doc.roundedRect(margin + colW + 6, y, colW, 35, 2, 2, "F");
      doc.setFontSize(7);
      doc.setTextColor(...gold);
      doc.setFont("helvetica", "bold");
      doc.text("TIPOGRAFIA", margin + colW + 10, y + 7);
      doc.setFontSize(8);
      doc.setTextColor(...lightGray);
      doc.setFont("helvetica", "normal");
      wrapText(doc, data.moodboard.typography, colW - 8).slice(0, 5).forEach((line, i) => {
        doc.text(line, margin + colW + 10, y + 13 + i * 4);
      });
    }
    y += 42;

    // References
    if (data.moodboard.references?.length) {
      doc.setFontSize(7);
      doc.setTextColor(...gold);
      doc.setFont("helvetica", "bold");
      doc.text("REFERÊNCIAS CINEMATOGRÁFICAS", margin, y);
      y += 5;
      doc.setFontSize(8);
      doc.setTextColor(...gray);
      doc.setFont("helvetica", "normal");
      data.moodboard.references.forEach((ref) => {
        doc.text(`• ${ref}`, margin + 2, y);
        y += 4.5;
      });
      y += 6;
    }

    // Image prompts (for the team to understand AI generation)
    doc.setFontSize(7);
    doc.setTextColor(...gold);
    doc.setFont("helvetica", "bold");
    doc.text("PROMPTS DE IMAGEM (NANO BANANA / IMAGEN)", margin, y);
    y += 5;
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    doc.setFont("helvetica", "normal");
    data.moodboard.imagePrompts?.forEach((prompt, i) => {
      if (y > pageHeight - 20) {
        doc.addPage();
        doc.setFillColor(...darkBg);
        doc.rect(0, 0, pageWidth, pageHeight, "F");
        y = margin;
      }
      const lines = wrapText(doc, `${i + 1}. ${prompt}`, contentWidth - 4);
      lines.forEach((line) => {
        doc.text(line, margin + 2, y);
        y += 3.5;
      });
      y += 2;
    });

    // Moodboard images
    const images = data.moodboardImages || {};
    const imgKeys = Object.keys(images).map(Number);
    if (imgKeys.length > 0) {
      doc.addPage();
      doc.setFillColor(...darkBg);
      doc.rect(0, 0, pageWidth, pageHeight, "F");
      y = margin;

      doc.setFontSize(7);
      doc.setTextColor(...gold);
      doc.setFont("helvetica", "bold");
      doc.text("IMAGENS GERADAS — MOODBOARD", margin, y);
      y += 6;

      const imgW = (contentWidth - 4) / 2;
      const imgH = imgW * 0.6;
      let col = 0;

      imgKeys.forEach((key) => {
        if (y + imgH > pageHeight - margin) {
          doc.addPage();
          doc.setFillColor(...darkBg);
          doc.rect(0, 0, pageWidth, pageHeight, "F");
          y = margin;
        }
        const x = margin + col * (imgW + 4);
        addImageSafe(doc, images[key], x, y, imgW, imgH);
        col++;
        if (col >= 2) {
          col = 0;
          y += imgH + 4;
        }
      });
      if (col > 0) y += imgH + 4;
    }
  }

  // --- STORYBOARD PAGE ---
  if (data.storyboard) {
    doc.addPage();
    doc.setFillColor(...darkBg);
    doc.rect(0, 0, pageWidth, pageHeight, "F");
    y = margin;

    doc.setFontSize(8);
    doc.setTextColor(...gold);
    doc.setFont("helvetica", "bold");
    doc.text("02 — STORYBOARD TÉCNICO", margin, y);
    y += 8;

    doc.setFontSize(12);
    doc.setTextColor(...white);
    doc.setFont("helvetica", "bold");
    doc.text(data.storyboard.title, margin, y);
    y += 7;

    doc.setFontSize(8);
    doc.setTextColor(...gray);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Duração total: ${data.storyboard.duration}  |  Trilha: ${data.storyboard.soundtrack}`,
      margin, y
    );
    y += 10;

    // Detailed scenes
    data.storyboard.scenes?.forEach((scene) => {
      if (y > pageHeight - 60) {
        doc.addPage();
        doc.setFillColor(...darkBg);
        doc.rect(0, 0, pageWidth, pageHeight, "F");
        y = margin;
      }

      // Scene card
      doc.setFillColor(25, 25, 28);
      const cardH = 45;
      doc.roundedRect(margin, y, contentWidth, cardH, 2, 2, "F");

      // Scene header
      doc.setFontSize(9);
      doc.setTextColor(...gold);
      doc.setFont("helvetica", "bold");
      doc.text(`CENA ${scene.number}`, margin + 4, y + 7);
      doc.setTextColor(...white);
      doc.text(scene.title, margin + 28, y + 7);

      // Duration badge
      doc.setFillColor(...gold);
      doc.roundedRect(margin + contentWidth - 22, y + 2, 18, 8, 1, 1, "F");
      doc.setFontSize(7);
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "bold");
      doc.text(`${scene.duration}s`, margin + contentWidth - 13, y + 7.5, { align: "center" });

      // Description
      doc.setFontSize(8);
      doc.setTextColor(...lightGray);
      doc.setFont("helvetica", "normal");
      const descLines = wrapText(doc, scene.description, contentWidth - 10);
      descLines.slice(0, 3).forEach((line, i) => {
        doc.text(line, margin + 4, y + 14 + i * 4);
      });

      // Technical details row
      const detailY = y + 30;
      doc.setFontSize(6.5);
      doc.setTextColor(...gold);
      doc.setFont("helvetica", "bold");
      doc.text("CÂMERA:", margin + 4, detailY);
      doc.setTextColor(...gray);
      doc.setFont("helvetica", "normal");
      doc.text(scene.camera, margin + 22, detailY);

      doc.setTextColor(...gold);
      doc.setFont("helvetica", "bold");
      doc.text("MOOD:", margin + 80, detailY);
      doc.setTextColor(...gray);
      doc.setFont("helvetica", "normal");
      doc.text(scene.mood, margin + 93, detailY);

      doc.setTextColor(...gold);
      doc.setFont("helvetica", "bold");
      doc.text("TRANSIÇÃO:", margin + 4, detailY + 5);
      doc.setTextColor(...gray);
      doc.setFont("helvetica", "normal");
      doc.text(scene.transition, margin + 28, detailY + 5);

      y += cardH + 4;
    });

    // Restrictions / Notes
    const fd = data.formData || {};
    if (fd.restrictions || fd.notes || fd.meetingKeyPoints) {
      if (y > pageHeight - 60) {
        doc.addPage();
        doc.setFillColor(...darkBg);
        doc.rect(0, 0, pageWidth, pageHeight, "F");
        y = margin;
      }

      y += 6;
      doc.setFontSize(7);
      doc.setTextColor(...gold);
      doc.setFont("helvetica", "bold");
      doc.text("NOTAS E RESTRIÇÕES", margin, y);
      y += 6;

      doc.setFontSize(8);
      doc.setTextColor(...lightGray);
      doc.setFont("helvetica", "normal");

      if (fd.restrictions) {
        doc.setTextColor(...gold);
        doc.setFont("helvetica", "bold");
        doc.text("Restrições: ", margin, y);
        doc.setTextColor(...lightGray);
        doc.setFont("helvetica", "normal");
        wrapText(doc, fd.restrictions, contentWidth - 4).forEach((line) => {
          doc.text(line, margin + 22, y);
          y += 4;
        });
        y += 2;
      }

      if (fd.notes) {
        doc.setTextColor(...gold);
        doc.setFont("helvetica", "bold");
        doc.text("Notas: ", margin, y);
        doc.setTextColor(...lightGray);
        doc.setFont("helvetica", "normal");
        wrapText(doc, fd.notes, contentWidth - 4).forEach((line) => {
          doc.text(line, margin + 15, y);
          y += 4;
        });
        y += 2;
      }

      if (fd.meetingKeyPoints) {
        doc.setTextColor(...gold);
        doc.setFont("helvetica", "bold");
        doc.text("Pontos da reunião:", margin, y);
        y += 5;
        doc.setTextColor(...lightGray);
        doc.setFont("helvetica", "normal");
        wrapText(doc, fd.meetingKeyPoints, contentWidth - 4).forEach((line) => {
          if (y > pageHeight - 15) {
            doc.addPage();
            doc.setFillColor(...darkBg);
            doc.rect(0, 0, pageWidth, pageHeight, "F");
            y = margin;
          }
          doc.text(line, margin + 2, y);
          y += 4;
        });
      }
    }
  }

  // --- HIGGSFIELD PAGE ---
  if (data.higgsfield) {
    doc.addPage();
    doc.setFillColor(...darkBg);
    doc.rect(0, 0, pageWidth, pageHeight, "F");
    y = margin;

    doc.setFontSize(8);
    doc.setTextColor(...gold);
    doc.setFont("helvetica", "bold");
    doc.text("03 — BRIEFING HIGGSFIELD", margin, y);
    y += 10;

    doc.setFontSize(8);
    doc.setTextColor(...lightGray);
    doc.setFont("helvetica", "normal");
    wrapText(doc, data.higgsfield.briefing, contentWidth).forEach((line) => {
      if (y > pageHeight - 15) {
        doc.addPage();
        doc.setFillColor(...darkBg);
        doc.rect(0, 0, pageWidth, pageHeight, "F");
        y = margin;
      }
      doc.text(line, margin, y);
      y += 4;
    });
  }

  // Page numbers
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(60, 60, 60);
    doc.text(`${i} / ${totalPages}`, pageWidth - margin, pageHeight - 8, { align: "right" });
    doc.text("CONFIDENCIAL — EQUIPE INTERNA", margin, pageHeight - 8);
  }

  // Save
  const fileName = data.formData?.eventName
    ? `${data.formData.eventName.replace(/\s+/g, "_")}_equipe.pdf`
    : "moodboard_equipe.pdf";
  doc.save(fileName);
}
