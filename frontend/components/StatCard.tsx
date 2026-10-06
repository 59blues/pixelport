import Card from "./Card";

type Props = {
  title: string;
  value: string;
  delta: string;
  isPositive: boolean;
};

export default function StatCard({ title, value, delta, isPositive }: Props) {
  return (
    <Card className="flex flex-col w-fit">
      <div className="text-sm">{title}</div>
      <div className="text-2xl font-semibold">{value}</div>
      <div className={`text-sm ${isPositive ? "text-green-500" : "text-red-500"}`}>
        {delta}
      </div>
    </Card>
  );
}
