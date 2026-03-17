import { motion } from "framer-motion";

const Home = () => {
  return (
    <section
      id="intro"
      className="min-h-screen flex flex-col justify-center px-8 sm:px-16 lg:px-32 py-32 relative overflow-hidden"
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-accent-peach/5 blur-3xl rounded-full -z-10 animate-pulse" />
      <div
        className="absolute bottom-1/4 -left-20 w-96 h-96 bg-accent-sky/5 blur-3xl rounded-full -z-10 animate-pulse"
        style={{ animationDelay: "2s" }}
      />

      <div className="max-w-4xl relative z-10 asymmetric-offset">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="flex items-center gap-4 mb-8">
            <span className="w-12 h-px bg-accent-peach" />
            <p className="text-sm font-black text-accent-peach uppercase tracking-[0.3em]">
              Software Developer
            </p>
          </div>

          <h1 className="text-5xl md:text-8xl font-black mb-10 leading-[0.9] text-text-main tracking-tighter uppercase">
            Building software <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-peach via-accent-sky to-accent-mint">
              with intent.
            </span>
          </h1>

          <div className="max-w-xl space-y-12">
            <p className="text-xl md:text-2xl text-text-main/70 leading-tight font-bold uppercase tracking-tight">
              focused on creating interfaces that feel as good as they work.
            </p>

            <div className="flex flex-wrap gap-8 items-center">
              <button
                onClick={() =>
                  document
                    .getElementById("journey")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="pill-button"
              >
                View My Work
              </button>
              <button
                onClick={() =>
                  document
                    .getElementById("hire")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="text-sm font-black uppercase tracking-[0.2em] text-text-muted hover:text-text-main transition-colors flex items-center gap-3 group"
              >
                Contact Me
                <span className="w-8 h-px bg-text-muted group-hover:w-12 group-hover:bg-text-main transition-all" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Home;
