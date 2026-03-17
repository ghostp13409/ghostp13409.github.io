import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import { motion, AnimatePresence } from "framer-motion";

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
    } catch {
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
      className="px-8 sm:px-16 lg:px-32 py-32 space-y-16 relative"
    >
      <div className="max-w-4xl space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="pb-8 border-b border-black/[0.05]"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-text-main tracking-tight mb-4">
            Contact
          </h2>
          <p className="text-text-muted font-medium">
            Let's build something together.
          </p>
        </motion.div>

        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-sm font-semibold text-text-main">
                Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-black/[0.02] border border-black/[0.05] rounded-xl px-4 py-3 outline-none focus:border-accent-peach transition-colors text-text-main"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-semibold text-text-main">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-black/[0.02] border border-black/[0.05] rounded-xl px-4 py-3 outline-none focus:border-accent-peach transition-colors text-text-main"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="message" className="text-sm font-semibold text-text-main">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={5}
              className="w-full bg-black/[0.02] border border-black/[0.05] rounded-xl px-4 py-3 outline-none focus:border-accent-peach transition-colors text-text-main resize-none"
            />
          </div>

          <div className="flex items-center gap-6">
            <button
              type="submit"
              disabled={status.loading}
              className="bg-text-main text-page-bg font-semibold px-8 py-3 rounded-xl hover:bg-text-main/90 transition-colors disabled:opacity-50"
            >
              {status.loading ? "Sending..." : "Send Message"}
            </button>

            <AnimatePresence>
              {status.success && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-accent-mint font-medium text-sm"
                >
                  Message Delivered
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ContactPage;