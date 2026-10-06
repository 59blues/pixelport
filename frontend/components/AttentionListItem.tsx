import {Attention} from "./NeedsAttention";

type Props = {
    attentionItem: Attention;
}

export default function AttentionListItem({attentionItem}: Props) {
    return (
        <div className="flex">
            <div className = "flex flex-col">
                <div className="text-sm font-semibold">{attentionItem.title}</div>
                <div className="text-sm">{attentionItem.description}</div>
            </div>
            <div>
                <div className="text-sm">{attentionItem.status}</div>
            </div>
        </div>
    )
}

