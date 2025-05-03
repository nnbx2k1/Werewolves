import React from "react";
import { motion } from "framer-motion";
import exampleImage from "../../assets/p.png"; // Replace with your actual image

export default function SideBySideSection() {
  return (
    <div className="bg-white min-h-screen flex items-center justify-center px-6 py-16 font-sans relative overflow-hidden">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center z-10">
        {/* Text Section */}
        <div>
          <h2 className="text-4xl font-bold text-[#003B73] mb-6">
            Built for Privacy and Simplicity
          </h2>
          <p className="text-lg text-[#1F2937]">
            TrustyChat offers secure messaging, file sharing, and digital signatures—
            all in one place. We prioritize security without sacrificing usability,
            so your sensitive communication stays protected and effortless.
          </p>
        </div>

        {/* Image Section */}
        <div className="flex justify-center relative">
          <motion.img
            src={exampleImage}
            alt="Secure Communication"
            className="w-[90%] md:w-[110%] h-auto rounded-lg shadow-lg z-10"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            viewport={{ once: true }}
          />
        </div>
      </div>

      {/* Circular scrolling background effect */}
      <div className="absolute right-79 bottom-10 w-[1400px] h-[700px] bg-[#BFD7ED] opacity-100 rounded-full animate-spin-slow z-0" />
    </div>
  );
}
