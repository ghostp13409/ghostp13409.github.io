import emailjs from "@emailjs/browser";
import { useState } from "react";
import {
  ArrowLeftIcon,
  Loader,
  Mail,
  MessageCircle,
  Heart,
} from "lucide-react";
import { Hobbies } from "../data/data";
import { motion } from "framer-motion";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState({
    loading: false,
    error: null,
    success: false,
  });
  const [clickCount, setClickCount] = useState(0);

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeOut" },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const handleHeadingClick = () => {
    setClickCount((prev) => prev + 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: null, success: false });

    try {
      await emailjs.send(
        "service_ztr49n8", // Service ID
        "template_3rwyio7", // Template ID
        {
          from_name: formData.name,
          reply_to: formData.email,
          message: formData.message,
        },
        "2bJXuP1jEJgdkF9cc" // EmailJS public key
      );

      setStatus({ loading: false, error: null, success: true });
      setFormData({ name: "", email: "", message: "" });

      // Reset success message after 5 seconds
      setTimeout(() => {
        setStatus((prev) => ({ ...prev, success: false }));
      }, 5000);
    } catch (error) {
      setStatus({
        loading: false,
        error: "Failed to send message. Please try again.",
        success: false,
      });
    }
  };

  return (
    <section
      id="hire"
      className="min-h-screen flex flex-col justify-center items-center p-6 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-40 right-10 w-28 h-28 bg-pink-500/10 rounded-full blur-xl"></div>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="w-full px-8 lg:px-16 xl:px-24 text-center z-10 space-y-12"
      >
        {/* Header with click interaction */}
        <motion.div variants={fadeInUp} className="mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <h1
              className="text-5xl sm:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 text-transparent bg-clip-text cursor-pointer tracking-tight"
              onClick={handleHeadingClick}
            >
              Let's Work Together
            </h1>
            {clickCount === 0 && (
              <span className="text-sm text-gray-400 flex items-center gap-2 animate-pulse">
                <ArrowLeftIcon className="w-4 h-4" /> click me!
              </span>
            )}
            {clickCount > 0 && clickCount < 5 && (
              <span className="text-sm text-gray-400 animate-pulse">
                x{5 - clickCount}
              </span>
            )}
            {clickCount >= 5 && (
              <span className="text-sm text-green-400 animate-bounce">
                Secret Section Unlocked! 🎉
              </span>
            )}
          </div>
        </motion.div>

        {/* Contact Introduction */}
        <motion.div variants={fadeInUp} className="mb-12">
          <div className="bg-gray-900/60 backdrop-blur-xl p-8 rounded-3xl border border-gray-700/50 shadow-2xl">
            <p className="text-xl sm:text-2xl text-gray-200 leading-relaxed mb-6">
              Got a project in mind? Looking for a{" "}
              <span className="text-blue-400 font-semibold">co-op student</span>
              ? Or just want to chat about tech? I'd love to hear from you! Drop
              me a message and let's build something{" "}
              <span className="text-purple-400 font-semibold">amazing</span>{" "}
              together.
            </p>

            <div className="flex items-center justify-center gap-6 text-gray-400">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                <span className="text-sm">Quick Response</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                <span className="text-sm">Always Open to Chat</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div variants={fadeInUp} className="mb-12">
          <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 mb-8 flex items-center justify-center gap-3">
              <MessageCircle className="h-8 w-8 text-blue-400" />
              Send Me A Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  required
                  className="w-full p-4 bg-gray-700/50 backdrop-blur-sm rounded-xl focus:ring-2 focus:ring-blue-500/50 outline-none transition-all duration-300 border border-gray-600/50 hover:border-blue-500/50 text-gray-100 placeholder-gray-400"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your Email"
                  required
                  className="w-full p-4 bg-gray-700/50 backdrop-blur-sm rounded-xl focus:ring-2 focus:ring-blue-500/50 outline-none transition-all duration-300 border border-gray-600/50 hover:border-blue-500/50 text-gray-100 placeholder-gray-400"
                />
              </div>

              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell me about your project or just say hi!"
                required
                rows={6}
                className="w-full p-4 bg-gray-700/50 backdrop-blur-sm rounded-xl focus:ring-2 focus:ring-blue-500/50 outline-none transition-all duration-300 border border-gray-600/50 hover:border-blue-500/50 text-gray-100 placeholder-gray-400 resize-none"
              />

              <button
                type="submit"
                disabled={status.loading}
                className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 font-semibold text-white shadow-lg hover:shadow-blue-500/25"
              >
                {status.loading ? (
                  <>
                    <Loader className="animate-spin h-5 w-5" />
                    Sending Message...
                  </>
                ) : (
                  <>
                    <Mail className="h-5 w-5" />
                    Send Message
                  </>
                )}
              </button>

              {status.error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-center">
                  {status.error}
                </div>
              )}

              {status.success && (
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-center">
                  Message sent successfully! I'll get back to you soon. 🚀
                </div>
              )}
            </form>
          </div>
        </motion.div>

        {/* Secret Hobbies Section */}
        {clickCount >= 5 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-purple-500/30">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 mb-8 flex items-center justify-center gap-3">
                <Heart className="h-8 w-8 text-purple-400" />
                My Hobbies
              </h2>

              <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-6 mb-8">
                <p className="text-gray-300 leading-relaxed">
                  Congrats! I see you're a curious one, and you have taken
                  enough interest in me to find this section. As a reward,
                  you'll get to know me better by getting to know my hobbies. 🎉
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6">
                {Hobbies.map((hobby, index) => (
                  <motion.div
                    key={hobby.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-700/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-600/50 hover:border-purple-500/50 transition-all duration-300 group hover:-translate-y-2"
                  >
                    <h3 className="text-lg font-bold text-purple-400 mb-3 group-hover:text-purple-300 transition-colors">
                      {hobby.title}
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {hobby.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default ContactPage;
