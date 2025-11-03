import React, { useState } from "react";

function FAQ() {
  const faqs = [
    {
      question: "How long will delivery take?",
      answer:
        "Delivery usually takes 3–5 business days depending on your location.",
    },
    {
      question: "Can I track my order?",
      answer:
        "Yes! You can track your order in your account or via the link sent to your email after dispatch.",
    },
    {
      question: "Do you offer free shipping?",
      answer:
        "We offer free shipping for all orders above $50.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col items-center px-6 py-12">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">FAQs</h1>
      <div className="w-full max-w-3xl space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-2xl shadow-md cursor-pointer"
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
          >
            <h2 className="text-lg font-semibold text-gray-800 flex justify-between items-center">
              {faq.question}
              <span>{openIndex === index ? "−" : "+"}</span>
            </h2>
            {openIndex === index && (
              <p className="mt-3 text-gray-600">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FAQ;
