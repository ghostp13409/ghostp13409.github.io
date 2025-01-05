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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
        <motion.div {...fadeInUp}>
          <h2 className="text-3xl font-bold mb-6 text-gray-100">Education</h2>
          <motion.div 
            {...fadeInUp}
            className="bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-700 mb-6 transition-all duration-300 hover:bg-gray-700/50"
          >
            <h3 className="text-xl font-bold mb-2 text-gray-100">
              Computer Programming and Analysis (Co-Op Track)
            </h3>
            <p className="text-gray-300 text-base">Conestoga College</p>
          </motion.div>
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { title: "Google Developer Group Member" },
              { title: "3.99 GPA" },
              { title: "Peer Review Sessions" }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-gray-800/80 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-700 transition-all duration-300 hover:bg-gray-700/50"
              >
                <h3 className="text-base font-bold text-gray-100">{item.title}</h3>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div {...fadeInUp}>
          <h2 className="text-3xl font-bold mb-6 text-gray-100">Certificates</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Certificates.map((cert, index) => (
              <motion.a
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                href={cert.link}
                key={cert.id}
                className="bg-gray-800/80 backdrop-blur-sm p-5 rounded-xl shadow-lg border border-gray-700 transition-all duration-300 hover:bg-gray-700/50 hover:-translate-y-1"
              >
                <h4 className="text-lg font-bold text-gray-100 mb-2">{cert.title}</h4>
                <p className="text-gray-400 mb-4">
                  {cert.date} | {cert.issuer}
                </p>
                <div className="flex flex-wrap gap-2">
                  {cert.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 bg-gray-700/50 rounded-full text-sm text-gray-300 transition-all duration-300 hover:bg-gray-600/50"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>

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
