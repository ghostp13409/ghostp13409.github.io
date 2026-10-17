import { useState } from "react";
import type { FC } from "react";
import { CirclePlay } from "lucide-react";
import CardFace from "./ui/CardFace";
import ModalShell from "./ui/ModalShell";
import { ChipList, MetaHeading, SectionHeading } from "./ui/ModalParts";

interface VideoCardProps {
  title: string;
  description: string;
  tags: string[];
  videoUrl: string;
  thumbnailUrl: string;
  year?: number;
}

/** Project whose primary artifact is a recorded walkthrough. */
const VideoCard: FC<VideoCardProps> = ({ title, description, tags, videoUrl, thumbnailUrl, year }) => {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <>
      <CardFace
        title={title}
        description={description}
        tags={tags}
        imageUrl={thumbnailUrl}
        badge={year}
        accent="secondary"
        onOpen={() => setShowPreview(true)}
        centerOverlay={
          <div
            className="p-4 bg-neutral-bg/60 backdrop-blur-md rounded-full border border-secondary/50
              group-hover:bg-secondary/20 group-hover:border-secondary group-hover:scale-110 transition-all duration-500 shadow-2xl"
          >
            <CirclePlay className="h-10 w-10 text-secondary drop-shadow-[0_0_15px_rgba(79,70,229,0.5)]" aria-hidden="true" />
          </div>
        }
      />

      <ModalShell open={showPreview} onClose={() => setShowPreview(false)} label={`${title} video`} accent="secondary">
        {/* Video player */}
        <div className="relative aspect-video w-full overflow-hidden border-b border-border/50 bg-black">
          <video
            src={videoUrl}
            className="w-full h-full object-contain"
            controls
            autoPlay
            muted
            playsInline
            preload="metadata"
            poster={thumbnailUrl}
            aria-label={`${title} walkthrough video`}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 text-left">
          <div className="lg:col-span-8 p-5 sm:p-10 space-y-6 lg:border-r border-border/50">
            <div className="space-y-1">
              {year && <span className="text-ink/40 text-[10px] font-mono uppercase tracking-widest">{year}</span>}
              <h2 className="text-2xl sm:text-4xl font-bold text-ink tracking-tight">{title}</h2>
            </div>
            <section className="space-y-3">
              <SectionHeading accent="secondary">Project Overview</SectionHeading>
              <p className="text-sm sm:text-lg text-ink/80 leading-relaxed">{description}</p>
            </section>
          </div>

          <aside className="lg:col-span-4 bg-neutral-bg/20 p-5 sm:p-10 space-y-8">
            <section className="space-y-4">
              <MetaHeading>Technologies</MetaHeading>
              <ChipList items={tags} accent="secondary" label="Technologies" />
            </section>
            <p className="text-[10px] text-ink/30 uppercase tracking-widest">Recorded build demonstration</p>
          </aside>
        </div>
      </ModalShell>
    </>
  );
};

export default VideoCard;
