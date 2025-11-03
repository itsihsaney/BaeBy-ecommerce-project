import React from "react";

function Return() {
  return (
    <div className="min-h-screen bg-pink-50 flex flex-col items-center px-6 py-12">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">
        Return & Refund Policy
      </h1>
      <div className="bg-white shadow-lg rounded-3xl p-8 max-w-3xl text-gray-700 space-y-4 leading-relaxed">
        <p>
          We want you to love what you ordered! If something doesn’t feel right,
          you can return your product within <b>7 days</b> of delivery.
        </p>
        <p>
          Items must be unused, unwashed, and in original packaging. Once we
          receive your return, your refund will be processed within 5–7 business
          days.
        </p>
        <p>
          For any issues, please reach out to us at{" "}
          <a
            href="mailto:support@baeby.com"
            className="text-pink-500 font-medium underline"
          >
            support@baeby.com
          </a>
        </p>
      </div>
    </div>
  );
}

export default Return;
