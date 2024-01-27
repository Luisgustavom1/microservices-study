import { Toaster } from "solid-toast";
import { WalletProvider } from "./contexts/wallet.context";
import { Routes } from "./routes";

export const App = () => {
  return (
    <WalletProvider>
      <Toaster
        position="top-right"
        gutter={24}
        toastOptions={{
          style: {
            width: "240px",
          },
        }}
      />
      <Routes />
    </WalletProvider>
  );
};
