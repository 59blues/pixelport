import Card from "./Card";
import {LucideIcon} from "lucide-react";

export type Activity = {
    icon: LucideIcon;
    title: string;
    timestamp: string;
}

type Props = {
    activities: Activity[];
}