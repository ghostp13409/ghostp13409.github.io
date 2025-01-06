import { Skills, Certificates, inProgress } from "./data";
import { motion } from "framer-motion";

const SkillsPage = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <section id="skills" className="min-h-screen p-6  mx-auto">
      <motion.h1 
        {...fadeInUp}
        className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text tracking-tight"
      >
        Here's Some Cool Stuff I Did 👨‍🎓
      </motion.h1>

      {/* Education Section */}
      <div className="mt-4 mb-12">
        <motion.div {...fadeInUp} className="w-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-100">Academic Journey</h2>
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

          {/* School Info */}
          <div className="bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg border border-gray-700 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-100">Computer Programming and Analysis</h3>
                <p className="text-blue-400">Conestoga College | Co-op Track</p>
              </div>
              <div className="text-right">
                <p className="text-green-400 font-semibold">3.99 GPA</p>
                <p className="text-gray-400 text-sm">2024 - 2027</p>
              </div>
            </div>
          </div>

          {/* Horizontal Timeline */}
          <div className="relative">
            {/* Timeline Data */}
            <div className="absolute h-1 bg-gray-600 top-4 left-0 right-0 transform -translate-y-1/2 rounded-full"></div>
            <div className="absolute h-1 bg-gradient-to-r from-blue-500 to-purple-500 top-4 left-0 right-2/3 transform -translate-y-1/2 rounded-full"></div>

            <div className="relative grid grid-cols-10 gap-0">
              {[
                { phase: "Sem 1", date: "W24", done: true, current: false, skills: ["C# Basics", "HTML/CSS", "UX/UI"] },
                { phase: "Sem 2", date: "S24", done: true, current: false, skills: ["OOP Concepts", "JS/Express", "Windows Forms"] },
                { phase: "Sem 3", date: "F24", done: true, current: false, skills: ["ASP.Net", "Agile", "MySQL"] },
                { phase: "Sem 4", date: "W25", done: true, current: true, skills: ["Mobile Development", "Java Servlet", "Quality Assurance"] },
                { phase: "Co-op 1", date: "S25", done: false, skills: ["Open to Work"] },
                { phase: "Co-op 2", date: "F25", done: false, skills: ["Open to Work"] },
                { phase: "Co-op 3", date: "W26", done: false, skills: ["Open to Work"] },
                { phase: "Co-op 4", date: "S26", done: false, skills: ["Open to Work"] },
                { phase: "Sem 5", date: "F26", done: false, skills: ["Comming soon..."] },
                { phase: "Sem 6", date: "W27", done: false, skills: ["Comming soon..."] }
              ].map((item, index) => (
                <div key={index} className="relative flex flex-col items-center p-2">
                  {/* Timeline Node */}
                  <div
                    className={`w-5 h-5 rounded-full z-10 mb-4 ${
                      item.current
                        ? 'bg-green-500 ring-4 ring-green-500/20'
                        : item.done ? 'bg-blue-500' : 'bg-gray-600'
                    }`}
                  ></div>
                  {/* Text and Skills */}
                  <div className="text-center">
                    <p className={`font-medium ${
                      item.current ? 'text-green-400' : item.done ? 'text-blue-400' : 'text-gray-400'
                    }`}>
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

          {/* Achievement Cards */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            {[
              { title: "Google Developer Group", desc: "Active Member", icon: "🌐" },
              { title: "3.99 GPA", desc: "All Semesters", icon: "🎓" },
              { title: "Peer Review Sessions", desc: "Study Sessions", icon: "👥" }
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
          </div>
        </motion.div>
      </div>

      {/* Certificates Section */}
      <motion.div {...fadeInUp} className="w-full mt-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-100">Professional Certifications</h2>
        <div className="grid grid-cols-3 gap-4">
          {Certificates.map((cert, index) => (
            <motion.a
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              href={cert.link}
              key={cert.id}
              className="group relative p-[1px] bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl overflow-hidden"
            >
              <div className="bg-gray-800/90 backdrop-blur-sm p-6 rounded-xl transition-all duration-300 hover:bg-gray-700/80">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xl font-bold text-gray-100 mb-2">{cert.title}</h4>
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
        </div>
      </motion.div>

      {/* In Progress Section */}
      <motion.h2 
        {...fadeInUp}
        className="text-3xl font-bold mb-8 mt-12 text-gray-100"
      >
        Currently Learning
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
      </div>

      {/* Skills Section */}
      <motion.h2 
        {...fadeInUp}
        className="text-3xl font-bold mb-8 mt-12 text-gray-100"
      >
        Skills
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Skills.map((skillset, index) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            key={skillset.id}
            className="group relative p-[1px] bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl overflow-hidden"
          >
            <div className="bg-gray-800/90 backdrop-blur-sm p-5 rounded-xl h-full transition-all duration-300 hover:bg-gray-700/80">
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
      </div>
    </section>
  );
};

export default SkillsPage;
