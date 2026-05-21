import { motion } from 'framer-motion';
import { MissionVisionValues } from '../components/about/MissionVisionValues';
import { Timeline } from '../components/ui/timeline';

// --- VISUAL STYLE: ABSTRACT CIRCUIT ---
const CircuitPattern = () => (
  <svg className="w-full h-full opacity-[0.2]" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg">
    <motion.g
      initial={{ opacity: 0.5 }}
      animate={{ opacity: [0.5, 0.8, 0.5] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      <path d="M0 100 H800" stroke="url(#circuit_gradient)" strokeWidth="0.5" strokeDasharray="10 20" />
      <path d="M0 300 H800" stroke="url(#circuit_gradient)" strokeWidth="0.5" strokeDasharray="5 15" />
      <path d="M0 500 H800" stroke="url(#circuit_gradient)" strokeWidth="0.5" strokeDasharray="8 32" />
      <path d="M200 0 V600" stroke="url(#circuit_gradient_v)" strokeWidth="0.5" strokeDasharray="10 10" />
      <path d="M600 0 V600" stroke="url(#circuit_gradient_v)" strokeWidth="0.5" strokeDasharray="10 10" />
      <circle cx="200" cy="100" r="2" fill="#00F3FF" />
      <circle cx="600" cy="300" r="2" fill="#00F3FF" />
      <circle cx="200" cy="500" r="2" fill="#00F3FF" />
      <circle cx="600" cy="100" r="1.5" fill="#00F3FF" opacity="0.5" />
      <path d="M180 100 L200 120 H250" stroke="rgba(0, 243, 255, 0.3)" strokeWidth="1" fill="none" />
      <path d="M620 300 L600 280 H550" stroke="rgba(0, 243, 255, 0.3)" strokeWidth="1" fill="none" />
    </motion.g>
    
    <defs>
      <linearGradient id="circuit_gradient" x1="0" y1="0" x2="800" y2="0" gradientUnits="userSpaceOnUse">
        <stop stopColor="rgba(0, 243, 255, 0)" />
        <stop offset="0.5" stopColor="rgba(0, 243, 255, 0.4)" />
        <stop offset="1" stopColor="rgba(0, 243, 255, 0)" />
      </linearGradient>
      <linearGradient id="circuit_gradient_v" x1="0" y1="0" x2="0" y2="600" gradientUnits="userSpaceOnUse">
        <stop stopColor="rgba(0, 243, 255, 0)" />
        <stop offset="0.5" stopColor="rgba(0, 243, 255, 0.2)" />
        <stop offset="1" stopColor="rgba(0, 243, 255, 0)" />
      </linearGradient>
    </defs>
  </svg>
);

const timelineData = [
  {
    title: "2024",
    content: (
      <div>
        <p className="text-white/70 text-xs md:text-sm font-normal mb-8">
          In 2024, Hackiware was initialized through a series of focused discussions and planning calls, shaped within the confines of a small room and driven by a clear purpose—to create cybersecurity awareness across schools and educational institutions. What began as a simple idea to conduct awareness sessions gradually took a structured form, guided by the vision to build meaningful and impactful cybersecurity initiatives.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
            <h4 className="text-cyan-400 font-semibold mb-2">Founders</h4>
            <p className="text-white/60 text-sm">Yash Sharma & Himanshu Sharma — Student founders with practitioner focus</p>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
            <h4 className="text-cyan-400 font-semibold mb-2">Early Focus</h4>
            <p className="text-white/60 text-sm">Practical labs, Peer Mentorship, and Curriculum Integration pilots</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "2025",
    content: (
      <div>
        <p className="text-white/70 text-xs md:text-sm font-normal mb-8">
          In 2025, Hackiware marked key milestones with the successful execution of multiple initiatives. In February, KAVACH – “Suraksha Ke 7 Din” was organized to promote cyber awareness and digital safety. This was followed by the Source Code Seminar in June, conducted at both Beginner and Advanced levels, enabling learners to strengthen their technical foundations. Further expanding its outreach, Hackiware also conducted a Guest Cybersecurity Seminar at Vivekananda Global University (VGU) in October. As the initiative gained momentum and recognition, Hackiware evolved beyond individual efforts and transformed into a structured organizational environment. This transformation marked the beginning of a focused approach toward delivering scalable cybersecurity education, collaborative events, and community-driven programs.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
            <h4 className="text-cyan-400 font-semibold mb-2">National Events</h4>
            <p className="text-white/60 text-sm">Hands-on simulations</p>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
            <h4 className="text-cyan-400 font-semibold mb-2">Impact</h4>
            <p className="text-white/60 text-sm">30,000+ students reached</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "2026 & Beyond",
    content: (
      <div>
        <p className="text-white/70 text-xs md:text-sm font-normal mb-8">
          Today, Hackiware stands as a growing organization committed to strengthening the cybersecurity ecosystem by fostering awareness, practical learning, and responsible digital practices across academic and professional communities.
           
          <br/> <b> Building What's Next </b> 
        </p>
        <div className="grid grid-cols-2 gap-4">
          {/* <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
            <h4 className="text-cyan-400 font-semibold mb-2">Platform Evolution</h4>
            <p className="text-white/60 text-sm">Comprehensive ecosystem</p>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
            <h4 className="text-cyan-400 font-semibold mb-2">Future</h4>
            <p className="text-white/60 text-sm">Next-gen defenders</p>
          </div> */}
        </div>
      </div>
    ),
  },
];

const team = [
  { name: 'Yash Sharma', role: 'Founder & CEO', img: '/Leadership_Photo/Yash_Sharma.jpeg', linkedin: 'https://www.linkedin.com/in/yash-sharma-a6ba89290' },
  { name: 'Himanshu Sharma', role: 'Co-Founder & MD', img: '/Leadership_Photo/Himanshu_Sharma.jpg', linkedin: 'https://www.linkedin.com/in/himanshu-sharma06' },
];

const Leadership = () => (
  <section className="bg-black py-20">
    <div className="container mx-auto px-6">
      <div className="max-w-5xl mx-auto text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">Built by Visionaries</h3>
        <p className="text-white/70">People behind the vision — founders and advisors shaping strategy and impact.</p>
      </div>

      <div className="grid gap-12 md:grid-cols-2 max-w-4xl mx-auto">
        {team.map((member) => (
          <div key={member.name} className="rounded-2xl overflow-hidden border border-white/8 bg-[#050505] shadow-md w-full">
            <div
              className="h-80 md:h-[420px] bg-black/20 bg-center bg-cover"
              style={{
                backgroundImage: member.img ? `url(${member.img})` : undefined,
              }}
            >
              {!member.img && (
                <div className="h-full w-full flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800">
                  <div className="text-white/70 text-4xl font-bold">{member.name.split(' ').map(n=>n[0]).join('')}</div>
                </div>
              )}
            </div>

            <div className="px-6 py-6 flex items-center justify-between bg-[#050505]">
              <div>
                <div className="text-xl text-white font-semibold">{member.name}</div>
                <div className="text-sm text-white/60 tracking-wider mt-1">{member.role.toUpperCase()}</div>
              </div>

              <div className="flex items-center gap-4">
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${member.name} LinkedIn`}
                  className="h-10 w-10 rounded-full border border-white/10 flex items-center justify-center bg-transparent hover:bg-white/6 transition"
                >
                  <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0 8h5v16H0V8zm7.5 0h4.8v2.2h.1c.67-1.2 2.3-2.2 4.7-2.2C23.1 8 24 11 24 15.2V24h-5v-8.2c0-2-0.04-4.6-2.8-4.6-2.8 0-3.2 2.1-3.2 4.5V24h-5V8z" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="border-t border-white/6" />
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Closing = () => (
  <section className="bg-[#050505] py-20">
    <div className="container mx-auto px-6 text-center max-w-4xl">
      <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Join the mission</h3>
      <p className="text-white/70 mb-6">If you're an institution, industry partner, or an aspiring student, reach out to collaborate on curriculum, events, or research. We welcome partnerships that prioritize practical impact and measurable learning outcomes.</p>
    </div>
  </section>
);

const About = () => {
  return (
    <>
      {/* HERO SECTION */}
      <section className="relative h-screen min-h-screen overflow-hidden bg-[#000000]">
        <div
          className="absolute inset-0 z-0 bg-center bg-cover bg-no-repeat"
          style={{
            backgroundImage: `url("${process.env.PUBLIC_URL}/about us/background_image_1.png")`,
          }}
          aria-hidden="true"
        />

        {/* NOISE OVERLAY */}
        <div 
          className="absolute inset-0 z-[1] pointer-events-none opacity-[0.04] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
          }}
        />

        {/* BACKGROUND ANIMATION */}
        <div className="absolute inset-0 z-[2] pointer-events-none">
          <CircuitPattern />
        </div>

        {/* Text overlay */}
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-6xl px-6 text-center"
          >
            {/* CHANGED: Decreased sizes slightly for balance */}
            <h1 
              className="text-5xl md:text-7xl font-bold text-white mb-6 font-sans tracking-tight"
              style={{ textShadow: '0 0 10px rgba(0,243,255,0.35)' }}
            >
              About Hackiware
            </h1>
            {/* CHANGED: Decreased paragraph size slightly */}
            <p className="text-lg md:text-xl text-white/80 font-light tracking-wide leading-relaxed max-w-4xl mx-auto">
              We build immersive cybersecurity experiences that bridge theory
              and real-world defense — empowering the next generation of
              defenders.
            </p>
          </motion.div>
        </div>

        {/* FIXED: Removed the fade mask div that was causing the black bar */}
      </section>

      {/* CONTENT */}
      <MissionVisionValues />
      <Timeline data={timelineData} />
      <Leadership />
      <Closing />
    </>
  );
};

export default About;