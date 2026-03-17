import { motion } from "framer-motion";

const Home = () => {
  return (
    <section
      id="intro"
      className="min-h-screen flex flex-col justify-center px-8 sm:px-16 lg:px-32 py-32 relative"
    >
      <div className="max-w-3xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <p className="text-sm font-medium text-text-muted mb-6 tracking-wide">
            Software Developer
          </p>

          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight text-text-main tracking-tight">
            Building software with intent and care.
          </h1>

          <p className="text-lg md:text-xl text-text-main/70 leading-relaxed font-medium max-w-xl mb-12">
            I'm Parth Gajjar, focused on creating interfaces that feel as good as they work.
          </p>

          <div className="flex gap-6">
            <button
              onClick={() =>
                document
                  .getElementById("journey")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="text-text-main font-semibold hover:text-accent-peach transition-colors"
            >
              View My Work
            </button>
            <button
              onClick={() =>
                document
                  .getElementById("hire")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="text-text-muted font-medium hover:text-text-main transition-colors"
            >
              Contact Me
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Home;