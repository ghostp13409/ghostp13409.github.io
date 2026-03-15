import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import {
  Mail,
  ArrowRight,
  Sparkles,
  MessageCircle,
  Coffee,
  Heart
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        "2bJXuP1jEJgdkF9cc"
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
    <section id="hire" className="px-8 sm:px-16 lg:px-32 py-32 space-y-24 relative overflow-hidden">
      <div className="max-w-6xl mx-auto space-y-20">
        {/* Contact Header Polished */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="space-y-8 text-center md:text-left"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-black/5">
            <MessageCircle className="w-4 h-4 text-accent-peach" />
            <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em]">Let's chat</span>
          </div>
          <h2 className="text-6xl md:text-8xl font-black text-text-main tracking-tighter leading-[0.9] italic uppercase">
            Start a <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-peach via-accent-sky to-accent-lavender">Conversation</span>.
          </h2>
          <p className="text-2xl text-text-main/60 font-medium max-w-2xl leading-relaxed mx-auto md:mx-0 italic">
            I’m always open to new opportunities, collaborations, or just a friendly chat about life and code.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Info Side */}
          <div className="lg:col-span-4 space-y-8">
            <div className="creative-card p-10 space-y-10 border border-black/5 bg-white/40">
              <div className="space-y-8">
                <div className="group">
                  <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] block mb-3">Email Me</span>
                  <a 
                    href="mailto:gajjarparth09@gmail.com" 
                    className="flex items-center gap-4 text-text-main font-black text-lg group-hover:text-accent-peach transition-colors leading-none"
                  >
                    <div className="p-2 rounded-xl bg-accent-peach/10">
                      <Mail className="w-5 h-5 text-accent-peach" />
                    </div>
                    <span>gajjarparth09@gmail.com</span>
                  </a>
                </div>
                
                <div className="group">
                  <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] block mb-3">Location</span>
                  <div className="flex items-center gap-4 text-text-main font-black text-lg leading-none">
                    <div className="p-2 rounded-xl bg-accent-mint/10">
                      <div className="w-5 h-5 rounded-full border-4 border-accent-mint animate-pulse" />
                    </div>
                    <span>Waterloo, ON</span>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-black/5">
                <p className="text-sm text-text-muted italic font-medium leading-relaxed">
                  "I believe great things happen when we work together. Let's build something meaningful."
                </p>
              </div>
            </div>

            {/* Coffee Invite */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="px-8 py-6 rounded-[2rem] bg-accent-peach shadow-xl shadow-accent-peach/20 text-page-bg flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-full bg-white/20">
                  <Coffee className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                </div>
                <span className="text-sm font-black uppercase tracking-widest">Buy me a coffee?</span>
              </div>
              <ArrowRight className="w-4 h-4 opacity-40 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
            </motion.div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-8">
            <form onSubmit={handleSubmit} className="creative-card p-8 md:p-16 space-y-12 bg-white/80 dark:bg-white/5 border border-black/5 dark:border-white/10 transition-colors duration-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-3 relative group">
                  <label htmlFor="name" className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Your Name</label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-black/[0.03] dark:bg-white/[0.03] border border-transparent dark:border-white/5 rounded-2xl px-6 py-5 outline-none focus:ring-4 focus:ring-accent-peach/10 transition-all text-text-main font-bold placeholder:text-text-muted/30"
                    placeholder="Who are you?"
                  />
                </div>
                
                <div className="space-y-3 relative group">
                  <label htmlFor="email" className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Your Email</label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-black/[0.03] dark:bg-white/[0.03] border border-transparent dark:border-white/5 rounded-2xl px-6 py-5 outline-none focus:ring-4 focus:ring-accent-peach/10 transition-all text-text-main font-bold placeholder:text-text-muted/30"
                    placeholder="Where can I reach you?"
                  />
                </div>
              </div>

              <div className="space-y-3 relative group">
                <label htmlFor="message" className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Your Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full bg-black/[0.03] dark:bg-white/[0.03] border border-transparent dark:border-white/5 rounded-[2rem] px-6 py-5 outline-none focus:ring-4 focus:ring-accent-peach/10 transition-all text-text-main font-medium resize-none placeholder:text-text-muted/30"
                  placeholder="Tell me about your project or just say hi..."
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-8">
                <button
                  type="submit"
                  disabled={status.loading}
                  className="pill-button flex items-center gap-3 group w-full sm:w-auto justify-center disabled:opacity-50 h-16 min-w-[200px]"
                >
                  {status.loading ? "Sending..." : "Send Message"}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <AnimatePresence>
                  {status.success && (
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-3 text-accent-mint font-black text-sm uppercase tracking-widest"
                    >
                      <Sparkles className="w-5 h-5" />
                      <span>Message Delivered</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </form>
          </div>
        </div>

        {/* Hobbies Section Polished */}
        <div className="pt-32 border-t border-black/5 space-y-16">
          <div className="flex items-center gap-6">
            <div className="p-3 rounded-2xl bg-accent-lavender/10 text-accent-lavender shadow-sm">
              <Heart className="w-6 h-6" fill="currentColor" opacity={0.4} />
            </div>
            <div className="space-y-1">
              <h3 className="text-3xl font-black text-text-main tracking-tight uppercase italic leading-none">Beyond the Keyboard</h3>
              <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em]">Personal Continuum // Interests</p>
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
                  <span className="w-2 h-2 rounded-full bg-accent-peach shadow-[0_0_10px_rgba(249,115,22,0.3)]" />
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
