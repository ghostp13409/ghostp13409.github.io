import emailjs from "@emailjs/browser";
import { useState } from "react";
import type { FC, ChangeEvent, FormEvent } from "react";
import { ArrowLeft, Loader2, Mail, MessageCircle, Heart, Send } from "lucide-react";
import { Hobbies, socials } from "../data";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "../lib/motion";

// EmailJS public identifiers (safe to expose; the public key only permits sending through this template).
const EMAILJS_SERVICE_ID = "service_ztr49n8";
const EMAILJS_TEMPLATE_ID = "template_3rwyio7";
const EMAILJS_PUBLIC_KEY = "2bJXuP1jEJgdkF9cc";

const SECRET_CLICKS = 5;

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface Status {
  loading: boolean;
  error: string | null;
  success: boolean;
}

const inputClass =
  "w-full p-4 bg-surface/50 backdrop-blur-sm rounded-md focus:ring-2 focus:ring-primary/50 outline-none transition-all duration-300 border border-border hover:border-primary/50 text-ink placeholder-ink/40";

const ContactPage: FC = () => {
  const [formData, setFormData] = useState<FormData>({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<Status>({ loading: false, error: null, success: false });
  const [clickCount, setClickCount] = useState(0);
  const secretUnlocked = clickCount >= SECRET_CLICKS;

  const handleHeadingClick = () => setClickCount((prev) => Math.min(prev + 1, SECRET_CLICKS));

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus({ loading: true, error: null, success: false });

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: formData.name,
          reply_to: formData.email,
          message: formData.message,
        },
        EMAILJS_PUBLIC_KEY,
      );

      setStatus({ loading: false, error: null, success: true });
      setFormData({ name: "", email: "", message: "" });
    } catch {
      setStatus({
        loading: false,
        error: "Something went wrong and the message was not sent. Please try again or reach me on LinkedIn.",
        success: false,
      });
    }
  };

  return (
    <section
      id="hire"
      className="min-h-screen scroll-mt-18 lg:scroll-mt-0 flex flex-col justify-center items-center p-6 relative overflow-hidden bg-neutral-bg"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-secondary/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-accent/10 rounded-full blur-xl"></div>
      </div>

      <motion.div
        variants={staggerContainer(0.15)}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.1 }}
        className="w-full max-w-5xl px-2 sm:px-8 text-center z-10 space-y-12"
      >
        {/* Header with click interaction */}
        <motion.div variants={fadeInUp} className="mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <h2
              className="text-4xl sm:text-6xl lg:text-7xl font-bold text-primary tracking-tight cursor-pointer select-none"
              onClick={handleHeadingClick}
              title="Psst. Click me a few times."
            >
              Let's Work Together
            </h2>
            <span className="text-sm text-ink/40 flex items-center gap-2 min-w-24 justify-center" aria-live="polite">
              {clickCount === 0 && (
                <>
                  <ArrowLeft className="w-4 h-4 rotate-90 sm:rotate-0 animate-pulse" aria-hidden="true" /> click me!
                </>
              )}
              {clickCount > 0 && !secretUnlocked && <span className="animate-pulse">{SECRET_CLICKS - clickCount} more</span>}
              {secretUnlocked && (
                <motion.span
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-primary font-bold tracking-widest uppercase"
                >
                  Secret section unlocked! 🎉
                </motion.span>
              )}
            </span>
          </div>
        </motion.div>

        {/* Contact Introduction */}
        <motion.div variants={fadeInUp}>
          <div className="bg-surface/40 backdrop-blur-xl p-6 sm:p-8 rounded-lg border border-border/50 shadow-2xl">
            <p className="text-lg sm:text-2xl text-ink leading-relaxed mb-6">
              Got a project in mind, an <span className="text-primary font-semibold">opportunity</span> to discuss, or
              just want to chat about tech? I'd love to hear from you. Drop me a message and let's build something{" "}
              <span className="text-secondary font-semibold">great</span> together.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-ink/40">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5" aria-hidden="true" />
                <span className="text-sm">Usually replies within a day</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
                <span className="text-sm">Always open to a chat</span>
              </div>
            </div>

            <ul className="flex flex-wrap items-center justify-center gap-3 mt-6" aria-label="Social profiles">
              {socials.map((social) => (
                <li key={social.title}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-surface/50 border border-border rounded-md text-sm text-ink/70 hover:text-primary hover:border-primary/50 transition-all"
                  >
                    <span aria-hidden="true" className="[&>svg]:w-4 [&>svg]:h-4">
                      {social.Icon}
                    </span>
                    {social.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div variants={fadeInUp}>
          <div className="bg-surface/50 backdrop-blur-sm p-6 sm:p-8 rounded-lg border border-border/50 hover:border-primary/50 transition-all duration-300 text-left">
            <h3 className="text-2xl sm:text-3xl font-bold text-ink mb-8 flex items-center justify-center gap-3">
              <MessageCircle className="h-8 w-8 text-primary" aria-hidden="true" />
              Send Me a Message
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6" noValidate={false}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="contact-name" className="sr-only">
                    Your name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    autoComplete="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    required
                    maxLength={100}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="sr-only">
                    Your email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your Email"
                    required
                    maxLength={200}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-message" className="sr-only">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell me about your project or just say hi!"
                  required
                  minLength={10}
                  maxLength={3000}
                  rows={6}
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div className="flex justify-center md:justify-start">
                <button
                  type="submit"
                  disabled={status.loading}
                  className="w-full md:w-auto px-8 py-4 bg-primary rounded-md transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-3 font-semibold text-neutral-bg shadow-lg hover:shadow-primary/25"
                >
                  {status.loading ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5" aria-hidden="true" />
                      Sending…
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" aria-hidden="true" />
                      Send Message
                    </>
                  )}
                </button>
              </div>

              <div aria-live="polite">
                {status.error && (
                  <div role="alert" className="p-4 bg-red-500/10 border border-red-500/20 rounded-md text-red-400 text-center">
                    {status.error}
                  </div>
                )}
                {status.success && (
                  <div className="p-4 bg-primary/10 border border-primary/20 rounded-md text-primary text-center">
                    Message sent. I'll get back to you soon! 🚀
                  </div>
                )}
              </div>
            </form>
          </div>
        </motion.div>

        {/* Secret Hobbies Section */}
        {secretUnlocked && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="bg-surface/50 backdrop-blur-sm p-6 sm:p-8 rounded-lg border border-secondary/30">
              <h3 className="text-2xl sm:text-3xl font-bold text-ink mb-8 flex items-center justify-center gap-3">
                <Heart className="h-8 w-8 text-secondary" aria-hidden="true" />
                My Hobbies
              </h3>

              <div className="bg-secondary/10 border border-secondary/20 rounded-md p-6 mb-8">
                <p className="text-ink/80 leading-relaxed">
                  Congrats, curious one! You took enough interest to find this section. As a reward, here's what I get up
                  to when I'm away from the keyboard. 🎉
                </p>
              </div>

              <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                {Hobbies.map((hobby, index) => (
                  <motion.li
                    key={hobby.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-surface/50 backdrop-blur-sm p-6 rounded-lg border border-border hover:border-secondary/50 transition-all duration-300 hover:-translate-y-2"
                  >
                    <h4 className="text-lg font-bold text-secondary mb-3">{hobby.title}</h4>
                    <p className="text-ink/60 text-sm leading-relaxed">{hobby.description}</p>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}

        <footer className="pt-8 text-xs text-ink/30">
          © {new Date().getFullYear()} Parth Gajjar. Built with React, TypeScript, and Tailwind CSS.
        </footer>
      </motion.div>
    </section>
  );
};

export default ContactPage;
