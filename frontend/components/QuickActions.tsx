import Card from "./Card";
import ActionItem from "./ActionItem";
import { LucideIcon } from "lucide-react"; //curly braces because of named export

export type Action = {
  icon: LucideIcon;
  title: string;
  description: string;
};

type Props = {
  actions: Action[];
};

export default function QuickActions({ actions }: Props) {  //destructuring props to get actions directly
    return(
         <Card className="flex flex-col w-fit">
            <div>
                <div>Quick Actions</div>
            </div>
            <div>
                {actions.map((action, index) => (
                    <ActionItem key={index} action={action} />
                ))}
            </div>
        </Card>
    );
 
}
