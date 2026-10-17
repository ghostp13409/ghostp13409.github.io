import { useState } from "react";
import type { FC } from "react";
import { Smartphone, Play, Loader2 } from "lucide-react";
import CardFace from "./ui/CardFace";
import ModalShell from "./ui/ModalShell";
import { ChipList, HighlightList, MetaHeading, SectionHeading, SourceLink } from "./ui/ModalParts";

interface MobileAppCardProps {
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  contentUrl?: string;
  completionDate?: string;
  challenges?: string;
  keyFeatures?: string[];
  impact?: string;
  liveAppUrl: string;
}

interface PhoneMockupProps {
  liveAppUrl: string;
  title: string;
}

/** Phone frame that boots the live web build on demand (it is a heavy download). */
const PhoneMockup: FC<PhoneMockupProps> = ({ liveAppUrl, title }) => {
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const src = liveAppUrl.startsWith("http") ? liveAppUrl : `/${liveAppUrl}`;

  return (
    <div className="relative mx-auto w-[280px] h-[580px] sm:w-[320px] sm:h-[650px] max-w-full bg-neutral-950 rounded-[2.5rem] border-[10px] border-surface shadow-2xl overflow-hidden ring-1 ring-border/50">
      {/* Punch-hole camera */}
      <div
        className="absolute top-4 left-1/2 -translate-x-1/2 w-3 h-3 bg-neutral-950 rounded-full z-50 ring-2 ring-neutral-900 flex items-center justify-center"
        aria-hidden="true"
      >
        <div className="w-1 h-1 bg-neutral-800 rounded-full" />
      </div>

      <div className="relative w-full h-full bg-neutral-900">
        {!started ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center space-y-6 z-40 bg-neutral-950/80 backdrop-blur-sm">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 animate-pulse">
              <Smartphone className="w-10 h-10 text-primary" aria-hidden="true" />
            </div>
            <div className="space-y-2">
              <h4 className="text-lg font-bold text-ink">Live Interactive Preview</h4>
              <p className="text-xs text-ink/50 leading-relaxed">
                Runs the real Flutter web build inside this frame. It may take a few seconds to load.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setLoading(true);
                setStarted(true);
              }}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-neutral-bg rounded-full font-bold text-sm hover:scale-105 transition-transform shadow-lg shadow-primary/20"
            >
              <Play className="w-4 h-4 fill-current" aria-hidden="true" />
              <span>Launch App</span>
            </button>
          </div>
        ) : (
          <>
            {loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-neutral-950" role="status">
                <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" aria-hidden="true" />
                <p className="text-xs text-primary uppercase tracking-[0.2em]">Loading app…</p>
              </div>
            )}
            <iframe
              src={src}
              className="w-full h-full border-none"
              onLoad={() => setLoading(false)}
              title={`${title} live preview`}
            />
          </>
        )}
      </div>

      {/* Home indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-neutral-800 rounded-full z-50" aria-hidden="true" />
    </div>
  );
};

const MobileAppCard: FC<MobileAppCardProps> = ({
  title,
  description,
  tags,
  imageUrl,
  contentUrl,
  completionDate,
  challenges,
  keyFeatures,
  impact,
  liveAppUrl,
}) => {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <>
      <CardFace
        title={title}
        description={description}
        tags={tags}
        imageUrl={imageUrl}
        badge={completionDate}
        onOpen={() => setShowPreview(true)}
        hoverChip={
          <div className="px-3 py-2 bg-primary/20 backdrop-blur-md border border-primary/30 rounded-md flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Live Demo</span>
          </div>
        }
      />

      {/* Unmounting the modal also unmounts the iframe, so the app stops when closed. */}
      <ModalShell open={showPreview} onClose={() => setShowPreview(false)} label={`${title} details and live demo`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 text-left">
          {/* Interactive App Column */}
          <div className="lg:col-span-6 bg-neutral-bg/40 p-6 sm:p-8 lg:p-12 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-border/50 order-2 lg:order-1">
            <PhoneMockup liveAppUrl={liveAppUrl} title={title} />
          </div>

          {/* Story Column */}
          <div className="lg:col-span-6 p-6 sm:p-10 space-y-10 order-1 lg:order-2">
            <div className="space-y-4 pb-8 border-b border-border/30 pr-10">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-2 py-0.5 bg-primary/20 text-primary border border-primary/30 rounded-sm text-[10px] font-bold uppercase tracking-widest">
                  Flutter Application
                </span>
                {completionDate && <span className="text-ink/40 text-[10px] font-mono uppercase">{completionDate}</span>}
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-ink tracking-tight">{title}</h2>
              {contentUrl && <SourceLink href={contentUrl} />}
            </div>

            <section className="space-y-3">
              <SectionHeading>Overview</SectionHeading>
              <p className="text-base sm:text-lg text-ink/80 leading-relaxed">{description}</p>
            </section>

            <section className="space-y-4">
              <MetaHeading>Tech Stack</MetaHeading>
              <ChipList items={tags} label="Technologies" />
            </section>

            {keyFeatures && keyFeatures.length > 0 && (
              <section className="space-y-6">
                <SectionHeading accent="secondary">Highlights</SectionHeading>
                <HighlightList items={keyFeatures} columns={1} />
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
        </div>
      </ModalShell>
    </>
  );
};

export default MobileAppCard;
