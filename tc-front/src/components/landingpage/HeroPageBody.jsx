import React from "react";
import { Typewriter } from 'react-simple-typewriter';
import { useInView } from 'react-intersection-observer';

export default function SecureCommunicationProblem() {
  const [refLeft, inViewLeft] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [refRight, inViewRight] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <div className="bg-[#72a1cd] min-h-screen text-white font-sans">
      {/* Problem Explanation Section */}
      <div className="max-w-6xl mx-auto py-24 px-8 md:px-16 grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        <div
          ref={refLeft}
          className={`text-left mt-16 transition-opacity duration-1500  ${inViewLeft ? 'opacity-100' : 'opacity-0'}`}
        >
          <h2 className="text-3xl font-bold text-white mb-6">
            <Typewriter
              words={['Why TrustyChat?', 'Secure Messaging Matters']}
              loop={0}
              cursor
              cursorStyle="_"
              typeSpeed={60}
              deleteSpeed={40}
              delaySpeed={2000}
            />
          </h2>
          <p className="text-lg text-white/80 hover:text-blue-300 transition duration-500">
            Most communication apps today fail to provide true security. Emails and basic messaging services lack end-to-end encryption, leaving your private data exposed.
          </p>
        </div>

        <div
          ref={refRight}
          className={`text-left transition-opacity duration-1500 mt-56 ${inViewRight ? 'opacity-100' : 'opacity-0'}`}
        >
          <h2 className="text-3xl font-bold text-white mb-6">
            <Typewriter
              words={['The Risk is Real', 'Trust is Everything']}
              loop={0}
              cursor
              cursorStyle="_"
              typeSpeed={60}
              deleteSpeed={40}
              delaySpeed={2000}
            />
          </h2>
          <p className="text-lg text-white/80 hover:text-blue-300 transition duration-500">
            Sensitive files and financial documents deserve more than just a PDF attachment. Without strong encryption, they’re vulnerable to breaches, fraud, and data theft.
          </p>
        </div>
      </div>
    </div>
  );
}
