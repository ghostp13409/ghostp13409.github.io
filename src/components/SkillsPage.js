import { Skills, Certificates, inProgress } from "./data";
import { motion } from "framer-motion";
import { GraduationCap, Award, BookOpen, TrendingUp } from "lucide-react";

const SkillsPage = () => {
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

  return (
    <section id="skills" className="min-h-screen flex flex-col justify-center items-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-20 h-20 bg-green-500/10 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-blue-500/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-purple-500/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-40 right-10 w-28 h-28 bg-yellow-500/10 rounded-full blur-xl"></div>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="w-full px-8 lg:px-16 xl:px-24 text-center z-10 space-y-12"
      >
        <motion.h1
          variants={fadeInUp}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-8 bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 text-transparent bg-clip-text tracking-tight"
        >
          Academic Excellence
        </motion.h1>

        {/* Education Overview */}
        <motion.div variants={fadeInUp} className="mb-12">
          <div className="bg-gray-900/60 backdrop-blur-xl p-8 rounded-3xl border border-gray-700/50 shadow-2xl">
            <div className="flex items-center justify-center gap-3 mb-6">
              <GraduationCap className="h-12 w-12 text-blue-400" />
              <div className="text-left">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-100">Conestoga College</h2>
                <p className="text-blue-400 text-lg">Computer Programming & Analysis</p>
                <p className="text-gray-400">Advanced Diploma • Co-op Program</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="text-center p-4 bg-green-500/10 border border-green-500/20 rounded-2xl">
                <div className="text-2xl font-bold text-green-400">3.99</div>
                <div className="text-sm text-green-300">GPA</div>
              </div>
              <div className="text-center p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
                <div className="text-2xl font-bold text-blue-400">2024-2027</div>
                <div className="text-sm text-blue-300">Duration</div>
              </div>
              <div className="text-center p-4 bg-purple-500/10 border border-purple-500/20 rounded-2xl">
                <div className="text-2xl font-bold text-purple-400">4/10</div>
                <div className="text-sm text-purple-300">Semesters</div>
              </div>
              <div className="text-center p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl">
                <div className="text-2xl font-bold text-orange-400">Co-op</div>
                <div className="text-sm text-orange-300">Ready</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Key Achievements */}
          <motion.div variants={fadeInUp} className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 mb-8 flex items-center justify-center gap-3">
              <Award className="h-8 w-8 text-yellow-400" />
              Key Achievements
            </h2>
            
            <div className="flex flex-wrap justify-between gap-8">
              {[
                { emoji: "🏆", title: "Dean's Honor List", desc: "All Semesters", color: "from-yellow-500 to-orange-500" },
                { emoji: "🌐", title: "GDG Member", desc: "Google Developer", color: "from-blue-500 to-cyan-500" },
                { emoji: "👥", title: "Peer Mentoring", desc: "Review Sesssions", color: "from-green-500 to-emerald-500" },
                { emoji: "💼", title: "Co-op Ready", desc: "Industry Prepared", color: "from-purple-500 to-pink-500" }
              ].map((achievement, index) => (
                <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 group hover:-translate-y-2 flex-1 min-w-[200px]"
                >
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${achievement.color} flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}>
              <span className="text-2xl">{achievement.emoji}</span>
            </div>
            <h3 className="text-lg font-bold text-gray-100 mb-2">{achievement.title}</h3>
            <p className="text-gray-400 text-sm">{achievement.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Professional Certifications */}
        <motion.div variants={fadeInUp} className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 mb-8 flex items-center justify-center gap-3">
            <BookOpen className="h-8 w-8 text-blue-400" />
            Professional Certifications
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {Certificates.map((cert, index) => (
              <motion.a
                key={cert.id}
                href={cert.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 group hover:-translate-y-2 block"
              >
                <h3 className="text-lg font-bold text-blue-400 mb-3 group-hover:text-blue-300 transition-colors">
                  {cert.title}
                </h3>
                <p className="text-gray-300 hover:text-blue-400 transition-colors text-sm block mb-4">
                  {cert.issuer} • {cert.date}
                </p>
                <div className="flex flex-wrap gap-2">
                  {cert.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs border border-blue-500/30"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Current Learning */}
        <motion.div variants={fadeInUp} className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 mb-8 flex items-center justify-center gap-3">
            <TrendingUp className="h-8 w-8 text-yellow-400" />
            Currently Learning
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {inProgress.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50 hover:border-yellow-500/50 transition-all duration-300 group hover:-translate-y-2"
              >
                <h3 className="text-lg font-bold text-yellow-400 mb-3 group-hover:text-yellow-300 transition-colors">
                  {item.title}
                </h3>
                <a
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-yellow-400 transition-colors text-sm block mb-4"
                >
                  {item.source}
                </a>
                <div className="relative">
                  <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                    <div
                      className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: item.progress }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">{item.progress}</span>
                    <span className="text-xs px-2 py-1 bg-gray-700/80 rounded-full text-gray-300">
                      {item.sourcePlatform}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Technical Skills */}
        <motion.div variants={fadeInUp}>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 mb-8">
            Technical Expertise
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {Skills.map((skillset, index) => (
              <motion.div
                key={skillset.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 group hover:-translate-y-2"
              >
                <h3 className="text-lg font-bold text-gray-100 mb-4 group-hover:text-blue-400 transition-colors">
                  {skillset.title}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skillset.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`px-3 py-1 ${skillset.color} rounded-full text-xs text-white transition-all duration-300 hover:scale-105`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default SkillsPage;
