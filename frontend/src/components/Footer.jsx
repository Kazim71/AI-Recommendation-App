import React from "react";

export default function Footer() {
  return (
    <footer className="py-6 text-sm text-center text-gray-500 border-t border-gray-200 dark:text-gray-400 dark:border-gray-800">
      © {new Date().getFullYear()}{" "}
      <span className="font-medium text-blue-600 dark:text-blue-400">
        AI Product Recommender
      </span>
      . Built for innovation and precision.
    </footer>
  );
}
