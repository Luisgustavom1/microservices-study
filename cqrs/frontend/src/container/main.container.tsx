import { JSX } from "solid-js/jsx-runtime";

interface MainContainerProps {
  Aside: () => JSX.Element;
  Content: () => JSX.Element;
}

export const MainContainer = ({ Aside, Content }: MainContainerProps) => {
  return (
    <div class="flex">
      <Aside />
      <Content />
    </div>
  )
}