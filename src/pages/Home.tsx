import { motion } from "framer-motion";
import { ArrowRight, Heart, Sparkles, Smile } from "lucide-react";

const Home = () => {
  return (
    <section
      id="intro"
      className="min-h-screen flex flex-col justify-center px-8 sm:px-16 lg:px-32 py-32 relative overflow-hidden"
    >
      {/* Playful Floating Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div
          animate={{ x: [0, 20, 0], y: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent-peach/20 rounded-full blur-[80px]"
        />
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, 20, 0] }}
          transition={{ duration: 12, repeat: Infinity, delay: 1 }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-mint/20 rounded-full blur-[100px]"
        />
      </div>

      <div className="max-w-4xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="p-2.5 rounded-2xl bg-white shadow-sm border border-black/5">
            <Smile className="w-5 h-5 text-accent-peach" />
          </div>
          <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">
            Hello, I'm Parth!{" "}
            <span className="text-accent-peach/40">Welcome to my world.</span>
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 20,
            delay: 0.1,
          }}
          className="text-6xl md:text-8xl font-black mb-10 leading-[0.9] text-text-main tracking-tighter italic uppercase"
        >
          I build <br />
          things with <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-peach to-accent-sky">
            code
          </span>{" "}
          & heart<span className="text-accent-peach/40">.</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 20,
            delay: 0.2,
          }}
          className="space-y-12"
        >
          <div className="max-w-2xl">
            <p className="text-2xl md:text-3xl text-text-main/70 leading-relaxed font-medium italic">
              Currently a student at{" "}
              <span className="text-text-main font-black border-b-2 border-accent-mint/40">
                Conestoga College
              </span>
              . I'm passionate about turning complex problems into friendly,
              human-centric software.
            </p>

            <div className="mt-12 flex flex-wrap gap-6">
              <button
                onClick={() =>
                  document
                    .getElementById("hire")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="pill-button flex items-center gap-2 group"
              >
                Let's Start a Chat{" "}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() =>
                  document
                    .getElementById("journey")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="px-8 py-4 rounded-full border-2 border-black/5 font-bold hover:bg-white transition-all flex items-center gap-2 group"
              >
                View My Story{" "}
                <Sparkles className="w-4 h-4 text-accent-sky group-hover:rotate-12 transition-transform" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Home;
