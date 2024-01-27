import { JSX } from "solid-js/jsx-runtime";
import { useWalletContext } from "../contexts/wallet.context";
import { useNavigate } from "@solidjs/router";
import { createEffect } from "solid-js";

interface PrivateContainerProps {
  Aside: () => JSX.Element;
  Content: () => JSX.Element;
}

export const PrivateContainer = ({ Aside, Content }: PrivateContainerProps) => {
  const navigate = useNavigate();
  const { state } = useWalletContext();

  createEffect(() => {
    if (!state.wallet) {
      navigate("/");
    }
  });

  return (
    <div class="flex">
      <Aside />
      <Content />
    </div>
  );
};
