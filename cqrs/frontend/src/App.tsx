import { WalletProvider } from "./contexts/wallet.context";
import { Routes } from "./routes";

export const App = () => {
  return (
    <WalletProvider>
      <Routes />
    </WalletProvider>
  );
};
