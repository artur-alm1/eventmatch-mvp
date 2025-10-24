// src/index.ts
import "./config/env";
import express from "express";
import cors from "cors";
import helmet from "helmet";

import healthRoutes from "./routes/health.routes";
import { errorMiddleware } from "./middlewares/error.middleware";
import portfolioRoutes from "./routes/portfolio.routes";

// Ajuste os caminhos conforme seu projeto:
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import eventRoutes from "./routes/event.routes";
import protocolRoutes from "./routes/protocol.routes";

const app = express();

app.use(helmet());
app.use(cors({ origin: true }));
app.use(express.json());

// Rotas
app.use(healthRoutes);
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/events", eventRoutes);
app.use("/protocols", protocolRoutes);
app.use("/portfolio", portfolioRoutes); 

// 404 unificado
app.use((_req, res) => res.status(404).json({ error: "NotFound" }));

// Error handler global
app.use(errorMiddleware);

// Inicialização
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🔥 Servidor rodando em http://localhost:${PORT}`);
});
