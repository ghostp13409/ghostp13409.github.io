import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  projects,
  experiences,
  education,
  certificates,
  inProgress,
  skills,
} from "../data/mockdata";
import FeaturedProject from "../components/ui/FeaturedProject";
import ExperienceCard from "../components/ui/ExperienceCard";
import Timeline from "../components/ui/Timeline";
import CertificateCard from "../components/ui/CertificateCard";
import JourneyTabs from "../components/ui/JourneyTabs";
import { Badge } from "../components/ui/Badge";
import {
  Sparkles,
  Briefcase,
  BookOpen,
  GraduationCap,
  Heart,
} from "lucide-react";
import { cn } from "../lib/utils";

const JourneyPage = () => {
  const [activeJourney, setActiveJourney] = useState<"dev" | "education">(
    "dev",
  );

  const getCategoryColor = (title: string) => {
    if (title.toLowerCase().includes("languages")) return "text-accent-peach";
    if (title.toLowerCase().includes("frameworks")) return "text-accent-sky";
    if (
      title.toLowerCase().includes("tools") ||
      title.toLowerCase().includes("cloud")
    )
      return "text-accent-lavender";
    return "text-text-main";
  };

  return (
    <section
      id="journey"
      className="px-8 sm:px-16 lg:px-32 py-48 space-y-32 relative overflow-hidden grain"
    >
      <div className="max-w-7xl mx-auto space-y-24 relative z-10">
        {/* Simple Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
          className="flex flex-col md:flex-row justify-between items-end gap-12 border-b border-black/[0.03] pb-24"
        >
          <div className="space-y-8 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white shadow-sm border border-black/5">
              <Sparkles className="w-5 h-5 text-accent-peach" />
              <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em]">
                My Story
              </span>
            </div>
            <h2 className="text-6xl md:text-8xl font-black text-text-main tracking-tighter leading-[0.85] italic uppercase">
              The <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-peach via-accent-sky to-accent-lavender">
                Key Moments
              </span>{" "}
              <br />
              of my career<span className="text-black/10">.</span>
            </h2>
          </div>
          <div className="p-2 rounded-[3rem] bg-white/40 border border-white shadow-xl">
            <JourneyTabs
              activeTab={activeJourney}
              onChange={setActiveJourney}
            />
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {activeJourney === "dev" ? (
            <motion.div
              key="dev-journey"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              className="space-y-64"
            >
              {/* Projects Section */}
              <section className="space-y-48">
                <div className="space-y-48">
                  {projects.map((project, index) => (
                    <FeaturedProject
                      key={project.id}
                      project={project}
                      index={index}
                    />
                  ))}
                </div>
              </section>

              {/* Experience section */}
              <section className="space-y-24">
                <div className="flex items-center gap-8 group">
                  <div className="p-5 rounded-[2rem] bg-accent-peach/10 text-accent-peach shadow-sm">
                    <Briefcase className="w-8 h-8" />
                  </div>
                  <div className="space-y-1 text-left">
                    <h3 className="text-4xl font-black text-text-main tracking-tight uppercase italic leading-none">
                      Work Experience
                    </h3>
                    <p className="text-[10px] font-black text-accent-peach uppercase tracking-[0.4em]">
                      My professional background
                    </p>
                  </div>
                  <div className="h-px flex-1 bg-gradient-to-r from-black/[0.05] to-transparent"></div>
                </div>

                <div className="grid grid-cols-1 gap-16 max-w-6xl">
                  {experiences.map((exp, idx) => (
                    <div
                      key={exp.id}
                      className={idx % 2 === 0 ? "" : "lg:pl-24"}
                    >
                      <ExperienceCard experience={exp} />
                    </div>
                  ))}
                </div>
              </section>
            </motion.div>
          ) : (
            <motion.div
              key="education-journey"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              className="space-y-64"
            >
              {/* School Section */}
              <section className="creative-card p-10 md:p-20 relative overflow-hidden group grain border border-black/5">
                <div className="absolute -right-32 -bottom-32 text-black/[0.02] scale-[6] -rotate-12 pointer-events-none">
                  <GraduationCap className="w-48 h-48" />
                </div>

                <div className="flex flex-col lg:flex-row justify-between items-center gap-16 relative z-10">
                  <div className="max-w-4xl space-y-8 text-left">
                    <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-accent-mint/10 border border-accent-mint/20 shadow-sm">
                      <span className="text-[10px] font-black text-text-main oklch-text-dark uppercase tracking-[0.4em]">
                        Where I Learn
                      </span>
                    </div>
                    <div className="space-y-4">
                      <h2 className="text-5xl md:text-7xl font-black text-text-main tracking-tighter leading-[1] italic uppercase">
                        {education.institution.name}
                      </h2>
                      <p className="text-xl md:text-2xl text-text-main/80 font-black tracking-tight leading-tight uppercase italic">
                        {education.program.title}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8 w-full lg:w-auto p-10 rounded-[3rem] bg-white shadow-xl border border-black/[0.02] shrink-0">
                    {[
                      {
                        label: "GPA",
                        value: education.program.gpa,
                        c: "text-accent-peach",
                      },
                      {
                        label: "Sememsters",
                        value: `${education.program.completedSemesters}/${education.program.totalSemesters}`,
                        c: "text-accent-sky",
                      },
                      {
                        label: "Year",
                        value: "FINAL",
                        c: "text-accent-lavender",
                      },
                      {
                        label: "Distinction",
                        value: "DEAN'S",
                        c: "text-accent-mint",
                      },
                    ].map((stat, i) => (
                      <div key={i} className="space-y-1 text-left">
                        <div
                          className={`text-4xl font-black tracking-tighter leading-none ${stat.c}`}
                        >
                          {stat.value}
                        </div>
                        <div className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-32">
                {/* Courses */}
                <div className="lg:col-span-7 space-y-24 text-left">
                  <div className="flex items-center gap-8 group">
                    <div className="p-5 rounded-[2rem] bg-accent-lavender/10 text-accent-lavender shadow-sm">
                      <BookOpen className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-4xl font-black text-text-main tracking-tight uppercase italic leading-none">
                        Learning Path
                      </h3>
                    </div>
                    <div className="h-px flex-1 bg-gradient-to-r from-black/[0.05] to-transparent"></div>
                  </div>
                  <div className="lg:pl-12 border-l-2 border-black/[0.03]">
                    <Timeline timeline={education.timeline} />
                  </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-5 space-y-32 text-left">
                  <div className="creative-card p-12 md:p-16 space-y-16 group grain border border-black/5">
                    <h4 className="text-[10px] font-black text-text-muted uppercase tracking-[0.5em] italic">
                      Technical Skills
                    </h4>
                    <div className="space-y-16">
                      {skills.map((category) => (
                        <div key={category.id} className="space-y-8">
                          <h4
                            className={`text-sm font-black uppercase tracking-[0.3em] italic ${getCategoryColor(category.title)}`}
                          >
                            {category.title}
                          </h4>
                          <div className="flex flex-wrap gap-3">
                            {category.tags.map((tag) => {
                              const variant = category.title.toLowerCase().includes("languages") ? "peach" : 
                                             category.title.toLowerCase().includes("frameworks") ? "sky" : "lavender";
                              return (
                                <Badge key={tag} variant={variant}>
                                  {tag}
                                </Badge>
                              );
                            })}
                          </div>

                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-16">
                    <h4 className="text-[10px] font-black text-text-muted uppercase tracking-[0.5em] px-6">
                      Certifications
                    </h4>
                    <div className="grid grid-cols-1 gap-8">
                      {certificates.map((cert, index) => (
                        <CertificateCard
                          key={cert.id}
                          certificate={cert}
                          index={index}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="creative-card p-12 md:p-16 space-y-12 bg-white/40 border border-black/5">
                    <h4 className="text-xs font-black text-text-muted uppercase tracking-[0.5em]">
                      Future Goals
                    </h4>
                    <div className="space-y-12">
                      {inProgress.map((item) => (
                        <div key={item.id} className="space-y-6 group">
                          <div className="flex justify-between items-end">
                            <div className="space-y-2">
                              <span className="text-xs font-black text-accent-peach uppercase tracking-[0.2em] italic">
                                Currently Learning
                              </span>
                              <h4 className="text-2xl font-black text-text-main uppercase italic tracking-tighter group-hover:text-accent-peach transition-colors leading-none">
                                {item.title}
                              </h4>
                            </div>
                            <span className="text-4xl font-black text-accent-peach tabular-nums tracking-tighter">
                              {item.progress}
                            </span>
                          </div>
                          <div className="w-full h-4 bg-black/[0.03] rounded-full overflow-hidden border border-black/5">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: item.progress }}
                              viewport={{ once: true }}
                              transition={{ duration: 2, ease: "easeOut" }}
                              className="h-full bg-gradient-to-r from-accent-peach to-accent-lavender"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default JourneyPage;
