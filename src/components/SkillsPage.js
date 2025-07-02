import { Skills, Certificates, inProgress, education } from "./data";
import { motion } from "framer-motion";

const SkillsPage = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <section id="skills" className="min-h-screen py-16 px-6 mx-auto space-y-24">
      <motion.h1
        {...fadeInUp}
        className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text tracking-tight"
      >
        Academic Experience & Achievements 🚀
      </motion.h1>

      {/* Education Section - Clean & Simple */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="space-y-12"
      >
        <div className="text-center">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-100 to-gray-300 text-transparent bg-clip-text">
          Education
        </h2>
        </div>

        {/* Main Education Card - Optimized Layout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-blue-500/30 transition-all duration-300"
        >
          <div className="grid lg:grid-cols-3 gap-8">
            {/* School Info */}
            <div className="lg:col-span-1 space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">CC</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Conestoga College</h3>
                  <p className="text-blue-400">Ontario, Canada</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-xl font-semibold text-gray-100 mb-2">
                  Computer Programming and Analysis
                </h4>
                <p className="text-gray-300">Advanced Diploma • Co-op Program</p>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-2 gap-3 mt-6">
                <div className="text-center p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
                  <div className="text-xl font-bold text-green-400">3.99</div>
                  <div className="text-xs text-green-300">GPA</div>
                </div>
                <div className="text-center p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                  <div className="text-xl font-bold text-blue-400">2024-2027</div>
                  <div className="text-xs text-blue-300">Duration</div>
                </div>
                <div className="text-center p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                  <div className="text-xl font-bold text-purple-400">Work Term 2</div>
                  <div className="text-xs text-purple-300">Current Term</div>
                </div>
                <div className="text-center p-3 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                  <div className="text-xl font-bold text-orange-400">4</div>
                  <div className="text-xs text-orange-300">Co-op Terms</div>
                </div>
              </div>
            </div>

            {/* Key Achievements */}
            <div className="lg:col-span-2">
              <h3 className="text-xl font-bold text-gray-100 mb-6">Key Achievements</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-800/50 border border-gray-700 rounded-xl hover:border-yellow-500/30 transition-all duration-300">
                  <div className="text-3xl mb-3">🏆</div>
                  <div className="text-sm font-medium text-yellow-400">Dean's Honor List</div>
                  <div className="text-xs text-gray-500 mt-1">All Semesters</div>
                </div>
                <div className="text-center p-4 bg-gray-800/50 border border-gray-700 rounded-xl hover:border-blue-500/30 transition-all duration-300">
                  <div className="text-3xl mb-3">🌐</div>
                  <div className="text-sm font-medium text-blue-400">GDG Club Member</div>
                  <div className="text-xs text-gray-500 mt-1">Community</div>
                </div>
                <div className="text-center p-4 bg-gray-800/50 border border-gray-700 rounded-xl hover:border-green-500/30 transition-all duration-300">
                  <div className="text-3xl mb-3">👥</div>
                  <div className="text-sm font-medium text-green-400">Study Group Leader</div>
                  <div className="text-xs text-gray-500 mt-1">Peer Mentoring</div>
                </div>
                <div className="text-center p-4 bg-gray-800/50 border border-gray-700 rounded-xl hover:border-purple-500/30 transition-all duration-300">
                  <div className="text-3xl mb-3">💼</div>
                  <div className="text-sm font-medium text-purple-400">Co-op Ready</div>
                  <div className="text-xs text-gray-500 mt-1">Software Developer/Engineer</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>        
      </motion.div>

      {/* Certificates Section - Enhanced cards */}
      <motion.div {...fadeInUp} className="space-y-12">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-100 to-gray-300 text-transparent bg-clip-text">
          Professional Certifications
        </h2>
        <motion.div
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {Certificates.map((cert, index) => (
            <motion.a
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              href={cert.link}
              key={cert.id}
              className="group relative p-[1px] bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl overflow-hidden shadow-lg hover:shadow-blue-500/20 transition-all duration-500"
            >
              <div className="bg-gray-900/95 backdrop-blur-xl p-6 rounded-xl h-full transition-all duration-300 group-hover:bg-gray-800/90">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xl font-bold text-gray-100 mb-2">
                      {cert.title}
                    </h4>
                    <p className="text-blue-400 mb-4">
                      {cert.issuer} • {cert.date}
                    </p>
                  </div>
                  <div className="text-2xl">🏆</div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {cert.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-blue-500/10 rounded-full text-sm text-blue-300 border border-blue-500/20 transition-all duration-300 hover:border-blue-500/50"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </motion.div>

      {/* In Progress Section - Enhanced progress bars */}
      <motion.div {...fadeInUp} className="space-y-12">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-100 to-gray-300 text-transparent bg-clip-text">
          Current Learning Path
        </h2>
        <motion.div
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {inProgress.map((item, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={item.id}
              className="group relative p-[1px] bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl overflow-hidden"
            >
              <div className="bg-gray-800/90 backdrop-blur-sm p-5 rounded-xl h-full transition-all duration-300 hover:bg-gray-700/80">
                <h3 className="text-lg font-bold mb-3 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  {item.title}
                </h3>
                <a
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-yellow-400 transition-colors mb-4 block"
                >
                  {item.source}
                </a>
                <div className="relative pt-1">
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-700">
                    <div
                      style={{ width: item.progress }}
                      className="transition-all duration-500 shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-yellow-500 to-orange-500"
                    ></div>
                  </div>
                  <span className="text-sm text-gray-400">{item.progress}</span>
                </div>
                <span className="absolute top-3 right-3 text-xs px-2 py-1 bg-gray-700/80 rounded-full text-gray-300">
                  {item.sourcePlatform}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Skills Section - Enhanced skill cards */}
      <motion.div {...fadeInUp} className="space-y-12">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-100 to-gray-300 text-transparent bg-clip-text">
          Technical Expertise
        </h2>
        <motion.div
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {Skills.map((skillset, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={skillset.id}
              className="group relative p-[1px] bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl overflow-hidden shadow-lg hover:shadow-blue-500/20 transition-all duration-500"
            >
              <div className="bg-gray-900/95 backdrop-blur-xl p-6 rounded-xl h-full transition-all duration-300 group-hover:bg-gray-800/90">
                <h3 className="text-lg font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {skillset.title}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skillset.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`px-3 py-1 ${skillset.color} rounded-full text-sm transition-all duration-300 hover:scale-105`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default SkillsPage;
