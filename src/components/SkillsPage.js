import { Skills, Certificates, inProgress } from "./data";
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
        Professional Experience & Achievements 🚀
      </motion.h1>

      {/* Education Section */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="space-y-12"
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-100 to-gray-300 text-transparent bg-clip-text">
            Academic Journey
          </h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span className="text-sm text-gray-300">Current</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-gray-600 mr-2"></div>
              <span className="text-sm text-gray-300">Upcoming</span>
            </div>
          </div>
        </div>

        {/* School Info Card - Enhanced styling */}
        <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-lg p-6 rounded-2xl border border-gray-700/50 shadow-xl hover:border-blue-500/30 transition-all duration-300">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold text-gray-100">
                Computer Programming and Analysis
              </h3>
              <p className="text-blue-400">Conestoga College | Co-op Track</p>
            </div>
            <div className="text-right">
              <p className="text-green-400 font-semibold">3.99 GPA</p>
              <p className="text-gray-400 text-sm">2024 - 2027</p>
            </div>
          </div>
        </div>

        {/* Timeline - Enhanced with smoother animations */}
        <div className="relative mt-16">
          <div className="absolute h-1 bg-gray-600 top-4 left-0 right-0 transform -translate-y-1/2 rounded-full"></div>
          <div className="absolute h-1 bg-gradient-to-r from-blue-500 to-purple-500 top-4 left-0 right-2/3 transform -translate-y-1/2 rounded-full"></div>

          <div className="relative grid grid-cols-10 gap-0">
            {[
              {
                phase: "Sem 1",
                date: "W24",
                done: true,
                current: false,
                skills: ["C# Basics", "HTML/CSS", "UX/UI"],
              },
              {
                phase: "Sem 2",
                date: "S24",
                done: true,
                current: false,
                skills: ["OOP Concepts", "JS/Express", "Windows Forms"],
              },
              {
                phase: "Sem 3",
                date: "F24",
                done: true,
                current: false,
                skills: ["ASP.Net", "Agile", "MySQL"],
              },
              {
                phase: "Sem 4",
                date: "W25",
                done: true,
                current: true,
                skills: [
                  "Mobile Development",
                  "Java Servlet",
                  "Quality Assurance",
                ],
              },
              {
                phase: "Co-op 1",
                date: "S25",
                done: false,
                skills: ["Open to Work"],
              },
              {
                phase: "Co-op 2",
                date: "F25",
                done: false,
                skills: ["Open to Work"],
              },
              {
                phase: "Co-op 3",
                date: "W26",
                done: false,
                skills: ["Open to Work"],
              },
              {
                phase: "Co-op 4",
                date: "S26",
                done: false,
                skills: ["Open to Work"],
              },
              {
                phase: "Sem 5",
                date: "F26",
                done: false,
                skills: ["Comming soon..."],
              },
              {
                phase: "Sem 6",
                date: "W27",
                done: false,
                skills: ["Comming soon..."],
              },
            ].map((item, index) => (
              <div
                key={index}
                className="relative flex flex-col items-center p-2"
              >
                <div
                  className={`w-5 h-5 rounded-full z-10 mb-4 ${
                    item.current
                      ? "bg-green-500 ring-4 ring-green-500/20"
                      : item.done
                      ? "bg-blue-500"
                      : "bg-gray-600"
                  }`}
                ></div>
                <div className="text-center">
                  <p
                    className={`font-medium ${
                      item.current
                        ? "text-green-400"
                        : item.done
                        ? "text-blue-400"
                        : "text-gray-400"
                    }`}
                  >
                    {item.phase}
                  </p>
                  <p className="text-sm text-gray-500">{item.date}</p>
                  <ul className="mt-2 space-y-1 text-xs text-gray-300">
                    {item.skills.map((skill, i) => (
                      <li key={i}>• {skill}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievement Cards - Improved layout */}
        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {[
            {
              title: "Google Developer Group",
              desc: "Active Member",
              icon: "🌐",
            },
            { title: "3.99 GPA", desc: "All Semesters", icon: "🎓" },
            {
              title: "Peer Review Sessions",
              desc: "Study Sessions",
              icon: "👥",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="bg-gray-800/80 p-4 rounded-lg border border-gray-700 hover:border-blue-500/50 transition-all duration-300"
            >
              <div className="flex justify-center items-center space-x-3">
                <div className="text-2xl">{item.icon}</div>
                <div>
                  <h3 className="font-bold text-gray-100">{item.title}</h3>
                  <p className="text-sm text-gray-400">{item.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Certificates Section */}
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
