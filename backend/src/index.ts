// ==============================================
// path: src/index.ts  (apenas integração)
// ==============================================
import "./config/env";
import express from "express";
import cors from "cors";
import helmet from "helmet";

import healthRoutes from "./routes/health.routes";
import { errorMiddleware } from "./middlewares/error.middleware";

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import eventRoutes from "./routes/event.routes";
import protocolRoutes from "./routes/protocol.routes";
import portfolioRoutes from "./routes/portfolio.routes";

import chatRoutes from "./routes/chat.routes";
import { initChatGateway } from "./sockets/chat.gateway";

const app = express();
app.use(helmet());
app.use(cors({ origin: true }));
app.use(express.json());

app.use(healthRoutes);
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/events", eventRoutes);
app.use("/protocols", protocolRoutes);
app.use("/portfolio", portfolioRoutes);
app.use("/chat", chatRoutes);

app.use((_req, res) => res.status(404).json({ error: "NotFound" }));
app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`🔥 Servidor rodando em http://localhost:${PORT}`);
});

initChatGateway(server);
