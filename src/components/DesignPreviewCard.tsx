import { useState } from "react";
import type { FC } from "react";
import CardFace from "./ui/CardFace";
import ModalShell from "./ui/ModalShell";
import DesignPreview from "./DesignPreview";
import { ChipList, MetaHeading, SectionHeading, SpecRow } from "./ui/ModalParts";

interface DesignPreviewCardProps {
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
}

const DesignPreviewCard: FC<DesignPreviewCardProps> = ({ title, description, tags, imageUrl }) => {
  const [showPreview, setShowPreview] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  return (
    <>
      <CardFace
        title={title}
        description={description}
        tags={tags}
        imageUrl={imageUrl}
        badge="Design"
        accent="accent"
        onOpen={() => setShowPreview(true)}
      />

      <ModalShell
        open={showPreview}
        onClose={() => setShowPreview(false)}
        label={`${title} gallery`}
        accent="accent"
        closeOnEscape={!lightboxOpen}
      >
        <div className="relative aspect-[16/9] sm:aspect-[21/7] w-full overflow-hidden border-b border-border/50">
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-bg via-neutral-bg/20 to-transparent z-10 pointer-events-none" />
          <img src={imageUrl} alt="" className="w-full h-full object-cover object-center" />

          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-10 z-20 pointer-events-none text-left">
            <div className="space-y-1">
              <span className="inline-block px-2 py-0.5 bg-accent/20 text-accent border border-accent/30 rounded-sm text-[10px] font-bold uppercase tracking-widest">
                Creative Work
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-ink tracking-tight">{title}</h2>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 text-left">
          <div className="lg:col-span-8 p-6 sm:p-10 space-y-10 lg:border-r border-border/50">
            <section className="space-y-3">
              <SectionHeading accent="accent">Overview</SectionHeading>
              <p className="text-base sm:text-lg text-ink/80 leading-relaxed">{description}</p>
            </section>

            <section className="space-y-6">
              <SectionHeading>Gallery</SectionHeading>
              <DesignPreview onLightboxChange={setLightboxOpen} />
            </section>
          </div>

          <aside className="lg:col-span-4 bg-neutral-bg/20 p-6 sm:p-10 space-y-10">
            <section className="space-y-4">
              <MetaHeading>Tools</MetaHeading>
              <ChipList items={tags} accent="accent" label="Tools" />
            </section>

            <section className="space-y-4">
              <MetaHeading>Details</MetaHeading>
              <div className="space-y-1">
                <SpecRow label="Category" value="Graphic Design" />
                <SpecRow label="Deliverables" value="Logos, posters, menus, brochures" />
                <SpecRow label="Clients" value="Local businesses" />
              </div>
            </section>
          </aside>
        </div>
      </ModalShell>
    </>
  );
};

export default DesignPreviewCard;
