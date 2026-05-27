import { notFound } from "next/navigation";
import { profiles } from "@/lib/mock-data";
import { ProfileContent } from "@/components/profile-content";

type ProfilePageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { id } = await params;
  const profile = profiles.find((item) => item.id === id);

  if (!profile) {
    notFound();
  }

  return (
    <main className="page-container py-8 md:py-10">
      <ProfileContent profileId={profile.id} />
    </main>
  );
}
