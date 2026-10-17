import { useState } from "react";
import type { FC } from "react";
import { Eye } from "lucide-react";
import CardFace from "./ui/CardFace";
import ModalShell from "./ui/ModalShell";
import Lightbox from "./ui/Lightbox";
import { ChipList, MetaHeading, SectionHeading, SourceLink } from "./ui/ModalParts";

interface ProjectShowcaseCardProps {
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  contentUrl?: string;
  completionDate?: string;
  challenges?: string;
  keyFeatures?: string[];
  impact?: string;
  screenshots?: string[];
}

/** Project with a screenshot gallery (mobile app screens). */
const ProjectShowcaseCard: FC<ProjectShowcaseCardProps> = ({
  title,
  description,
  tags,
  imageUrl,
  contentUrl,
  completionDate,
  challenges,
  keyFeatures,
  impact,
  screenshots = [],
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const [screenshotIndex, setScreenshotIndex] = useState<number | null>(null);

  return (
    <>
      <CardFace
        title={title}
        description={description}
        tags={tags}
        imageUrl={imageUrl}
        badge={completionDate}
        onOpen={() => setShowPreview(true)}
      />

      <ModalShell
        open={showPreview}
        onClose={() => setShowPreview(false)}
        label={`${title} details`}
        closeOnEscape={screenshotIndex === null}
      >
        <div className="relative aspect-[16/10] sm:aspect-[21/7] w-full overflow-hidden border-b border-border/50">
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-bg via-neutral-bg/20 to-transparent z-10 pointer-events-none" />
          <img src={imageUrl} alt={`${title} preview`} className="w-full h-full object-cover object-center" />

          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 lg:p-10 z-20 pointer-events-none text-left">
            <div className="space-y-1">
              {completionDate && (
                <span className="inline-block px-2 py-0.5 bg-primary/20 text-primary border border-primary/30 rounded-sm text-[10px] font-bold uppercase tracking-widest">
                  {completionDate}
                </span>
              )}
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-ink tracking-tight drop-shadow-md">{title}</h2>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 text-left">
          <div className="lg:col-span-8 p-5 sm:p-10 space-y-8 sm:space-y-10 lg:border-r border-border/50">
            <section className="space-y-3">
              <SectionHeading>Overview</SectionHeading>
              <p className="text-sm sm:text-lg text-ink/80 leading-relaxed">{description}</p>
            </section>

            {screenshots.length > 0 && (
              <section className="space-y-6">
                <SectionHeading accent="secondary">Gallery</SectionHeading>
                <ul className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
                  {screenshots.map((url, index) => (
                    <li key={url}>
                      <button
                        type="button"
                        onClick={() => setScreenshotIndex(index)}
                        aria-label={`Open screenshot ${index + 1} of ${screenshots.length}`}
                        className="relative w-full aspect-[9/16] bg-neutral-bg/40 rounded-md overflow-hidden border border-border/50 cursor-zoom-in group/item shadow-lg"
                      >
                        <img
                          src={url}
                          alt=""
                          loading="lazy"
                          className="w-full h-full object-cover transform group-hover/item:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute inset-0 bg-primary/5 opacity-0 group-hover/item:opacity-100 transition-opacity flex items-center justify-center">
                          <Eye className="w-8 h-8 text-primary opacity-50" aria-hidden="true" />
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <aside className="lg:col-span-4 bg-neutral-bg/20 p-6 sm:p-10 space-y-10">
            <section className="space-y-4">
              <MetaHeading>Tech Stack</MetaHeading>
              <ChipList items={tags} label="Technologies" />
            </section>

            {keyFeatures && keyFeatures.length > 0 && (
              <section className="space-y-4">
                <MetaHeading>Highlights</MetaHeading>
                <ul className="space-y-2">
                  {keyFeatures.map((feature) => (
                    <li key={feature} className="flex gap-3 text-sm text-ink/60 leading-relaxed">
                      <span className="text-primary font-mono mt-0.5" aria-hidden="true">
                        →
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {impact && (
              <section className="space-y-4">
                <MetaHeading>Impact</MetaHeading>
                <p className="text-xs text-ink/60 leading-relaxed border-l-2 border-primary/30 pl-4">{impact}</p>
              </section>
            )}

            {challenges && (
              <section className="space-y-4">
                <MetaHeading>Challenges</MetaHeading>
                <p className="text-xs text-ink/60 italic leading-relaxed border-l-2 border-accent/30 pl-4">{challenges}</p>
              </section>
            )}

            {contentUrl && (
              <div className="pt-2">
                <SourceLink href={contentUrl} block />
              </div>
            )}
          </aside>
        </div>
      </ModalShell>

      <Lightbox
        index={screenshotIndex}
        onClose={() => setScreenshotIndex(null)}
        onIndexChange={setScreenshotIndex}
        items={screenshots.map((src, i) => ({ src, alt: `${title} screenshot ${i + 1}` }))}
      />
    </>
  );
};

export default ProjectShowcaseCard;
