import Card from "./Card";
import AttentionListItem from "./AttentionListItem";

export type Attention = {
  title: string;
  description: string;
  status: "Action needed" | "Ready" | "Expiring";
};

type Props = {
  attentionItems: Attention[];
};

export default function AttentionCard({ attentionItems }: Props) {
  return (
    <Card>
      <div>
        <div> Needs your attention</div>
        <a href="#"> View all</a>
      </div>

      <div>
        {attentionItems.map((attentionItem, index) => (
          <AttentionListItem key={index} attentionItem={attentionItem} />
        ))}
      </div>
    </Card>
  );
}
