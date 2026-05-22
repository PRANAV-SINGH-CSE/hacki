import { motion } from "framer-motion";

export const AboutIntro = () => (
  <motion.section
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    className="bg-transparent py-24 px-6"
  >
    <div className="max-w-3xl mx-auto text-center">
      <p className="text-lg text-white/80 leading-relaxed mb-4">
        Hackiware was founded in 2024 with a simple yet powerful idea—born in a small room but driven by a vision to create a big, meaningful impact in the cybersecurity ecosystem. Established by Yash Sharma, and Himanshu Sharma . Hackiware began as a passion-driven initiative to spread cybersecurity awareness, practical knowledge, and ethical responsibility among students and emerging professionals. What started as a modest concept has steadily evolved into a growing platform dedicated to strengthening digital security education and community engagement. With a clear mission to empower the next generation of cybersecurity professionals, Hackiware focuses on delivering industry-relevant learning, hands-on exposure, and impactful initiatives that bridge the gap between theory and real-world application. Today, Hackiware stands as a testament to how vision, commitment, and collaboration can transform a small beginning into a movement aimed at shaping a safer and more secure digital future.
      </p>

      <p className="text-lg text-white/80 leading-relaxed">
       
      </p>
    </div>
  </motion.section>
);
