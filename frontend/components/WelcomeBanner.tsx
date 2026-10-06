import Card from "./Card";

type Props = {
  user: string;
  projectCount?: number;
  photoCount?: number;
  galleryCount?: number;
};

export default function WelcomeBanner({
  user,
  projectCount,
  photoCount,
  galleryCount,
}: Props) {
  return (
    <Card>
      <h1 className="font-bold">Hello {user}</h1>
      <p className="text-grey font-medium">
        You have {projectCount} active projects, {photoCount} photos to review
        and {galleryCount} galleries expiring soon.
      </p>
    </Card>
  );
}
