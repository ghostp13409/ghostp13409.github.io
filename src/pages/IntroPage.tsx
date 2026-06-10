import { Coffee, Heart, Zap, ArrowDown, Code2 } from "lucide-react";
import { motion } from "framer-motion";
import type { FC } from "react";

const IntroPage: FC = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeOut" },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const personalityTraits = [
    {
      icon: Coffee,
      title: "Fueled by Coffee",
      description:
        "1 Coffee = 2.16e * (BugsFixed / (Meetings + TabsOpen)) + 0.5 * NewBugs",
      color: "from-accent/60 to-accent",
    },
    {
      icon: Zap,
      title: "Quick Learner",
      description: "Can master new tech in just a few days",
      color: "from-primary/60 to-primary",
    },
    {
      icon: Heart,
      title: "Problem Solver at Heart",
      description: "Love creating things that actually matter",
      color: "from-secondary/60 to-secondary",
    },
  ];

  return (
    <section
      id="intro"
      className="min-h-screen flex flex-col justify-center items-center p-6 relative overflow-hidden bg-neutral-bg"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-secondary/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-accent/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-40 right-10 w-28 h-28 bg-primary/10 rounded-full blur-xl"></div>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="w-full px-4 sm:px-8 lg:px-16 xl:px-10 text-center z-10"
      >
        {/* Main greeting */}
        <motion.div variants={fadeInUp} className="mb-6 sm:mb-8">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight">
            <span className="text-primary">
              Hey, I'm Parth!
            </span>
          </h1>
        </motion.div>

        {/* Personal introduction */}
        <motion.div variants={fadeInUp} className="mb-8 sm:mb-12">
          <div className="bg-surface/40 backdrop-blur-xl p-6 sm:p-8 rounded-lg border border-border/50 shadow-2xl">
            <p className="text-lg sm:text-2xl text-ink leading-relaxed mb-4 sm:mb-6">
              I'm a{" "}
              <span className="text-primary font-semibold">
                software developer
              </span>{" "}
              who loves building cool stuff and solving problems. When I'm not
              coding, you'll probably find me
              <span className="text-secondary font-semibold">
                {" "}
                playing Doom
              </span>{" "}
              my comfort shows,
              <span className="text-accent font-semibold">
                {" "}
                modding Skyrim
              </span>
              , or trying out the latest Linux distro.
            </p>

            <div className="flex items-center justify-center gap-2 sm:gap-3 text-ink/60">
              <Code2 className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-xs sm:text-base">Currently creating bugs in Ontario, Canada</span>
            </div>
          </div>
        </motion.div>

        {/* Personality traits */}
        <motion.div variants={fadeInUp} className="mb-12">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            {personalityTraits.map((trait, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="bg-surface/50 backdrop-blur-sm p-6 rounded-md border border-border hover:border-primary/50 transition-all duration-300 group hover:-translate-y-2 flex-1"
              >
                <div
                  className={`w-16 h-16 rounded-md bg-gradient-to-br ${trait.color} flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}
                >
                  <trait.icon className="h-8 w-8 text-neutral-bg" />
                </div>
                <h3 className="text-lg font-bold text-ink mb-2">
                  {trait.title}
                </h3>
                <p className="text-ink/60 text-sm">{trait.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick philosophy */}
        <motion.div variants={fadeInUp} className="mb-12">
          <blockquote className="text-lg sm:text-xl italic text-ink/80 max-w-3xl mx-auto leading-relaxed">
            "I believe in solving real problems through my work. Whether it's
            building software that makes life easier or creating tools that
            empower others, my goal is to make a positive impact with every
            project I undertake."
          </blockquote>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          variants={fadeInUp}
          className="flex flex-col items-center gap-3"
        >
          <p className="text-ink/40 text-sm">
            Want to know more? Scroll down to explore
          </p>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ArrowDown className="h-6 w-6 text-ink/20" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default IntroPage;
