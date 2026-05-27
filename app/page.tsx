import { Suspense } from "react";
import { HomeFeed } from "@/components/home-feed";

export default function HomePage() {
  return (
    <main className="page-container py-8 md:py-10">
      <Suspense fallback={null}>
        <HomeFeed />
      </Suspense>
    </main>
  );
}
