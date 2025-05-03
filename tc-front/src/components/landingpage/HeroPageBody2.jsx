import React from "react";
import { motion } from "framer-motion";

const features = [
  {
    title: "End-to-End Encryption",
    description:
      "All messages and documents are encrypted from sender to receiver, ensuring complete confidentiality.",
  },
  {
    title: "Bank-Level Security",
    description:
      "Our infrastructure is built with the same standards used by financial institutions worldwide.",
  },
  {
    title: "Real-Time Communication",
    description:
      "Send and receive messages instantly, with the reliability and speed you expect from a trusted platform.",
  },
  {
    title: "Secure File Sharing",
    description:
      "Easily share sensitive documents without worrying about leaks, breaches, or interception.",
  },
   
  {
    title: "Seamless E-Signature Integration",
    description:
      "Digitally sign documents securely and legally within the platform.",
  },
  {
    title: "  Private Mode with Zero-Knowledge Security",
    description:
      "Ensures user actions remain hidden while proving authenticity without revealing data.",
  },

];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0 },
};

export default function FeaturesSection() {
  return (
    <div className="bg-white text-gray-800 font-sans py-20 px-8">
      <h2 className="text-4xl text-gray-800 font-bold text-center mb-10">Our Core Features</h2>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 1 }}
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="bg-[#F1F5F9] mt-10 p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-500"
            variants={item}
          >
            <h3 className="text-2xl font-semibold mb-4 text-[#72a1cd]">
              {feature.title}
            </h3>
            <p className="text-gray-700">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
