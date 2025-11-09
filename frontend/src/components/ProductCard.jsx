import React from "react";
import { motion } from "framer-motion";

export default function ProductCard({ product }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className="rounded-2xl bg-white/70 dark:bg-gray-900/60 backdrop-blur-lg border border-gray-200 dark:border-gray-700 shadow-sm p-5 flex flex-col items-center text-center transition"
    >
      <img
        src={product.image}
        alt={product.name}
        className="w-32 h-32 object-cover rounded-lg mb-4"
      />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        {product.name}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
        {product.description}
      </p>
      <p className="text-blue-600 dark:text-blue-400 font-medium mt-2">
        ₹{product.price}
      </p>
      <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
        View Details
      </button>
    </motion.div>
  );
}
