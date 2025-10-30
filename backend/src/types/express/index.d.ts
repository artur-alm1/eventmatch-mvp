// ==============================================
// path: src/types/express/index.d.ts
// ==============================================
// Augmentation ÚNICA do Express: userId é OBRIGATÓRIO nos handlers
import type { Role } from "@prisma/client";

declare module "express-serve-static-core" {
  interface Request {
    /** Injetado por authMiddleware em rotas autenticadas */
    userId: string;
    /** Opcional: só preencha se em algum ponto você popular req.user */
    user?: { id: string; role?: Role | "PRODUTOR" | "PRESTADOR" };
  }
}
