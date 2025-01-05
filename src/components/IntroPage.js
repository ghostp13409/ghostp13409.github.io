import { Code, Coffee, DatabaseZap, Languages, Wrench } from "lucide-react";
import { motion } from "framer-motion";

const IntroPage = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <section id="intro" className="min-h-screen p-6  mx-auto">
      <motion.h1 
        {...fadeInUp}
        className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text tracking-tight"
      >
        Welcome! 👋
      </motion.h1>

      <motion.div 
        {...fadeInUp}
        className="bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl shadow-2xl border border-gray-700 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-gray-600"
      >
        <p className="text-xl text-gray-200 mb-6 leading-relaxed">
          Hey, I'm Parth! I build cool stuff. Here's a quick rundown of what I can do for you, so you don't have to go look any further.
        </p>
        <div className="flex gap-6">
          <div className="flex items-center gap-3 text-gray-300 hover:text-blue-400 transition-colors">
            <Code className="h-6 w-6" />
            <span className="text-lg">3+ years of coding</span>
          </div>
          <div className="flex items-center gap-3 text-gray-300 hover:text-purple-400 transition-colors">
            <Coffee className="h-6 w-6" />
            <span className="text-lg">∞ cups of coffee</span>
          </div>
        </div>
      </motion.div>

      <motion.h2 
        {...fadeInUp}
        className="text-3xl font-bold mb-8 mt-12 text-gray-100"
      >
        What can I do for you?
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Services cards with enhanced styling */}
        {[
          { title: "Web Development", desc: "I can build you a website that looks great and works even better!" },
          { title: "Software Engineering", desc: "I can build you a software that solves your problems" },
          { title: "Database Management", desc: "I can manage your database and make sure it's secure and efficient" },
          { title: "Testing & Quality Assurance", desc: "I can test your software and make sure no bug goes unnoticed!" }
        ].map((service, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className="bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-700 group hover:bg-gray-700/50 transition-all duration-300"
          >
            <h3 className="text-xl font-bold mb-3 text-gray-100 group-hover:text-blue-400 transition-colors">{service.title}</h3>
            <p className="text-gray-300 text-base">{service.desc}</p>
          </motion.div>
        ))}
      </div>

      <motion.h2 
        {...fadeInUp}
        className="text-3xl font-bold mb-8 mt-12 text-gray-100"
      >
        Technical Expertise
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div 
          {...fadeInUp}
          className="bg-gradient-to-br from-cyan-900/90 to-blue-900/90 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-700 hover:scale-105 transition-all duration-300"
        >
          <Languages className="m-auto mb-4 h-10 w-10 text-blue-400" />
          <h2 className="text-xl font-bold mb-4 text-center">Languages</h2>
          <p className="text-gray-200 text-lg leading-relaxed">
          Java, Python, JavaScript, C#, React, ASP.Net, SQL, NoSQL
You Name it,
I got it...
          </p>
        </motion.div>

        <motion.div 
          {...fadeInUp}
          className="bg-gradient-to-br from-violet-900/90 to-fuchsia-900/90 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-700 hover:scale-105 transition-all duration-300"
        >
          <DatabaseZap className="m-auto mb-4 h-10 w-10 text-purple-400" />
          <h2 className="text-xl font-bold mb-4 text-center">Frameworks</h2>
          <p className="text-gray-200 text-lg leading-relaxed">
          React, ASP.Net, Node.js, Express, MySQL, EJS, Bootstrap, Tailwind
          <br />All that cool Stuff...
          </p>
        </motion.div>

        <motion.div 
          {...fadeInUp}
          className="bg-gradient-to-br from-sky-900/90 to-indigo-900/90 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-700 hover:scale-105 transition-all duration-300"
        >
          <Wrench className="m-auto mb-4 h-10 w-10 text-sky-400" />
          <h3 className="text-xl font-bold mb-4 text-center">Tools</h3>
          <p className="text-gray-200 text-lg leading-relaxed">
            Git, VS Code, JetBrains Suite, Docker, Slack <br />And I can master even more in just a few days of training!
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default IntroPage;
