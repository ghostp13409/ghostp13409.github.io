import { Coffee, Heart, Zap, ArrowDown, Code2 } from "lucide-react";
import { motion } from "framer-motion";

const IntroPage = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeOut" },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const personalityTraits = [
    {
      icon: Coffee,
      title: "Fueled by Coffee",
      description: "1 Coffee = 2.16e * (BugsFixed / (Meetings + TabsOpen)) + 0.5 * NewBugs",
      color: "from-amber-500 to-orange-500"
    },
    {
      icon: Zap,
      title: "Quick Learner",
      description: "Can master new tech in just a few days",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Heart,
      title: "Problem Solver at Heart",
      description: "Love creating things that actually matter",
      color: "from-red-500 to-pink-500"
    }
  ];

  return (
    <section id="intro" className="min-h-screen flex flex-col justify-center items-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-40 right-10 w-28 h-28 bg-pink-500/10 rounded-full blur-xl"></div>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="w-full px-8 lg:px-16 xl:px-10 text-center z-10"
      >
        {/* Main greeting */}
        <motion.div variants={fadeInUp} className="mb-8">
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 text-transparent bg-clip-text">
              Hey, I'm Parth!
            </span>
          </h1>
        </motion.div>

        {/* Personal introduction */}
        <motion.div variants={fadeInUp} className="mb-12">
          <div className="bg-gray-900/60 backdrop-blur-xl p-8 rounded-3xl border border-gray-700/50 shadow-2xl">
            <p className="text-xl sm:text-2xl text-gray-200 leading-relaxed mb-6">
              I'm a <span className="text-blue-400 font-semibold">computer programming student</span> who
              loves building cool stuff and solving problems. When I'm not coding, you'll probably find me
              <span className="text-purple-400 font-semibold"> playing Doom</span> my comfort shows,
              <span className="text-green-400 font-semibold"> modding Skyrim</span>, or trying out the
              latest Linux distro.
            </p>
            
            <div className="flex items-center justify-center gap-3 text-gray-400">
              <Code2 className="h-5 w-5" />
              <span>Currently creating bugs in Ontario, Canada</span>
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
            className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 group hover:-translate-y-2 flex-1"
                >
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${trait.color} flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}>
              <trait.icon className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-100 mb-2">{trait.title}</h3>
            <p className="text-gray-400 text-sm">{trait.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick philosophy */}
        <motion.div variants={fadeInUp} className="mb-12">
          <blockquote className="text-lg sm:text-xl italic text-gray-300 max-w-3xl mx-auto leading-relaxed">
            "I believe in solving real problems through my work. 
            Whether it's building software that makes life easier or creating tools that empower others, 
            my goal is to make a positive impact with every project I undertake."
          </blockquote>
        </motion.div>

        {/* Current status */}
        <motion.div variants={fadeInUp} className="mb-12">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-900/50 to-blue-900/50 backdrop-blur-sm px-6 py-3 rounded-full border border-green-500/30">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-300 font-medium">Currently available for co-op opportunities!</span>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          variants={fadeInUp}
          className="flex flex-col items-center gap-3"
        >
          <p className="text-gray-400 text-sm">Want to know more? Scroll down to explore</p>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ArrowDown className="h-6 w-6 text-gray-500" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default IntroPage;
