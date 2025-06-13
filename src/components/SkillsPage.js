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
        Professional Experience & Achievements 🚀
      </motion.h1>

      {/* Education Section - Redesigned */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="space-y-8"
      >


        {/* Main Education Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative bg-gray-900/95 backdrop-blur-xl p-8 rounded-2xl border border-gray-700/50 hover:border-blue-500/30 transition-all duration-500">
            <div className="grid md:grid-cols-3 gap-8 items-center">
              {/* Institution Info */}
              <div className="md:col-span-2 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{education.institution.logo}</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{education.institution.name}</h3>
                    <p className="text-blue-400 font-medium">{education.institution.location}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-xl font-semibold text-gray-100">
                    {education.program.title}
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-300 text-sm">
                      {education.program.type}
                    </span>
                    <span className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-green-300 text-sm">
                      {education.program.status}
                    </span>
                  </div>
                </div>

                <p className="text-gray-300 leading-relaxed">
                  {education.description}
                </p>
              </div>

              {/* Academic Stats */}
              <div className="space-y-6">
                <div className="text-center p-6 bg-gradient-to-br from-green-500/10 to-emerald-600/10 rounded-xl border border-green-500/20">
                  <div className="text-3xl font-bold text-green-400">{education.program.gpa}</div>
                  <div className="text-green-300 font-medium">Cumulative GPA</div>
                  <div className="text-sm text-gray-400 mt-1">Outstanding Academic Performance</div>
                </div>
                
                <div className="text-center p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
                  <div className="text-xl font-bold text-blue-400">{education.program.duration}</div>
                  <div className="text-gray-300 text-sm">Expected Graduation</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-blue-400">{education.progressStats.completedSemesters}</div>
            <div className="text-blue-300 font-medium">Semesters Completed</div>
            <div className="text-sm text-gray-400 mt-1">Out of {education.progressStats.totalSemesters} total</div>
          </div>
          
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-green-400">{education.progressStats.completedPercentage}%</div>
            <div className="text-green-300 font-medium">Program Progress</div>
            <div className="text-sm text-gray-400 mt-1">Academic Journey</div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-purple-400">{education.progressStats.totalCoopTerms}</div>
            <div className="text-purple-300 font-medium">Co-op Terms Ahead</div>
            <div className="text-sm text-gray-400 mt-1">Industry Experience</div>
          </div>
        </motion.div>

        {/* Academic Timeline - Compact & Modern Design */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="space-y-8"
        >
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold text-gray-100">Academic Journey</h3>
            <div className="flex items-center justify-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm text-green-400">Completed</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-blue-500 ring-2 ring-blue-500/30"></div>
                <span className="text-sm text-blue-400">Current</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-gray-600"></div>
                <span className="text-sm text-gray-400">Upcoming</span>
              </div>
            </div>
          </div>

          {/* Compact Vertical Timeline */}
          <div className="max-w-5xl mx-auto">
            <div className="relative">
              {/* Vertical Line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-700"></div>
              <div
                className="absolute left-6 top-0 w-0.5 bg-gradient-to-b from-green-500 via-blue-500 to-transparent transition-all duration-1000"
                style={{ height: `${education.program.progressPercentage}%` }}
              ></div>

              <div className="space-y-8">
                {education.timeline.map((semester, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative flex items-start pl-16"
                  >
                    {/* Timeline Dot */}
                    <div className={`absolute left-4 w-5 h-5 rounded-full border-2 border-gray-900 transition-all duration-300 ${
                      semester.status === 'completed'
                        ? 'bg-green-500 shadow-lg shadow-green-500/30'
                        : semester.status === 'current'
                        ? 'bg-blue-500 shadow-lg shadow-blue-500/30 ring-2 ring-blue-500/20'
                        : 'bg-gray-600'
                    }`}></div>

                    {/* Compact Content Card */}
                    <div className={`flex-1 p-6 rounded-xl border transition-all duration-300 hover:scale-[1.02] ${
                      semester.status === 'completed'
                        ? 'bg-green-500/5 border-green-500/20 hover:border-green-500/40'
                        : semester.status === 'current'
                        ? 'bg-blue-500/10 border-blue-500/30 hover:border-blue-500/50'
                        : 'bg-gray-800/50 border-gray-700/50 hover:border-gray-600/50'
                    }`}>
                      <div className="grid md:grid-cols-4 gap-6 items-center">
                        {/* Phase & Period */}
                        <div>
                          <h4 className={`text-lg font-bold mb-1 ${
                            semester.status === 'completed' ? 'text-green-400' :
                            semester.status === 'current' ? 'text-blue-400' : 'text-gray-400'
                          }`}>
                            {semester.phase}
                          </h4>
                          <p className="text-sm text-gray-500">{semester.period}</p>
                          {semester.grade && (
                            <div className={`mt-2 text-sm font-medium ${
                              semester.grade === 'A+' ? 'text-green-400' :
                              semester.grade === 'In Progress' ? 'text-blue-400' : 'text-gray-400'
                            }`}>
                              {semester.grade} {semester.gpa && semester.gpa !== 'N/A' && semester.gpa !== 'TBD' && `(${semester.gpa})`}
                            </div>
                          )}
                        </div>

                        {/* Key Courses */}
                        <div>
                          <h5 className="text-sm font-medium text-gray-400 mb-2">Key Courses</h5>
                          <div className="space-y-1">
                            {semester.courses.slice(0, 2).map((course, i) => (
                              <p key={i} className="text-xs text-gray-300 truncate">{course}</p>
                            ))}
                            {semester.courses.length > 2 && (
                              <p className="text-xs text-gray-500">+{semester.courses.length - 2} more</p>
                            )}
                          </div>
                        </div>

                        {/* Skills */}
                        <div>
                          {semester.keySkills && (
                            <>
                              <h5 className="text-sm font-medium text-gray-400 mb-2">Skills</h5>
                              <div className="flex flex-wrap gap-1">
                                {semester.keySkills.slice(0, 3).map((skill, i) => (
                                  <span key={i} className="px-2 py-1 bg-gray-700/50 rounded-full text-xs text-gray-300 border border-gray-600/50">
                                    {skill}
                                  </span>
                                ))}
                                {semester.keySkills.length > 3 && (
                                  <span className="text-xs text-gray-500">+{semester.keySkills.length - 3}</span>
                                )}
                              </div>
                            </>
                          )}
                        </div>

                        {/* Highlight */}
                        <div>
                          {semester.highlights && semester.highlights.length > 0 && (
                            <div className="p-3 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="text-yellow-400 text-sm">⭐</span>
                                <span className="text-xs font-medium text-yellow-400">Achievement</span>
                              </div>
                              <p className="text-xs text-gray-300">{semester.highlights[0]}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Academic Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          {education.achievements.map((achievement, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`group relative p-4 rounded-xl border bg-${achievement.bgColor} border-${achievement.borderColor} hover:border-opacity-50 transition-all duration-300 hover:scale-105`}
            >
              <div className="text-center space-y-2">
                <div className="text-3xl mb-2">{achievement.icon}</div>
                <h4 className={`font-bold text-sm bg-gradient-to-r ${achievement.color} text-transparent bg-clip-text`}>
                  {achievement.title}
                </h4>
                <p className="text-xs text-gray-400">{achievement.subtitle}</p>
              </div>
            </motion.div>
          ))}
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
