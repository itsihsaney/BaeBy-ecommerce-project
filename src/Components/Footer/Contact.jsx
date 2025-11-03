import React, { useState } from "react";

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thanks for contacting us! We'll get back to you soon 💌");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col items-center justify-center px-6 py-12">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Contact Us</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-3xl p-8 w-full max-w-lg space-y-4"
      >
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-full px-4 py-3 focus:ring-2 focus:ring-pink-400 outline-none"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-full px-4 py-3 focus:ring-2 focus:ring-pink-400 outline-none"
          required
        />
        <textarea
          name="message"
          placeholder="Your Message"
          rows="4"
          value={form.message}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-pink-400 outline-none resize-none"
          required
        ></textarea>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-full text-lg font-semibold hover:opacity-90 transition"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}

export default Contact;
