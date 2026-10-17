import { useState } from "react";
import type { FC } from "react";
import { Maximize2, PlayCircle } from "lucide-react";
import CardFace from "./ui/CardFace";
import ModalShell from "./ui/ModalShell";
import Lightbox from "./ui/Lightbox";
import { ChipList, HighlightList, MetaHeading, SectionHeading, SourceLink, SpecRow } from "./ui/ModalParts";

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  videoUrl?: string;
  contentUrl?: string;
  webUrl?: string;
  completionDate?: string;
  challenges?: string;
  keyFeatures?: string[];
  impact?: string;
  setup?: string[];
  platform?: string;
}

const ProjectCard: FC<ProjectCardProps> = ({
  title,
  description,
  tags,
  imageUrl,
  videoUrl,
  contentUrl,
  webUrl,
  completionDate,
  challenges,
  keyFeatures,
  impact,
  setup,
  platform,
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const [fullscreen, setFullscreen] = useState<number | null>(null);

  const previewSrc = webUrl || imageUrl;

  return (
    <>
      <CardFace
        title={title}
        description={description}
        tags={tags}
        imageUrl={imageUrl}
        badge={completionDate}
        onOpen={() => setShowPreview(true)}
        centerOverlay={
          videoUrl ? (
            <div
              className="p-3 bg-neutral-bg/40 backdrop-blur-md rounded-full border border-white/20
                group-hover:scale-110 group-hover:bg-primary/20 group-hover:border-primary/50 transition-all duration-500"
            >
              <PlayCircle className="w-10 h-10 text-white/80 group-hover:text-primary transition-colors" aria-hidden="true" />
            </div>
          ) : undefined
        }
      />

      <ModalShell
        open={showPreview}
        onClose={() => setShowPreview(false)}
        label={`${title} details`}
        closeOnEscape={fullscreen === null}
      >
        {/* Hero media */}
        <div
          className={`relative w-full overflow-hidden border-b border-border/50 bg-black ${
            videoUrl ? "aspect-video" : "aspect-[16/10] sm:aspect-[21/8]"
          }`}
        >
          {videoUrl ? (
            <video
              src={videoUrl}
              className="w-full h-full object-contain"
              autoPlay
              muted
              loop
              playsInline
              controls
              preload="metadata"
              aria-label={`${title} demo video`}
            />
          ) : (
            <>
              <img src={previewSrc} alt={`${title} preview`} className="w-full h-full object-cover object-center" />
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-neutral-bg/80 to-transparent pointer-events-none" />
            </>
          )}

          <button
            type="button"
            onClick={() => setFullscreen(0)}
            className="absolute top-3 right-16 sm:top-4 sm:right-20 flex items-center gap-2 px-3 py-2 bg-neutral-bg/80 backdrop-blur-md rounded-md border border-border/50
              z-30 hover:bg-primary hover:text-neutral-bg text-primary transition-all font-bold text-[11px] uppercase tracking-widest shadow-xl"
            aria-label="View fullscreen"
          >
            <Maximize2 className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">Fullscreen</span>
          </button>
        </div>

        {/* Header */}
        <div className="px-6 sm:px-10 pt-6 sm:pt-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-left">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              {completionDate && (
                <span className="inline-block px-2 py-0.5 bg-primary/20 text-primary border border-primary/30 rounded-sm text-[10px] font-bold uppercase tracking-widest">
                  {completionDate}
                </span>
              )}
              {platform && <span className="text-ink/40 text-[10px] font-mono uppercase tracking-widest">{platform}</span>}
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-ink tracking-tight">{title}</h2>
          </div>
          {contentUrl && <SourceLink href={contentUrl} />}
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 text-left">
          <div className="lg:col-span-8 p-6 sm:p-10 space-y-10 lg:border-r border-border/50">
            <section className="space-y-3">
              <SectionHeading>Overview</SectionHeading>
              <p className="text-base sm:text-lg text-ink/80 leading-relaxed">{description}</p>
            </section>

            {keyFeatures && keyFeatures.length > 0 && (
              <section className="space-y-6">
                <SectionHeading accent="secondary">Highlights</SectionHeading>
                <HighlightList items={keyFeatures} />
              </section>
            )}

            {impact && (
              <section className="p-6 bg-neutral-bg/40 border border-border/50 rounded-md space-y-3">
                <SectionHeading accent="accent">Impact</SectionHeading>
                <p className="text-sm text-ink/70 leading-relaxed">{impact}</p>
              </section>
            )}

            {challenges && (
              <section className="p-6 bg-neutral-bg/40 border border-border/50 rounded-md space-y-3">
                <SectionHeading accent="accent">Challenges</SectionHeading>
                <p className="text-sm text-ink/60 italic leading-relaxed">{challenges}</p>
              </section>
            )}
          </div>

          <aside className="lg:col-span-4 bg-neutral-bg/20 p-6 sm:p-10 space-y-10">
            <section className="space-y-4">
              <MetaHeading>Tech Stack</MetaHeading>
              <ChipList items={tags} label="Technologies" />
            </section>

            <section className="space-y-4">
              <MetaHeading>Details</MetaHeading>
              <div className="space-y-1">
                {completionDate && <SpecRow label="Year" value={completionDate} />}
                {platform && <SpecRow label="Platform" value={platform} />}
                {setup && setup.length > 0 && (
                  <div className="py-2.5">
                    <span className="text-ink/40 text-xs block mb-3">Environment</span>
                    <ul className="flex flex-wrap gap-2">
                      {setup.map((s) => (
                        <li
                          key={s}
                          className="text-[10px] bg-secondary/10 text-secondary border border-secondary/20 px-2 py-0.5 rounded-full uppercase font-bold tracking-wide"
                        >
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          </aside>
        </div>
      </ModalShell>

      <Lightbox
        index={fullscreen}
        onClose={() => setFullscreen(null)}
        items={[
          videoUrl
            ? {
                alt: `${title} demo video`,
                render: () => (
                  <video
                    src={videoUrl}
                    className="max-w-full max-h-[90vh] object-contain shadow-2xl rounded-lg"
                    autoPlay
                    controls
                    playsInline
                  />
                ),
              }
            : { src: previewSrc, alt: `${title} preview` },
        ]}
      />
    </>
  );
};

export default ProjectCard;
