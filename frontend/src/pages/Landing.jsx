import React from "react";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="flex flex-col min-h-screen text-gray-900 transition-colors duration-500 bg-gray-50 dark:bg-gray-950 dark:text-gray-100">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center flex-1 px-6 py-24 text-center sm:py-32">
        <h1 className="mb-6 text-4xl font-extrabold tracking-tight md:text-6xl">
          Smarter Shopping Starts Here
        </h1>
        <p className="max-w-2xl mb-10 text-lg text-gray-600 md:text-xl dark:text-gray-300">
          Discover products tailored to your needs with our AI-powered
          recommendation system. Save time, skip the noise, and get only what
          fits *you*.
        </p>

        <div className="flex space-x-4">
          <Link
            to="/register"
            className="px-6 py-3 font-semibold text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="px-6 py-3 font-semibold text-blue-600 transition border border-blue-600 rounded-lg dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-800"
          >
            Login
          </Link>
        </div>

        {/* Decorative AI Illustration Block */}
        <div className="w-full max-w-4xl p-8 mt-16 shadow-md bg-gradient-to-br from-blue-100 to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl">
          <h2 className="mb-3 text-xl font-semibold">How It Works</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Type your preferences — like “Phones under $500 with great camera” —
            and our AI analyzes thousands of products to recommend the best match
            instantly. All powered by the Perplexity AI API.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white border-t border-gray-200 dark:bg-gray-900 dark:border-gray-800">
        <div className="grid max-w-6xl gap-8 px-6 mx-auto text-center md:grid-cols-3">
          {[
            {
              title: "AI-Powered Engine",
              desc: "Smart recommendations using the Perplexity AI API for precision and insight.",
            },
            {
              title: "Personalized Results",
              desc: "Custom-tailored product suggestions based on your exact preferences.",
            },
            {
              title: "Fast & Responsive",
              desc: "Optimized UI built with React and Tailwind for a seamless experience.",
            },
          ].map((f, i) => (
            <div
              key={i}
              className="p-8 transition-shadow rounded-xl bg-gray-50 dark:bg-gray-800 hover:shadow-lg"
            >
              <h3 className="mb-2 text-lg font-semibold text-blue-600 dark:text-blue-400">
                {f.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
