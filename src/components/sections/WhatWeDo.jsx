import { Briefcase, Users, Book } from 'lucide-react';

const Feature = ({ icon, title, children }) => (
  <div className="flex min-h-[330px] flex-col items-start gap-5 rounded-2xl border border-white/15 bg-white/5 p-8 shadow-[0_18px_55px_rgba(0,0,0,0.22)] backdrop-blur-2xl">
    <div className="inline-flex items-center justify-center rounded-md bg-cyan-400/10 p-3 text-cyan-300">
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-white">{title}</h3>
    <p className="text-white/70 text-sm">{children}</p>
  </div>
);

const WhatWeDo = () => {
  return (
    <section className="bg-transparent py-20">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">What We Do</h2>
          <p className="text-white/70">Hands-on training, national events, and a platform built for learning.</p>
        </div>

        <div className="mx-auto grid max-w-[76rem] gap-7 md:grid-cols-3">
          <Feature icon={<Briefcase />} title="Hands-On Cybersecurity">
            Practical labs, simulations, and CTF-style challenges that teach applied defensive and offensive skills.
          </Feature>

          <Feature icon={<Users />} title="National-Level Events">
            Flagship events like KAVACH that bring students, institutions, and industry together for large-scale learning.
          </Feature>

          <Feature icon={<Book />} title="Education-First Platform">
            A community-focused platform centered on mentorship, practical skill-building, and ethical practice.
          </Feature>
        </div>
      </div>
    </section>
  );
};

export default WhatWeDo;
