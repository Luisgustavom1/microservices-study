import { JSX } from "solid-js/jsx-runtime"

interface ItemProps {
  Icon: JSX.Element;
  text: string;
  href: string;
}

export const Item = (props: ItemProps) => {
  return (
    <li>
      <a class='flex items-center gap-3 p-2 rounded-md hover:transition-all hover:bg-slate-200 hover:bg-opacity-40 text-gray-600' href={props.href}>
        {props.Icon}
        <p class="text-sm font-semibold">{props.text}</p>
      </a>
    </li>
  )
}