// src/types/mammoth.d.ts  (tipos mínimos)
declare module "mammoth" {
  export function extractRawText(input: { buffer: Buffer } | { path: string }): Promise<{ value: string }>;
}