import { Header } from "./components/Header";
import { SummaryTable } from "./components/SummaryTable";

import { api } from "./lib/axios";

import "./lib/dayjs";
import "./styles/global.css";

navigator.serviceWorker
  .register("service-worker.js")
  .then(async (serviceWorker) => {
    // a subscription é a assinatura do usuário com o serviço de notificação, ou seja,
    // quando o usuário falar que quer receber notificação vai ser criado uma subscription
    let subscription = await serviceWorker.pushManager.getSubscription();

    // se ele não tiver uma subscription ativa
    if (!subscription) {
      const publicKeyResponse = await api.get("/push/public_key");

      // vou criar uma nova subscription
      subscription = await serviceWorker.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: publicKeyResponse.data.publicKey,
      });
    }

    await api.post("/push/register", {
      subscription,
    });

    await api.post("/push/send", {
      subscription,
    });
  });

export function App() {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="w-full max-w-5xl px-6 flex flex-col gap-16">
        <Header />
        <SummaryTable />
      </div>
    </div>
  );
}
