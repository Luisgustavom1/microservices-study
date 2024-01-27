import { JSX } from "solid-js/jsx-runtime";

interface ItemProps {
  Icon: JSX.Element;
  text: string;
  href: string;
  cb?: () => void;
}

export const Item = (props: ItemProps) => {
  return (
    <li>
      <a
        class="flex items-center gap-3 rounded-md px-2 py-4 text-gray-600 hover:bg-slate-200 hover:bg-opacity-40 hover:transition-all"
        href={props.href}
        onClick={props.cb}
      >
        {props.Icon}
        <p class="text-sm font-semibold">{props.text}</p>
      </a>
    </li>
  );
};
