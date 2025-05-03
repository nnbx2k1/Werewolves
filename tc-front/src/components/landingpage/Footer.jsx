import React from "react";

export default function Footer() {
  return (
    <footer className="bg-[#72a1cd] text-white py-16 px-8 font-sans">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Team */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Team</h3>
          <ul className="space-y-2 text-white/80">
            <li>Boulanouar Mohamed</li>
            <li>Bougroura Achref </li>
            <li>Laribi Abderrahim </li>
            <li>Bakhti Nabil</li>
          </ul>
        </div>

        {/* Popular Questions */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Popular Questions</h3>
          <ul className="space-y-2 text-white/80">
            <li>How secure is TrustyChat?</li>
            <li>Can I send encrypted files?</li>
            <li>Is there a free trial?</li>
            <li>Do you support e-signatures?</li>
          </ul>
        </div>

        {/* About Us */}
        <div>
          <h3 className="text-xl font-semibold mb-4">About Us</h3>
          <p className="text-white/80">
            TrustyChat is a secure messaging platform designed for seamless, encrypted communication between banks and their clients. We combine usability with cutting-edge security.
          </p>
        </div>
      </div>

      <div className="mt-12 border-t border-white/20 pt-6 text-center text-white/60 text-sm">
        &copy; {new Date().getFullYear()} TrustyChat. All rights reserved.
      </div>
    </footer>
  );
}
