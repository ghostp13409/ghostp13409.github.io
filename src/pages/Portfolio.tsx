import { useState, lazy, Suspense, useCallback } from "react";
import type { FC } from "react";
import { Menu, X } from "lucide-react";
import Sidebar from "../components/Sidebar";
import IntroPage from "./IntroPage";
import LoadingSection from "../components/LoadingSection";
import { useEscapeKey, useScrollLock } from "../hooks/useModal";

const ExperiencePage = lazy(() => import("./ExperiencePage"));
const SkillsPage = lazy(() => import("./SkillsPage"));
const ProjectsPage = lazy(() => import("./ProjectsPage"));
const ContactPage = lazy(() => import("./ContactPage"));

/**
 * Page shell.
 *
 * Mobile (< lg): a fixed top bar, a slide-in menu, and the window itself scrolls.
 * Desktop (lg+): a fixed-height two-column layout where the right column is
 * its own scroll container (#main-scroll-container) so the sidebar stays put.
 */
const Portfolio: FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setIsMobileMenuOpen(false), []);

  useScrollLock(isMobileMenuOpen);
  useEscapeKey(isMobileMenuOpen, closeMenu);

  return (
    <div className="min-h-screen bg-neutral-bg text-ink">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 h-18 bg-surface/95 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between h-full px-4">
          <button
            type="button"
            onClick={() => {
              closeMenu();
              document.getElementById("intro")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="flex items-center gap-3 text-left rounded-md"
            aria-label="Back to top"
          >
            <img
              src="images/profile_logo.jpeg"
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover border border-border"
              alt=""
            />
            <span>
              <span className="block text-lg font-bold text-ink leading-tight">Parth Gajjar</span>
              <span className="block text-sm text-ink/60">Software Developer @ Catalis</span>
            </span>
          </button>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            className="mobile-menu-button p-2 rounded-lg bg-border hover:bg-border/80 transition-colors"
            aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          role="presentation"
          className="lg:hidden fixed inset-0 top-18 z-40 bg-neutral-bg/80 backdrop-blur-sm"
          onClick={closeMenu}
        >
          <div
            id="mobile-navigation"
            role="presentation"
            className="mobile-sidebar absolute top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-surface border-l border-border overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar isMobile onMenuItemClick={closeMenu} />
          </div>
        </div>
      )}

      <div className="lg:flex lg:gap-4 lg:h-screen lg:p-4">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex lg:h-full">
          <Sidebar />
        </div>

        {/* Main Content */}
        <main className="pt-18 lg:pt-0 lg:flex-1 lg:min-w-0 lg:h-full">
          <div
            id="main-scroll-container"
            className="lg:h-full lg:overflow-y-auto lg:rounded-lg lg:border border-border bg-neutral-bg"
          >
            <IntroPage />
            <Suspense fallback={<LoadingSection />}>
              <ExperiencePage />
            </Suspense>
            <Suspense fallback={<LoadingSection />}>
              <SkillsPage />
            </Suspense>
            <Suspense fallback={<LoadingSection />}>
              <ProjectsPage />
            </Suspense>
            <Suspense fallback={<LoadingSection />}>
              <ContactPage />
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Portfolio;
