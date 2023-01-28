import WebPush from "web-push";
import { FastifyInstance } from "fastify";
import { z } from "zod";

// esse método vai gerar duas chaves, uma chave privada e uma chave publica
// WebPush.generateVAPIDKeys();

const publicKey =
  "BPhmnth5YmzR8A2XUXQzHrM5r4Im2XcbBJyZheSfNY-13I-Omj1LqcWo28eGk6B4MTwLNiQMXw5cAdnNmv5dHpM";
const privateKey = "sVsFObqYLnfsCqqtsXtSlUIdAXthEUiXXft0p3jg7XI";

WebPush.setVapidDetails("http://localhost:3333", publicKey, privateKey);

export async function notificationRoutes(app: FastifyInstance) {
  app.get("/push/public_key", () => {
    return {
      publicKey,
    };
  });

  app.post("/push/register", (request, reply) => {
    console.log(request.body);

    // essa rota conecta as pontas, vai conectar os usuário logado com pra quem eu
    // quero enviar a notificação

    return reply.status(201).send();
  });

  app.post("/push/send", async (request, reply) => {
    const sendPushBody = z.object({
      subscription: z.object({
        endpoint: z.string(),
        keys: z.object({
          p256dh: z.string(),
          auth: z.string(),
        }),
      }),
    });

    const { subscription } = sendPushBody.parse(request.body);

    WebPush.sendNotification(subscription, "HELLO DO BACKEND");
    console.log(request.body);

    return reply.status(201).send();
  });
}
