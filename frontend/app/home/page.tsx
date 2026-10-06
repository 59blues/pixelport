import WelcomeBanner from "@/components/WelcomeBanner";
import StatCard from "@/components/StatCard";
import UpcomingShoots, { Shoot } from "@/components/UpcomingShoots";
import QuickActions, { Action } from "@/components/QuickActions";
import { Upload, User, Download, Image } from "lucide-react";

const dummyShoots: Shoot[] = [
  {
    title: "Aiko & Hames — Wedding",
    date: { day: "24", month: "Jul" },
    venue: "Riverside Park",
    time: "6:00 PM",
    daysAway: "2 days away",
    avatarUrl: "/avatars/client1.jpg",
  },
  {
    title: "Lerato — Potrait session ",
    date: { day: "27", month: "Jul" },
    venue: "Studio B",
    time: "10:00 AM",
    daysAway: "5 days away",
    avatarUrl: "/avatars/client2.jpg",
  },
];

const dummyActions: Action[] = [
  {
    icon: Upload,
    title: "Upload Photos",
    description: "Raw or JPEG",
  },
  {
    icon: User,
    title: "Add Client",
    description: "Name + email",
  },
  {
    icon: Download,
    title: "Send Delivery",
    description: "Secure link",
  },
  {
    icon: Image,
    title: "New Portfolio",
    description: "From a project",
  },
];

export default function HomePage() {
  return (
    <div className="p-10">
      <WelcomeBanner
        user="Darren"
        projectCount={8}
        photoCount={12}
        galleryCount={3}
      />

      <div className="flex gap-4 mt-6">
        <StatCard
          title="Active Projects"
          value="8"
          delta="+2 this month"
          isPositive={true}
        />

        <StatCard
          title="Profile Views (30D)"
          value="14.6K"
          delta="23% vs last period"
          isPositive={true}
        />

        <StatCard
          title="Open Inquiries"
          value="6"
          delta="3 new this week"
          isPositive={true}
        />

        <StatCard
          title="Revenue (MTD)"
          value="$8400"
          delta="18% vs May"
          isPositive={true}
        />
      </div>

      <div className="grid grid-cols-[2fr_1fr] gap-1 mt-6">
        <div className="flex flex-col gap-4">
          <UpcomingShoots shoots={dummyShoots} />
          {/* NeedsAttention goes here later */}
        </div>
        <div className="flex flex-col gap-4">
          <QuickActions actions={dummyActions} />
          {/* RecentActivity goes here later */}
        </div>
      </div>

    </div>
  );
}
