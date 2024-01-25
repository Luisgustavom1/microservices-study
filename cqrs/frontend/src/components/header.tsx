interface HeaderProps {
  title: string;
}

export const Header = (props: HeaderProps) => {
  return (
    <header class="mb-4 flex w-full items-center gap-2 border-b border-b-gray-200 bg-gray-light p-6">
      <h1 class="font-bold">{props.title}</h1>
    </header>
  );
};
