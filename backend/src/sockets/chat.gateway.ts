// ==============================================
// path: src/sockets/chat.gateway.ts
// ==============================================
/**
 * Por quê: confirmação de leitura em tempo real para a outra parte.
 */
import { Server } from "socket.io";
import type http from "http";
import { verifyJwt } from "../utils/jwt";
import { assertCanChat, sendMessage, markMessageAsRead } from "../services/chat.service";

export function initChatGateway(server: http.Server) {
  const io = new Server(server, { cors: { origin: true } });

  io.use((socket, next) => {
    try {
      const hdr = (socket.handshake.auth?.token as string) ||
                  (socket.handshake.headers?.authorization as string) || "";
      const token = hdr.startsWith("Bearer ") ? hdr.slice(7) : hdr;
      if (!token) return next(new Error("unauthorized"));
      const payload = verifyJwt<{ sub?: string; id?: string; userId?: string }>(token);
      const sub = payload.sub || payload.id || payload.userId;
      if (!sub) return next(new Error("unauthorized"));
      (socket.data as any).userId = sub;
      next();
    } catch {
      next(new Error("unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    const userId = (socket.data as any).userId as string;

    socket.on("join", async (protocolId: string, ack?: (ok: boolean, err?: string) => void) => {
      try {
        await assertCanChat(userId, protocolId);
        socket.join(`protocol:${protocolId}`);
        ack?.(true);
      } catch (e: any) {
        ack?.(false, e?.message || "join_failed");
      }
    });

    socket.on("message:send", async (payload: { protocolId: string; body: string }, ack?: (ok: boolean, err?: string) => void) => {
      try {
        const msg = await sendMessage(userId, payload.protocolId, payload.body);
        io.to(`protocol:${payload.protocolId}`).emit("message:new", msg);
        ack?.(true);
      } catch (e: any) {
        ack?.(false, e?.message || "send_failed");
      }
    });

    socket.on("message:markRead", async (payload: { messageId: string }, ack?: (ok: boolean, err?: string) => void) => {
      try {
        const out = await markMessageAsRead(userId, payload.messageId);
        io.to(`protocol:${out.protocolId}`).emit("message:read", {
          messageId: out.id,
          readAt: out.readAt,
          readerId: userId,
        });
        ack?.(true);
      } catch (e: any) {
        ack?.(false, e?.message || "read_failed");
      }
    });
  });

  return io;
}