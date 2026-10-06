import NavLink from "./NavLink";

export default function Navbar() {
  return (
    <div className="bg-body p-1">
      <div className="flex gap-4">
        <NavLink href="/home">Home</NavLink>
        <NavLink href="/portfolios">Portfolios</NavLink>
        <NavLink href="/clients">Clients</NavLink>
        <NavLink href="/deliveries">Deliveries</NavLink>
        <NavLink href="/calendar">Calendar</NavLink>
      </div>
    </div>
  );
}
