// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center min-h-[80vh] text-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300 px-6">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">
        Welcome to AI Product Recommender
      </h1>
      <p className="text-gray-700 dark:text-gray-300 mb-6 max-w-2xl">
        Discover the smartest way to find products that fit your preferences.
        Our AI engine analyzes your needs and recommends top-rated products for
        you.
      </p>
      <div className="space-x-4">
        <Link
          to="/register"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all"
        >
          Get Started
        </Link>
        <Link
          to="/login"
          className="border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-6 py-3 rounded-lg transition-all"
        >
          Login
        </Link>
      </div>
    </section>
  );
}
