import emailjs from "@emailjs/browser";
import { useState } from "react";
import { ArrowLeftIcon, Loader } from "lucide-react";
import { Hobbies } from "./data";

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
    <section id="hire" className="relative min-h-screen p-8">
      <div className="flex items-center justify-center gap-4 mb-10">
        <h1
          className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text cursor-pointer"
          onClick={handleHeadingClick}
        >
          Work with Me 👥
        </h1>
        {clickCount === 0 && (
          <span className="text-sm text-gray-400 flex gap-2 animate-pulse">
            <ArrowLeftIcon /> click it!
          </span>
        )}
        {clickCount > 0 && clickCount < 5 && (
          <span className="text-sm text-gray-400 animate-pulse">
            x{5 - clickCount}
          </span>
        )}
        {clickCount >= 5 && (
          <span className="text-sm text-green-400 animate-bounce">
            Secret Section Unlocked!
          </span>
        )}
      </div>
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
            className="w-full p-3 bg-gray-700/50 backdrop-blur-sm rounded-lg focus:ring-2 focus:ring-blue-500/50 outline-none transition-all duration-300 border border-gray-600/50 hover:border-blue-500/50"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="w-full p-3 bg-gray-700/50 backdrop-blur-sm rounded-lg focus:ring-2 focus:ring-blue-500/50 outline-none transition-all duration-300 border border-gray-600/50 hover:border-blue-500/50"
          />
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Message"
            required
            className="w-full p-3 bg-gray-700/50 backdrop-blur-sm rounded-lg focus:ring-2 focus:ring-blue-500/50 outline-none h-32 transition-all duration-300 border border-gray-600/50 hover:border-blue-500/50"
          />
          <button
            type="submit"
            disabled={status.loading}
            className="relative px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative">
              {status.loading ? (
                <>
                  <Loader className="animate-spin mr-2 inline " size={16} />
                  Sending...
                </>
              ) : (
                "Send Message"
              )}
            </span>
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

      {clickCount >= 5 && (
        <div className="mt-8 bg-gray-800/50 p-6 rounded-lg transform transition-all duration-500">
          <h3 className="text-xl font-bold mb-6 text-purple-400 ">
            Hobbies 🌟
          </h3>
          <div className=" bg-slate-600 drop-shadow-lg p-4 rounded-lg text-gray-300 mb-4 ">
            <p className="text-gray-300">
              Congrats! I see you're a curious one, and you have taken enough
              interest in me to find this section. As a reward, you'll get to
              know me better by getting to know my hobbies.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Hobbies.map((hobby) => (
              <div
                key={hobby.id}
                className="group relative p-[1px] bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl overflow-hidden shadow-lg hover:shadow-blue-500/20 transition-all duration-500"
              >
                <div className="bg-gray-900/95 backdrop-blur-xl p-6 rounded-xl h-full transition-all duration-300 group-hover:bg-gray-800/90">
                  <h4 className="text-lg font-semibold text-purple-400 mb-2">
                    {hobby.title}
                  </h4>
                  <p className="text-gray-300 text-sm">{hobby.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default ContactPage;
