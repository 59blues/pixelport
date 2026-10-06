import {Action} from "./QuickActions" 

type Props = {
    action: Action;
}

export default function ActionItems({action}: Props) {
    return (
        <div className ="flex gap-4 items-center">
            <action.icon />
            <div>
                <div className="text-lg font-bold">{action.title}</div>
                <div className="text-sm">{action.description}</div>
            </div>
        </div>
    )
}