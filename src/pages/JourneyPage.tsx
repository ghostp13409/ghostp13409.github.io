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
import ProjectCard from "../components/ui/ProjectCard";
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

  const featuredProjects = projects.slice(0, 3);
  const otherProjects = projects.slice(3);

  return (
    <section
      id="journey"
      className="px-8 sm:px-16 lg:px-32 py-32 space-y-24 relative overflow-hidden grain"
    >
      <div className="max-w-7xl mx-auto space-y-24 relative z-10">
        {/* Simple Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
          className="flex flex-col md:flex-row justify-between items-center gap-12 border-b border-black/[0.03] pb-16"
        >
          <div className="space-y-4 text-center md:text-left">
            <h2 className="text-5xl md:text-7xl font-black text-text-main tracking-tight leading-none uppercase">
              The <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-peach via-accent-sky to-accent-lavender">
                Key Moments
              </span>
            </h2>
            <p className="text-text-muted font-bold tracking-widest uppercase text-xs">A chronicle of my growth and creations</p>
          </div>
          <div className="p-1.5 rounded-full bg-white/40 border border-white shadow-sm">
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-32"
            >
              {/* Featured Projects Section */}
              <section className="space-y-24">
                <div className="flex items-center gap-4">
                   <div className="p-3 rounded-2xl bg-accent-peach/10 text-accent-peach">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h3 className="text-3xl font-black text-text-main tracking-tight uppercase">Featured Work</h3>
                  <div className="h-px flex-1 bg-black/[0.05]"></div>
                </div>
                <div className="space-y-32">
                  {featuredProjects.map((project, index) => (
                    <FeaturedProject
                      key={project.id}
                      project={project}
                      index={index}
                    />
                  ))}
                </div>
              </section>

              {/* Other Projects Section */}
              <section className="space-y-16 pt-16">
                <div className="flex items-center gap-4">
                  <h3 className="text-3xl font-black text-text-main tracking-tight uppercase">More Creations</h3>
                  <div className="h-px flex-1 bg-black/[0.05]"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {otherProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </section>

              {/* Experience section */}
              <section className="space-y-16 pt-16">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-accent-sky/10 text-accent-sky">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <h3 className="text-3xl font-black text-text-main tracking-tight uppercase">
                    Professional Experience
                  </h3>
                  <div className="h-px flex-1 bg-black/[0.05]"></div>
                </div>

                <div className="grid grid-cols-1 gap-12 max-w-5xl">
                  {experiences.map((exp) => (
                    <ExperienceCard key={exp.id} experience={exp} />
                  ))}
                </div>
              </section>
            </motion.div>
          ) : (
            <motion.div
              key="education-journey"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-24"
            >
              {/* School Summary Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-12">
                  <section className="creative-card p-10 relative overflow-hidden group grain border border-black/5">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-8 relative z-10">
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <h2 className="text-4xl md:text-5xl font-black text-text-main tracking-tight leading-tight uppercase">
                            {education.institution.name}
                          </h2>
                          <p className="text-xl text-text-main/70 font-bold uppercase tracking-tight">
                            {education.program.title}
                          </p>
                        </div>
                        <p className="prose-refined">
                          {education.program.description}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-6 p-8 rounded-3xl bg-white/50 backdrop-blur-sm border border-black/[0.03] shrink-0">
                        {[
                          { label: "GPA", value: education.program.gpa, c: "text-accent-peach" },
                          { label: "Status", value: education.program.status, c: "text-accent-sky" },
                          { label: "Distinction", value: "DEAN'S LIST", c: "text-accent-mint" },
                          { label: "Duration", value: "2024-2026", c: "text-accent-lavender" },
                        ].map((stat, i) => (
                          <div key={i} className="space-y-1">
                            <div className={`text-2xl font-black tracking-tight leading-none ${stat.c}`}>
                              {stat.value}
                            </div>
                            <div className="text-[9px] font-black text-text-muted uppercase tracking-widest">
                              {stat.label}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>

                  {/* Highlights instead of full timeline */}
                  <div className="space-y-8">
                     <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-accent-lavender/10 text-accent-lavender">
                          <GraduationCap className="w-5 h-5" />
                        </div>
                        <h3 className="text-2xl font-black text-text-main tracking-tight uppercase">Academic Highlights</h3>
                        <div className="h-px flex-1 bg-black/[0.05]"></div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {education.achievements.map((achievement, i) => (
                          <div key={i} className="creative-card p-8 space-y-4 border border-black/5">
                            <div className="flex items-center gap-4">
                              <span className="text-3xl">{achievement.icon}</span>
                              <div>
                                <h4 className="text-lg font-black text-text-main uppercase tracking-tight">{achievement.title}</h4>
                                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{achievement.subtitle}</p>
                              </div>
                            </div>
                            <p className="text-sm font-medium text-text-main/60 leading-relaxed italic">
                              {achievement.description}
                            </p>
                          </div>
                        ))}
                      </div>
                  </div>
                </div>

                {/* Simplified Sidebar */}
                <div className="space-y-12">
                  <div className="creative-card p-10 space-y-10 group border border-black/5">
                    <h4 className="text-[10px] font-black text-text-muted uppercase tracking-widest">
                      Technical Arsenal
                    </h4>
                    <div className="space-y-10">
                      {skills.map((category) => (
                        <div key={category.id} className="space-y-4">
                          <h4 className={`text-xs font-black uppercase tracking-widest ${getCategoryColor(category.title)}`}>
                            {category.title}
                          </h4>
                          <div className="flex flex-wrap gap-2">
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

                  <div className="space-y-8 px-4">
                    <h4 className="text-[10px] font-black text-text-muted uppercase tracking-widest">
                      Key Certifications
                    </h4>
                    <div className="space-y-4">
                      {certificates.map((cert, index) => (
                        <CertificateCard
                          key={cert.id}
                          certificate={cert}
                          index={index}
                        />
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
