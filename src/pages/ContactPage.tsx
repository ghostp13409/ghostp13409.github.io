import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import {
  Mail,
  ArrowRight,
  Sparkles,
  MessageCircle,
  Coffee,
  Heart,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { hobbies } from "../data/mockdata";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState({
    loading: false,
    error: null as string | null,
    success: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ loading: true, error: null, success: false });

    try {
      await emailjs.send(
        "service_ztr49n8",
        "template_3rwyio7",
        {
          from_name: formData.name,
          reply_to: formData.email,
          message: formData.message,
        },
        "2bJXuP1jEJgdkF9cc",
      );

      setStatus({ loading: false, error: null, success: true });
      setFormData({ name: "", email: "", message: "" });

      setTimeout(() => {
        setStatus((prev) => ({ ...prev, success: false }));
      }, 5000);
    } catch (error) {
      setStatus({
        loading: false,
        error: "Oops! Something went wrong. Please try again.",
        success: false,
      });
    }
  };

  return (
    <section
      id="hire"
      className="px-8 sm:px-16 lg:px-32 py-20 space-y-16 relative overflow-hidden"
    >
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Contact Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="space-y-6 text-center md:text-left"
        >
          <h2 className="text-5xl md:text-7xl font-black text-text-main tracking-tighter leading-[0.9] italic uppercase">
            Let's <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-peach via-accent-sky to-accent-lavender">
              Connect
            </span>
            .
          </h2>
          <p className="text-xl text-text-main/60 font-medium max-w-2xl leading-relaxed mx-auto md:mx-0 italic">
            I’m always open to new opportunities, collaborations, or just a
            friendly chat about life and code.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <form
            onSubmit={handleSubmit}
            className="creative-card rounded-[3rem] p-6 md:p-10 space-y-8 bg-white/80 dark:bg-white/5 border border-black/5 dark:border-white/10 transition-colors duration-700"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2 relative group">
                <label
                  htmlFor="name"
                  className="block text-[9px] font-black text-text-muted uppercase tracking-widest ml-1"
                >
                  Your Name
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-black/[0.03] dark:bg-white/[0.03] border border-transparent dark:border-white/5 rounded-xl px-5 py-3.5 outline-none focus:ring-4 focus:ring-accent-peach/10 transition-all text-text-main font-bold placeholder:text-text-muted/30 text-sm"
                  placeholder="Who are you?"
                />
              </div>

              <div className="flex flex-col gap-2 relative group">
                <label
                  htmlFor="email"
                  className="block text-[9px] font-black text-text-muted uppercase tracking-widest ml-1"
                >
                  Your Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-black/[0.03] dark:bg-white/[0.03] border border-transparent dark:border-white/5 rounded-xl px-5 py-3.5 outline-none focus:ring-4 focus:ring-accent-peach/10 transition-all text-text-main font-bold placeholder:text-text-muted/30 text-sm"
                  placeholder="Where can I reach you?"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 relative group">
              <label
                htmlFor="message"
                className="block text-[9px] font-black text-text-muted uppercase tracking-widest ml-1"
              >
                Your Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
                className="w-full bg-black/[0.03] dark:bg-white/[0.03] border border-transparent dark:border-white/5 rounded-2xl px-5 py-3.5 outline-none focus:ring-4 focus:ring-accent-peach/10 transition-all text-text-main font-medium resize-none placeholder:text-text-muted/30 text-sm"
                placeholder="Tell me about your project or just say hi..."
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button
                type="submit"
                disabled={status.loading}
                className="pill-button flex items-center gap-3 group w-full sm:w-auto justify-center disabled:opacity-50 h-14 min-w-[180px] py-0"
              >
                {status.loading ? "Sending..." : "Send Message"}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <AnimatePresence>
                {status.success && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 text-accent-mint font-black text-xs uppercase tracking-widest"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Message Delivered</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Integrated Info Row */}
            <div className="pt-4 border-t border-black/5 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="flex items-center gap-4 group/item">
                <div className="p-2.5 rounded-xl bg-accent-peach/10 text-accent-peach group-hover/item:scale-110 transition-transform duration-500">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-[8px] font-black text-text-muted uppercase tracking-widest block">
                    Email
                  </span>
                  <a
                    href="mailto:gajjarparth09@gmail.com"
                    className="text-xs font-bold text-text-main hover:text-accent-peach transition-colors"
                  >
                    gajjarparth09@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 group/item">
                <div className="p-2.5 rounded-xl bg-accent-mint/10 text-accent-mint group-hover/item:scale-110 transition-transform duration-500">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-mint animate-pulse" />
                  </div>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[8px] font-black text-text-muted uppercase tracking-widest block">
                    Location
                  </span>
                  <p className="text-xs font-bold text-text-main">
                    Waterloo, Ontario
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Hobbies Section Polished */}
        <div className="pt-32 border-t border-black/5 space-y-16">
          <div className="flex items-center gap-6">
            <div className="p-3 rounded-2xl bg-accent-lavender/10 text-accent-lavender">
              <Heart className="w-6 h-6" fill="currentColor" opacity={0.4} />
            </div>
            <div className="space-y-1">
              <h3 className="text-3xl font-black text-text-main tracking-tight uppercase italic leading-none">
                Hobbies
              </h3>
              <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em]">
                Personal Interests
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hobbies.map((hobby) => (
              <motion.div
                key={hobby.id}
                whileHover={{ y: -8 }}
                className="creative-card p-10 group overflow-hidden relative border border-black/5"
              >
                <div className="absolute -right-6 -bottom-6 text-accent-peach/5 scale-150 rotate-12 group-hover:scale-[2] group-hover:rotate-45 transition-all duration-1000">
                  <Sparkles className="w-24 h-24" />
                </div>
                <h4 className="text-xl font-black text-text-main mb-4 flex items-center gap-3 italic">
                  <span className="w-2 h-2 rounded-full bg-accent-peach shadow-[0_0_10px_rgba(249,115,22,0.1)]" />
                  {hobby.title}
                </h4>
                <p className="text-sm font-medium text-text-main/60 leading-relaxed italic prose-refined">
                  {hobby.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;
