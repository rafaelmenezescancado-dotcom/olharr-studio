# Olharr Studio — Contexto do Projeto

## O que é
Web app que cria moodboards e storyboards cinematográficos para eventos usando IA. Um agente orquestra 4 personas (Diretor de Fotografia, Roteirista, Especialista em Apresentações, Dev Front-End) para gerar material visual completo a partir de um briefing.

## Stack
- **Framework:** Next.js 15 (App Router) + TypeScript
- **Deploy:** Vercel (olharr-studio.vercel.app)
- **Styling:** Tailwind CSS (tema dourado/escuro)
- **IA Texto:** Claude Haiku 3.5 (Anthropic API) — orquestra personas, gera JSON estruturado
- **IA Imagem:** Imagen 4.0 Fast (Google) → fallback Gemini 2.5 Flash Image
- **PDF Export:** jsPDF (client-side)
- **Repo:** github.com/rafaelmenezescancado-dotcom/olharr-studio

## Estrutura de Arquivos

```
app/
├── page.tsx                    # Página principal (landing, form, loading, result)
├── layout.tsx                  # Layout root
├── globals.css                 # Estilos globais + animações
├── lib/
│   ├── personas.ts             # System prompts das 4 personas + ORCHESTRATOR_PROMPT
│   └── generatePDF.ts          # Geração de PDF (versão cliente + equipe)
├── components/
│   ├── Stepper.tsx             # Navegação 4 steps (Evento, Estética, Narrativa, Extras)
│   ├── FormStep1.tsx           # Tipo de evento, nome, data, local, público, convidados
│   ├── FormStep2.tsx           # Mood, paleta de cores, link Pic-Time (análise por IA)
│   ├── FormStep3.tsx           # Duração (slider 30s-10min), momentos-chave, vídeos, trilha
│   ├── FormStep4.tsx           # Upload resumo reunião (IA extrai pontos), notas, equipamento
│   ├── MoodboardView.tsx       # Exibe moodboard + botões gerar imagem
│   ├── StoryboardView.tsx      # Exibe storyboard timeline + botões gerar imagem
│   └── HiggsfieldExport.tsx    # Briefing formatado para Higgsfield
├── api/
│   ├── generate/route.ts       # POST — Claude gera moodboard+storyboard JSON
│   ├── images/route.ts         # POST — Imagen 4.0 / Gemini gera imagens
│   ├── analyze-album/route.ts  # POST — Claude analisa álbum Pic-Time
│   └── extract-meeting/route.ts # POST — Claude extrai pontos de resumo de reunião
```

## Fluxo do App
1. **Landing** → botão "Criar Moodboard & Storyboard"
2. **Formulário** (4 steps) → preenche briefing do evento
3. **Loading** → Claude Haiku processa briefing com 4 personas
4. **Resultado** → abas Moodboard / Storyboard / Higgsfield
5. **Imagens** → botão "Gerar Imagem" chama Imagen 4.0
6. **Export PDF** → dropdown com versão Cliente (visual) e Equipe (técnica)

## APIs e Modelos

| Endpoint | Modelo | Propósito |
|----------|--------|-----------|
| /api/generate | claude-haiku-4-5-20251001 | Orquestração das 4 personas, gera JSON |
| /api/images | imagen-4.0-fast-generate-001 → gemini-2.5-flash-image | Geração de imagens |
| /api/analyze-album | claude-haiku-4-5-20251001 | Análise visual de álbum Pic-Time |
| /api/extract-meeting | claude-haiku-4-5-20251001 | Extração de pontos-chave de reunião |

## Variáveis de Ambiente
```
GEMINI_API_KEY=...          # Google AI Studio (Imagen + Gemini)
ANTHROPIC_API_KEY=...       # Anthropic (Claude Haiku)
```

## Personas (app/lib/personas.ts)
- **Diretor de Fotografia** — estética visual, iluminação, enquadramentos, referências
- **Roteirista** — arco narrativo, cenas, câmera, transições, timing
- **Especialista em Apresentações** — hierarquia visual, layout, clareza
- **Dev Front-End** — grid de imagens, componentes, UX, exportação

## JSON Output (gerado pelo Claude)
```json
{
  "moodboard": {
    "title", "subtitle", "colorPalette", "mood", "style",
    "imagePrompts" (inglês), "references", "lighting", "typography"
  },
  "storyboard": {
    "title", "duration", "soundtrack",
    "scenes": [{ "number", "title", "description", "camera",
                  "duration", "mood", "imagePrompt", "transition" }]
  },
  "higgsfield": { "briefing", "style", "scenes" }
}
```

## Tema Visual
- Background: #0a0a0b / #0f0f11
- Gold: #c8a44e (primary accent)
- Cards: bg-white/[0.03] com border-white/10
- Fonte: System (Helvetica/sans-serif)

## Comandos Úteis
```bash
npm run dev          # Dev local (localhost:3000)
npm run build        # Build de produção
git push             # Deploy automático no Vercel
```

## Problemas Conhecidos / Resolvidos
- Next.js 15.1.0 bloqueado por vulnerabilidade → atualizado para ^15.3.0
- gemini-2.0-flash e imagen-3.0 descontinuados → migrado para imagen-4.0-fast e gemini-2.5-flash-image
- Editor web do GitHub corrompe template literals TypeScript → sempre editar local
- Pic-Time pode bloquear fetch em alguns álbuns privados → análise usa metadados disponíveis
