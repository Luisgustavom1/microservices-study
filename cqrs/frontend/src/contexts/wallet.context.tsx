import { createContext, useContext } from "solid-js";
import type { Context, JSX } from "solid-js";
import { createStore } from "solid-js/store";

type WalletData = { wallet?: string };
type WalletMethods = { setWallet: (w: string) => void; signOut: () => void };
type WalletContextData = { state: WalletData } & WalletMethods;

const WalletContext = createContext<WalletContextData>(undefined, {
  name: "WalletContext",
});

interface WalletProviderProps {
  children: JSX.Element;
}

export function WalletProvider(props: WalletProviderProps) {
  const [state, setState] = createStore<WalletData>();

  return (
    <WalletContext.Provider
      value={{
        state,
        setWallet: (w: string) => setState({ wallet: w }),
        signOut: () => setState({}),
      }}
    >
      {props.children}
    </WalletContext.Provider>
  );
}

export const useWalletContext = (): WalletContextData => {
  const context = useContext(WalletContext);

  if (!context) {
    throw new Error("useWalletContext must be used within a WalletProvider");
  }

  return context;
};
