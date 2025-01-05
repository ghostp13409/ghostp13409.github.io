import { Skills, Certificates, inProgress } from "./data";

const SkillsPage = () => {
  return (
    <section id="skills" className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-10 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
        Here's Some Cool Stuff I Did 👨‍🎓
      </h1>


      {/* Education Section */}
      <div className="grid grid grid-cols-[repeat(auto-fill,_minmax(600px,_1fr))] gap-6 mt-6">
        {/* College | Certificates */}
        <div className="">
          <h2 className="text-3xl font-bold mb-8 text-gray-300">Education</h2>
          <div className="bg-gray-800 p-6 rounded-lg mb-6 mt-6 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <h3 className="text-xl font-bold mb-2">
              Computer Programming and Analysis (Co-Op Track)
            </h3>
            <p className="text-gray-400">Conestoga College</p>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg  transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <h3 className="text-xl font-bold">
                Google Developer Group Member
              </h3>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg  transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <h3 className="text-xl font-bold">
                3.99 <br /> GPA
              </h3>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg  transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <h3 className="text-xl font-bold">Peer Review Sessions</h3>
            </div>
          </div>
        </div>
        <div className="">
          <h2 className="text-3xl font-bold mb-8 text-gray-300">
            Certificates
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {Certificates.map((cert) => (
              <a
                href={cert.link}
                key={cert.id}
                className={`bg-gray-800 p-4 rounded-lg transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
              >
                <h4 className="font-bold">{cert.title}</h4>
                <p className="text-gray-400">
                  {cert.date} | {cert.issuer}
                </p>
                <div className="flex gap-4 justify-center mt-4">
                  {cert.skills.map((skill) => (
                    <span
                      key={skill}
                      className={`px-3 py-1 bg-gray-700 rounded-full text-s transform transition-transform duration-300 hover:scale-110`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* In Progress Section */}
      <h2 className="text-3xl font-bold mb-8 mt-8 text-gray-300">Currently Learning</h2>
      <div className="grid grid-cols-[repeat(auto-fill,_minmax(300px,_1fr))] gap-6 mb-8">
        {inProgress.map((item) => (
          <div
            key={item.id}
            className="group relative p-[1px] bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="bg-gray-800 p-6 rounded-lg h-full backdrop-blur-sm">
              <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                {item.title}
              </h3>
              <a 
                href={item.sourceUrl}
                target="_blank"
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-gray-300 transition-colors mb-4 block"
              >
                {item.source}
              </a>
              <div className="relative pt-1">
                <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-700">
                  <div
                    style={{ width: item.progress }}
                    className="transition-all duration-500 shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-yellow-500 to-orange-500"
                  ></div>
                </div>
                <span className="text-sm text-gray-400 mt-1">{item.progress}</span>
              </div>
              <span className="absolute top-2 right-2 text-xs px-2 py-1 bg-gray-700 rounded-full text-gray-400">
                {item.sourcePlatform}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Skills Section */}
      <h2 className="text-3xl font-bold mb-8 mt-8 text-gray-300">Skills</h2>

      {/* Skills Map */}
      <div className="grid grid-cols-[repeat(auto-fill,_minmax(250px,_1fr))] gap-6">
        {Skills.map((skillset) => (
          <div
            key={skillset.id}
            className="group relative p-[1px] bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="bg-gray-800 p-6 rounded-lg h-full backdrop-blur-sm">
              <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{skillset.title}</h3>
              <div className="flex flex-wrap gap-2">
                {skillset.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`px-3 py-1 ${skillset.color} rounded-full text-s transform transition-all duration-300 hover:scale-110 hover:shadow-lg`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

        

    </section>
  );
};

export default SkillsPage;
