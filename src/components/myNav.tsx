import Link from "next/link";

type NavItemProps = {
  href: string;
  children: React.ReactNode;
};

function NavItem({ href, children }: NavItemProps) {
  return (
    <Link className="bg-green-300 text-black p-2" href={href}>
      {children}
    </Link>
  );
}

function MyNav() {
  return (
    <div className="flex flex-row space-x-2 justify-end">
      <NavItem href="/">home</NavItem>

      <NavItem href="/about">about</NavItem>

      <NavItem href="/new_request">make a request</NavItem>

      <NavItem href="/requests">requests</NavItem>

      <NavItem href="/showcase">showcase</NavItem>

      <NavItem href="/resource">resource center</NavItem>

      <NavItem href="/login">login</NavItem>
    </div>
  );
}

export default MyNav;
