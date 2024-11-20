import { ArrowBigLeft } from "lucide-react";
import emailjs from "@emailjs/browser";
import { useState } from "react";
import { Loader } from "lucide-react";

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
    <section id="hire" className="relative min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-10 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
        Work with Me 👥
      </h1>
      <div className="bg-gray-800 p-6 rounded-lg mb-6 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <h3 className="text-xl font-bold mb-4">Send Me A Message</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            required
            className="w-full p-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-300"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="w-full p-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-300"
          />
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Message"
            required
            className="w-full p-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-32 transition-all duration-300"
          />
          <button
            type="submit"
            disabled={status.loading}
            className="px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {status.loading ? (
              <>
                <Loader className="animate-spin mr-2" size={16} />
                Sending...
              </>
            ) : (
              "Send Message"
            )}
          </button>

          {status.error && (
            <div className="text-red-500 text-sm mt-2">{status.error}</div>
          )}

          {status.success && (
            <div className="text-green-500 text-sm mt-2">
              Message sent successfully!
            </div>
          )}
        </form>
      </div>
      <div className="absolute bottom-12 left-5 border-dashed rounded-lg border-2 border-gray-500 p-4 animate-bounce duration-800 delay-100 ">
        <h3 className="text-xl font-bold">
          <ArrowBigLeft className="inline-block " /> Or Contact Me Here
        </h3>
      </div>
    </section>
  );
};

export default ContactPage;
