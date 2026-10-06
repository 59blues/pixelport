import Link from "next/link";
import { ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
};

export default function NavLink({ href, children }: Props) {
  return (
    <Link href={href}
      className="text-grey text-sm font-semibold 
      hover:bg-nav-surface 
      hover:text-nav-fg p-1 rounded-md">
      {children}
    </Link>
  );
}
