import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";

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
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const name = session?.user?.name ?? '';

  return (
    <div className="flex flex-col">
      <div className="flex flex-row space-x-2 justify-end">
        {name && <div>name: {name}</div>}
        <NavItem href="/">home</NavItem>
        <NavItem href="/about">about</NavItem>
        <NavItem href="/new_request">make a request</NavItem>
        <NavItem href="/requests">requests</NavItem>
        <NavItem href="/showcase">showcase</NavItem>
        <NavItem href="/resource">resource center</NavItem>
        {name ? (
          <button onClick={() => signOut()}>Sign out</button>
        ) : (
          <div onClick={() => setIsOpen((p) => !p)}>login</div>
        )}
      </div>

      {isOpen && (
        <div className="relative flex flex-col items-end">
          <button onClick={() => signIn("github")}>Login with GitHub</button>
          <button onClick={() => signIn("google")}>Login with Google</button>
        </div>
      )}
    </div>
  );
}

export default MyNav;
