import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';
import {GoogleGenAI} from '@google/genai';

function geminiApiPlugin(): Plugin {
  return {
    name: 'gemini-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) {
          return next();
        }

        const parseBody = () => new Promise<any>((resolve) => {
          let body = '';
          req.on('data', chunk => body += chunk);
          req.on('end', () => {
            try {
              resolve(body ? JSON.parse(body) : {});
            } catch {
              resolve({});
            }
          });
        });

        const sendJson = (statusCode: number, data: any) => {
          res.statusCode = statusCode;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(data));
        };

        try {
          const apiKey = process.env.GEMINI_API_KEY;

          // Route: /api/enhance-prompt
          if (req.url === '/api/enhance-prompt' && req.method === 'POST') {
            const body = await parseBody();
            const userPrompt = body.prompt || '';
            const type = body.type || 'image';

            if (!apiKey) {
              return sendJson(200, {
                enhancedPrompt: `${userPrompt}, cinematic lighting, warm linen aesthetic, 35mm lens, refined textures, natural soft shadows, editorial composition, 8k resolution`,
                source: 'preset'
              });
            }

            const ai = new GoogleGenAI({
              apiKey,
              httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
            });

            const instruction = type === 'video'
              ? `You are an elite Hollywood cinematographer. Expand this prompt into an evocative, 35-word cinematic video prompt detailing camera motion, lighting atmosphere, and lens aesthetic. Output ONLY the refined prompt text: "${userPrompt}"`
              : `You are an award-winning art director. Expand this prompt into a rich, 35-word visual prompt with exquisite textures, lighting, color palette, camera angle, and editorial feel. Output ONLY the refined prompt text: "${userPrompt}"`;

            const response = await ai.models.generateContent({
              model: 'gemini-3.8-flash',
              contents: instruction,
            });

            return sendJson(200, {
              enhancedPrompt: response.text?.trim() || userPrompt,
              source: 'gemini-3.8-flash'
            });
          }

          // Route: /api/generate-image
          if (req.url === '/api/generate-image' && req.method === 'POST') {
            const body = await parseBody();
            const prompt = body.prompt || 'Serene architectural retreat in warm daylight';
            const rawAspect = body.aspectRatio || '1:1';
            const validAspects = ['1:1', '3:4', '4:3', '9:16', '16:9'];
            const aspectRatio = validAspects.includes(rawAspect) ? rawAspect : '1:1';

            if (!apiKey) {
              return sendJson(200, {
                fallback: true,
                message: 'No GEMINI_API_KEY configured. Utilizing procedural studio rendering.',
              });
            }

            try {
              const ai = new GoogleGenAI({
                apiKey,
                httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
              });

              const response = await ai.models.generateContent({
                model: 'gemini-3.1-flash-lite-image',
                contents: {
                  parts: [{ text: `${prompt}, high fidelity, professional color grading, realistic textures, balanced lighting` }]
                },
                config: {
                  imageConfig: {
                    aspectRatio: aspectRatio as any,
                  }
                }
              });

              let imageUrl: string | null = null;
              if (response.candidates?.[0]?.content?.parts) {
                for (const part of response.candidates[0].content.parts) {
                  if (part.inlineData?.data) {
                    const mime = part.inlineData.mimeType || 'image/png';
                    imageUrl = `data:${mime};base64,${part.inlineData.data}`;
                    break;
                  }
                }
              }

              if (imageUrl) {
                return sendJson(200, {
                  success: true,
                  imageUrl,
                  prompt,
                  model: 'gemini-3.1-flash-lite-image'
                });
              } else {
                return sendJson(200, {
                  fallback: true,
                  message: 'Image model returned non-image content. Using procedural studio canvas.',
                });
              }
            } catch (err: any) {
              console.error('Gemini image generation error:', err);
              return sendJson(200, {
                fallback: true,
                error: err.message,
                message: 'Fallback to generative studio canvas generator.'
              });
            }
          }

          return sendJson(404, { error: 'Endpoint not found' });
        } catch (error: any) {
          console.error('API Middleware error:', error);
          return sendJson(500, { error: error.message || 'Internal server error' });
        }
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), geminiApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
