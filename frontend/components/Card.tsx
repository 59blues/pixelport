import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function Card({ children, className }: Props) {
  return (
    <div className={`bg-surface rounded-md p-4 shadow-sm ${className}`}>
      {children}
    </div>
  );
}
