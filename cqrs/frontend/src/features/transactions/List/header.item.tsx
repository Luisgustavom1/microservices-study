import { children } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";

interface HeaderItemProps {
  children: JSX.Element;
}

export const HeaderItem = (props: HeaderItemProps) => {
  const child = children(() => props.children);
  return <p class="w-1/4 text-base font-semibold text-gray-600">{child()}</p>;
};
