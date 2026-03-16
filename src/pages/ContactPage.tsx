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
          className="space-y-4 text-center md:text-left"
        >
          <h2 className="text-5xl md:text-7xl font-black text-text-main tracking-tight leading-none uppercase">
            Let's <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-peach via-accent-sky to-accent-lavender">
              Connect
            </span>
          </h2>
          <p className="text-lg text-text-main/60 font-bold max-w-2xl leading-relaxed mx-auto md:mx-0 uppercase tracking-tight">
            I’m always open to new opportunities, collaborations, or just a
            friendly chat about code.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <form
            onSubmit={handleSubmit}
            className="creative-card p-8 md:p-12 space-y-8 bg-white/80 dark:bg-white/5 border border-black/5 dark:border-white/10"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-3">
                <label
                  htmlFor="name"
                  className="block text-[10px] font-black text-text-muted uppercase tracking-widest ml-1"
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
                  className="w-full bg-black/[0.03] dark:bg-white/[0.03] border border-black/[0.03] dark:border-white/5 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-accent-peach/10 transition-all text-text-main font-bold placeholder:text-text-muted/30"
                  placeholder="Who are you?"
                />
              </div>

              <div className="flex flex-col gap-3">
                <label
                  htmlFor="email"
                  className="block text-[10px] font-black text-text-muted uppercase tracking-widest ml-1"
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
                  className="w-full bg-black/[0.03] dark:bg-white/[0.03] border border-black/[0.03] dark:border-white/5 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-accent-peach/10 transition-all text-text-main font-bold placeholder:text-text-muted/30"
                  placeholder="Where can I reach you?"
                />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label
                htmlFor="message"
                className="block text-[10px] font-black text-text-muted uppercase tracking-widest ml-1"
              >
                Your Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full bg-black/[0.03] dark:bg-white/[0.03] border border-black/[0.03] dark:border-white/5 rounded-[2rem] px-6 py-4 outline-none focus:ring-4 focus:ring-accent-peach/10 transition-all text-text-main font-bold resize-none placeholder:text-text-muted/30"
                placeholder="Tell me about your project..."
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <button
                type="submit"
                disabled={status.loading}
                className="pill-button flex items-center gap-3 w-full sm:w-auto justify-center disabled:opacity-50 min-w-[200px]"
              >
                {status.loading ? "Sending..." : "Send Message"}
                <ArrowRight className="w-4 h-4" />
              </button>

              <AnimatePresence>
                {status.success && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 text-accent-mint font-black text-[10px] uppercase tracking-widest"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Message Delivered</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </form>
        </div>

        {/* Hobbies Section Simplified */}
        <div className="pt-32 border-t border-black/5 space-y-16">
          <div className="flex items-center gap-4">
             <div className="p-3 rounded-2xl bg-accent-lavender/10 text-accent-lavender">
              <Coffee className="w-5 h-5" />
            </div>
            <h3 className="text-3xl font-black text-text-main tracking-tight uppercase">
              Personal Interests
            </h3>
            <div className="h-px flex-1 bg-black/[0.05]"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hobbies.map((hobby) => (
              <motion.div
                key={hobby.id}
                whileHover={{ y: -4 }}
                className="creative-card p-8 border border-black/5"
              >
                <h4 className="text-xl font-black text-text-main mb-3 uppercase tracking-tight">
                  {hobby.title}
                </h4>
                <p className="text-sm font-medium text-text-main/60 leading-relaxed">
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
