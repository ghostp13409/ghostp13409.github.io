import { useState, useEffect } from "react";
import type { FC } from "react";
import { createPortal } from "react-dom";
import { X, Github, Eye, Smartphone, Play, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";

interface MobileAppCardProps {
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  contentUrl?: string;
  completionDate?: string;
  challenges?: string;
  keyFeatures?: string[];
  setup?: string[];
  liveAppUrl: string;
}

const PhoneMockup = ({ isAppStarted, isAppLoading, setIsAppLoading, setIsAppStarted, liveAppUrl, title }: {
  isAppStarted: boolean;
  isAppLoading: boolean;
  setIsAppLoading: (loading: boolean) => void;
  setIsAppStarted: (started: boolean) => void;
  liveAppUrl: string;
  title: string;
}) => (
  <div className="relative mx-auto w-[280px] h-[580px] sm:w-[320px] sm:h-[650px] bg-neutral-950 rounded-[2.5rem] border-[10px] border-surface shadow-2xl overflow-hidden ring-1 ring-border/50">
    {/* Pixel Punch-hole Camera */}
    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-3 h-3 bg-neutral-950 rounded-full z-50 ring-2 ring-neutral-900 flex items-center justify-center">
      <div className="w-1 h-1 bg-neutral-800 rounded-full" />
    </div>

    {/* Screen Content */}
    <div className="relative w-full h-full bg-neutral-900">
      {!isAppStarted ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center space-y-6 z-40 bg-neutral-950/80 backdrop-blur-sm">
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 animate-pulse">
            <Smartphone className="w-10 h-10 text-primary" />
          </div>
          <div className="space-y-2">
            <h4 className="text-lg font-bold text-ink">Live Interactive Preview</h4>
            <p className="text-xs text-ink/40 leading-relaxed uppercase tracking-widest font-mono">
              FLUTTER_WEB_INSTANCE_01
            </p>
          </div>
          <button
            onClick={() => {
              setIsAppLoading(true);
              setIsAppStarted(true);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-neutral-bg rounded-full font-bold text-sm hover:scale-105 transition-transform shadow-lg shadow-primary/20"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>START_APP</span>
          </button>
        </div>
      ) : (
        <>
          {isAppLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-neutral-950">
              <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
              <p className="text-[10px] font-mono text-primary uppercase tracking-[0.2em]">Booting_System...</p>
            </div>
          )}
          <iframe
            src={liveAppUrl.startsWith('http') ? liveAppUrl : `/${liveAppUrl}`}
            className="w-full h-full border-none"
            onLoad={() => setIsAppLoading(false)}
            title={`${title} Live Preview`}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        </>
      )}
    </div>

    {/* Home Indicator */}
    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-neutral-800 rounded-full z-50" />
  </div>
);

const MobileAppCard: FC<MobileAppCardProps> = ({
  title,
  description,
  tags,
  imageUrl,
  contentUrl,
  completionDate,
  challenges,
  keyFeatures,
  liveAppUrl,
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isAppLoading, setIsAppLoading] = useState(false);
  const [isAppStarted, setIsAppStarted] = useState(false);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowPreview(false);
        setIsAppStarted(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    },
    hover: {
      y: -8,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  return (
    <>
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        onClick={() => setShowPreview(true)}
        className="group relative flex flex-col bg-surface/40 backdrop-blur-xl rounded-lg
          cursor-pointer overflow-hidden border border-border/50 hover:border-primary/50
          shadow-xl hover:shadow-2xl transition-all duration-300"
      >
        <div className="absolute inset-0 bg-primary/5
          opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg" />

        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-t-lg bg-neutral-bg">
          <div className={`absolute inset-0 bg-surface/80 transition-opacity duration-300 z-20 ${
            imageLoaded ? 'opacity-0' : 'opacity-100'
          }`} />

          <img
            src={imageUrl}
            alt={title}
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover object-center transform group-hover:scale-105
              transition-all duration-700 ease-out ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-neutral-bg/80 via-transparent to-neutral-bg/20
            opacity-60 group-hover:opacity-40 transition-opacity duration-300 z-10" />

          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transform
            translate-y-2 group-hover:translate-y-0 transition-all duration-500 z-30 scale-90 group-hover:scale-100 flex gap-2">
            <div className="px-3 py-2 bg-primary/20 backdrop-blur-md border border-primary/30 rounded-md flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Live_Demo</span>
            </div>
            <div className="p-3 bg-primary text-neutral-bg rounded-full shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all">
              <Eye className="h-5 w-5" />
            </div>
          </div>

          {completionDate && (
            <div className="absolute top-4 left-4 px-3 py-1 bg-neutral-bg/80 backdrop-blur-sm
              rounded-full border border-border/50 z-30">
              <span className="text-xs font-medium text-ink/60">{completionDate}</span>
            </div>
          )}
        </div>

        <div className="p-4 sm:p-6 flex flex-col flex-grow relative z-10">
          <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-ink group-hover:text-primary
            transition-colors duration-300 leading-tight">
            {title}
          </h3>

          <p className="text-ink/60 text-sm mb-4 sm:mb-5 line-clamp-3 flex-grow leading-relaxed">
            {description}
          </p>

          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
            {tags.slice(0, 4).map((tag, index) => (
              <span
                key={index}
                className="px-2 sm:px-3 py-1 sm:py-1.5 bg-primary/10 text-primary rounded-md text-xs font-medium
                  border border-primary/20 transition-all duration-300
                  group-hover:border-primary/40 group-hover:bg-primary/20"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {createPortal(
        <AnimatePresence mode="wait">
          {showPreview && (
            <motion.div
              key="modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-neutral-bg/98 backdrop-blur-md z-[9999] flex items-center justify-center p-4 sm:p-6 lg:p-8"
              onClick={() => {
                setShowPreview(false);
                setIsAppStarted(false);
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 30, scale: 0.98 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-6xl max-h-[90vh] bg-surface/40 backdrop-blur-xl rounded-lg
                  shadow-2xl border border-border/50 overflow-hidden flex flex-col"
              >
                <button
                  onClick={() => {
                    setShowPreview(false);
                    setIsAppStarted(false);
                  }}
                  className="absolute top-4 right-4 p-2.5 bg-neutral-bg/80 backdrop-blur-md rounded-full
                    hover:bg-primary/20 hover:text-primary transition-all duration-300 z-50 border border-border/50 group"
                >
                  <X className="w-5 h-5 text-ink/60 group-hover:scale-110" />
                </button>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 min-h-0">
                    {/* Interactive App Column */}
                    <div className="lg:col-span-6 bg-neutral-bg/40 p-8 lg:p-12 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-border/50">
                      <PhoneMockup
                        isAppStarted={isAppStarted}
                        isAppLoading={isAppLoading}
                        setIsAppLoading={setIsAppLoading}
                        setIsAppStarted={setIsAppStarted}
                        liveAppUrl={liveAppUrl}
                        title={title}
                      />
                    </div>

                    {/* Main Story Column */}
                    <div className="lg:col-span-6 p-6 sm:p-10 space-y-10 border-r border-border/50">
                      <div className="space-y-4 pb-8 border-b border-border/30">
                        <div className="flex items-center gap-3">
                          <span className="px-2 py-0.5 bg-primary/20 text-primary border border-primary/30 rounded-sm text-[10px] font-bold uppercase tracking-widest">
                            Flutter Application
                          </span>
                          <span className="h-px w-6 bg-border" />
                          <span className="text-ink/40 text-[10px] font-mono uppercase">LIVE_DEMO</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold text-ink tracking-tight">
                          {title}
                        </h2>
                        <div className="flex items-center gap-4">
                          {contentUrl && (
                            <a
                              href={contentUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-bold text-xs uppercase tracking-widest"
                            >
                              <Github className="w-4 h-4" />
                              <span>View_Source</span>
                            </a>
                          )}
                        </div>
                      </div>

                      <section className="space-y-3">
                        <div className="flex items-center gap-2 text-primary">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                          <h3 className="text-[11px] font-bold uppercase tracking-widest">The Vision</h3>
                        </div>
                        <p className="text-base sm:text-lg text-ink/80 leading-relaxed">
                          {description}
                        </p>
                      </section>

                      {keyFeatures && keyFeatures.length > 0 && (
                        <section className="space-y-6">
                          <div className="flex items-center gap-2 text-secondary">
                            <div className="w-1.5 h-1.5 bg-secondary rounded-full" />
                            <h3 className="text-[11px] font-bold uppercase tracking-widest">Core Capabilities</h3>
                          </div>
                          <div className="grid grid-cols-1 gap-4">
                            {keyFeatures.map((feature, index) => (
                              <div key={index} className="flex gap-4 p-4 bg-neutral-bg/20 border border-border/30 rounded-md group hover:border-primary/30 transition-all duration-300">
                                <div className="w-6 h-6 rounded-full border border-border flex items-center justify-center text-[10px] font-mono text-ink/40 group-hover:text-primary group-hover:border-primary transition-colors flex-shrink-0">
                                  0{index + 1}
                                </div>
                                <p className="text-sm text-ink/60 group-hover:text-ink/90 transition-colors leading-relaxed">
                                  {feature}
                                </p>
                              </div>
                            ))}
                          </div>
                        </section>
                      )}

                      {challenges && (
                        <section className="p-6 bg-neutral-bg/40 border border-border/50 rounded-md space-y-3">
                          <div className="flex items-center gap-2 text-accent">
                            <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                            <h3 className="text-[11px] font-bold uppercase tracking-widest">The Hurdles</h3>
                          </div>
                          <p className="text-sm text-ink/60 italic leading-relaxed">
                            "{challenges}"
                          </p>
                        </section>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

export default MobileAppCard;
