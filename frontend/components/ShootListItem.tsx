import {Shoot} from "./UpcomingShoots";

type Props = {
    shoot: Shoot;
}

export default function ShootListItem({shoot}: Props) {
    return (
        <div>
            <div> {shoot.date.day} {shoot.date.month}</div>
            <div>
                 <div className="text-lg font-bold">{shoot.title}</div>
                 <div>
                    <div className="text-sm">{shoot.venue}</div>
                    <div className="text-sm">{shoot.time}</div>
                 </div>
            </div>
        </div>
    )
}