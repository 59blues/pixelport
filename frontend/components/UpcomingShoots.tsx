import Card from "./Card";
import ShootListItem from "./ShootListItem";

// we need 2 types - shoot gets reused, props dont
// shoot describes the data - what a single shoot object looks like, props describe what this specific component accepts as input
export type Shoot = {
    title: string;
    date: {day: string, month: string}; //object
    venue: string;
    time: string;
    daysAway?: string;
    avatarUrl: string;
}

type Props = {
    shoots: Shoot[];
}

export default function UpcomingShoots({shoots}: Props) {
    return (
        <Card className="flex flex-col w-fit">
            <div>
                <div className="text-sm font-semibold">Upcoming Shoots</div>
                <a href="#" className="text-sm text-blue-500 hover:underline">Open Calendar</a>
            </div>

            <div>
                {shoots.map((shoot, index) => (
                    <ShootListItem key={index} shoot={shoot} />
                ))}
            </div>
        </Card>
    );
}