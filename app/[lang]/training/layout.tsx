import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isDe = lang === "de";
  
  return generateSEOMetadata({
    title: isDe ? "Training - FC City Boys Zurich" : "Training - FC City Boys Zurich",
    description: isDe
      ? "Unsere Trainingspläne und Programme für FC City Boys Zurich. Indoor- und Outdoor-Training, Trainer, Einrichtungen und Trainingszeiten."
      : "Our training plans and programs for FC City Boys Zurich. Indoor and outdoor training, coaches, facilities, and training schedules.",
    path: "/training",
    lang,
    image: "/images/training/train1.jpg",
    keywords: isDe
      ? ["Fussballtraining", "Trainingsplan", "Fussballakademie", "Trainingseinrichtungen"]
      : ["football training", "training schedule", "football academy", "training facilities"],
  });
}

export default function TrainingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
