import { Code, Coffee, DatabaseZap, Languages, Wrench } from "lucide-react";
const IntroPage = () => {
  return (
    <section id="intro" className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-10 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
        Welcome! 👋
      </h1>
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700 relative overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <p className="text-xl text-gray-300 mb-6">
          I'm Parth. I'm a developer and I build stuff! Here's some of the
          things I can do for you in summary, so you don't have to look for
          things
        </p>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 text-gray-400">
            <Code size={20} />
            <span>1000+ days of code</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Coffee size={20} />
            <span>∞ cups of coffee</span>
          </div>
        </div>
      </div>

      {/* Services Section */}

      <h2 className="text-3xl font-bold mb-8 mt-5 text-gray-300">
        What can I do for you?
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 relative overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <h3 className="text-2xl font-bold mb-4">Web Development</h3>
          <p className="text-gray-300">
            I can build you a website that looks great and works even better!
          </p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 relative overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <h3 className="text-2xl font-bold mb-4">Software Engineering</h3>
          <p className="text-gray-300">
            I can build you a software that solves your problems
          </p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 relative overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <h3 className="text-2xl font-bold mb-4">Database Management</h3>
          <p className="text-gray-300">
            I can manage your database and make sure it's secure and efficient
          </p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 relative overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <h3 className="text-2xl font-bold mb-4">Testing</h3>
          <p className="text-gray-300">
            I can test your software and make sure no bug goes unnoticed!
          </p>
        </div>
      </div>

      {/* SKills */}
      <h2 className="text-3xl font-bold mb-8 mt-5 text-gray-300">
        What do I know?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-cyan-800 to-blue-800 p-6 rounded-lg shadow-lg border border-gray-700 relative overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <Languages className="m-auto mb-4 h-10 w-10" />
          <h2 className="text-xl font-bold mb-4"> </h2>
          <p className="text-gray-300 font-bold text-l mb-8 mt-5 ">
            Java, Python, JavaScript, C#, React, ASP.Net, SQL, NoSQL <br /> You
            Name it, <br /> I got it...
          </p>
        </div>
        <div className="bg-gradient-to-r from-violet-800 to-fuchsia-800 p-6 rounded-lg shadow-lg border border-gray-700 relative overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <DatabaseZap className="m-auto mb-4 h-10 w-10" />
          <h2 className="text-xl font-bold mb-4">Frameworks and stuff</h2>
          <p className="text-gray-300 font-bold text-l mb-8 mt-5">
              HTML, CSS, Bootstrap, Tailwind, React, ASP.Net, Entity Framework,
              Node.js, Express, MongoDB, MySQL, EJS, WordPress, LINQ
              <br /> All that cool Stuff...
          </p>
        </div>
        <div className="bg-gradient-to-r from-sky-800 to-indigo-800 p-6 rounded-lg shadow-lg border border-gray-700 relative overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <Wrench className="m-auto mb-4 h-10 w-10" />
          <h3 className="text-xl font-bold mb-4">Tools</h3>
          <p className="text-gray-300 font-bold text-l mb-8 mt-5">
            Git, GitHub, VS Code, JetBrains, Eclipse, Visual Studio, Postman,
            Figma, Trello, Slack
            <br /> and you can add more in just few days of training...
          </p>
        </div>
      </div>
    </section>
  );
};

export default IntroPage;
