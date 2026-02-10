/* eslint-disable @typescript-eslint/no-unused-vars */

import EventPhotoMarquee from './EventPhotoMarquee';

const EventsScrollSections = ({ paused = false, onImageClick }) => {
  // Image arrays for each event
  const sourceCodeImages = [
    '/events/source-code-seminar/7.png',
    '/events/source-code-seminar/8.png',
    '/events/source-code-seminar/9.png',
    '/events/source-code-seminar/10.png',
  ];

  const kavachSurakshImages = [
    '/events/kavach-suraksha/1.jpg',
    '/events/kavach-suraksha/2.jpg',
    '/events/kavach-suraksha/3.jpg',
    '/events/kavach-suraksha/4.jpg',
    '/events/kavach-suraksha/5.jpg',
    '/events/kavach-suraksha/6.jpg',
  ];

  const vguGuestLectureImages = [
    '/events/vgu-guest-lecture/12.jpg',
    '/events/vgu-guest-lecture/13.jpg',
    '/events/vgu-guest-lecture/14.jpg',
    '/events/vgu-guest-lecture/15.jpg',
    '/events/vgu-guest-lecture/16.jpg',
    '/events/vgu-guest-lecture/VGU.jpg',
  ];

  const events = [
    {
      title: 'Kavach Suraksha',
      narrative: 'Collaborative defense exercises focused on high-stakes, real-world threat scenarios with multi-team participation. Tactical training environments that simulate enterprise-level security operations and incident response.',
      metadata: {
        audience: 'Security Teams',
        type: 'Defense Exercise',
        scale: 'National',
      },
      images: kavachSurakshImages,
      tone: 'tactical',
    },
    {
      title: 'Source Code Seminar',
      narrative: 'Foundational education in secure coding practices, reverse engineering techniques, and adversarial simulation frameworks. Designed for students and practitioners seeking hands-on exposure to real-world security challenges.',
      metadata: {
        audience: 'Students & Practitioners',
        type: 'Educational Workshop',
        scale: 'Regional',
      },
      images: sourceCodeImages,
      tone: 'academic',
    },
    {
      title: 'VGU Guest Lecture',
      narrative: 'Advanced cybersecurity insights and hands-on training delivered at VGU. Comprehensive coverage of enterprise defense strategies, incident response workflows, and cutting-edge threat intelligence.',
      metadata: {
        audience: 'University Students',
        type: 'Guest Lecture',
        scale: 'National',
      },
      images: vguGuestLectureImages,
      tone: 'educational',
    },
  ];

  return (
    <section className="relative bg-[#050505] py-10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="space-y-12">
          {events.map((event, idx) => (
            <div
              key={event.title}
              id={event.title === "Kavach Suraksha" ? "kavach-event" : undefined}
              className="space-y-8"
            >
              <div className="space-y-4 max-w-4xl mx-auto text-center">
                <h2 className="text-3xl font-semibold text-white sm:text-4xl md:text-5xl">
                  {event.title}
                </h2>
                <p className="text-white/80 text-base md:text-lg leading-relaxed max-w-3xl mx-auto">
                  {event.narrative}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs uppercase tracking-[0.2em] text-white/60">
                  <div className="flex items-center gap-2">
                    <span className="text-white/40">Audience</span>
                    <span className="text-white/80">{event.metadata.audience}</span>
                  </div>
                  <div className="h-4 w-px bg-white/20" />
                  <div className="flex items-center gap-2">
                    <span className="text-white/40">Type</span>
                    <span className="text-white/80">{event.metadata.type}</span>
                  </div>
                  <div className="h-4 w-px bg-white/20" />
                  <div className="flex items-center gap-2">
                    <span className="text-white/40">Scale</span>
                    <span className="text-white/80">{event.metadata.scale}</span>
                  </div>
                </div>
              </div>

              {/* Image Marquee */}
              <EventPhotoMarquee
                images={event.images}
                  speed={40}
                paused={paused}
                onImageClick={onImageClick}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventsScrollSections;
