/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Radar,
  Activity,
  AlertTriangle,
  Zap,
  GraduationCap,
  Handshake,
} from "lucide-react";

// ... [Keep types and interfaces] ...

type ProductId = "left" | "right";

interface FeatureMetric {
  label: string;
  value: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

interface ProductData {
  id: ProductId;
  title: string;
  description: string;
  features: FeatureMetric[];
  gradient: string;
  ringColor: string;
  glowColor: string;
  imageUrl: string;
}

const PRODUCT_DATA: Record<ProductId, ProductData> = {
  left: {
    id: "left",
    title: "Core Cybersecurity Domains",
    description:
      "Foundational and advanced domains we actively teach through labs, workshops, and national-level programs.",
    features: [
      {
        label: "Offensive Security",
        value: "ACTIVE — Guided exploit development labs covering web exploitation, binary reversing, and real-world red-team tradecraft.",
        icon: Zap,
      },
      {
        label: "Defensive Security",
        value: "ACTIVE — Incident response simulations, detection engineering workshops, and hands-on blue-team playbooks.",
        icon: ShieldCheck,
      },
      {
        label: "Threat Intelligence",
        value: "ACTIVE — Evidence-driven threat hunting exercises, IOC correlation labs, and feed analysis training.",
        icon: Radar,
      },
      {
        label: "Cybersecurity Education",
        value: "PAST → PRESENT — Curriculum design, instructor training programs, and lab-based assessments delivered across universities.",
        icon: GraduationCap,
      },
    ],
    gradient: "from-cyan-500/20 via-blue-500/10 to-cyan-900/20",
    ringColor: "rgba(34, 211, 238, 0.18)",
    glowColor: "rgba(34, 211, 238, 0.28)",
    imageUrl: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&q=80",
  },
  right: {
    id: "right",
    title: "Applied & National Programs",
    description:
      "Where Hackiware executes — live programs, simulations, and collaborations that translate skills into real-world readiness.",
    features: [
      {
        label: "Workshops",
        value:
          "PAST & ACTIVE — Instructor-led labs delivered across colleges, focused on secure coding and exploitation basics.",
        icon: Activity,
      },
      {
        label: "CTFs",
        value: "ACTIVE — Recurring CTF-style challenges covering web, binary, crypto, and forensics with increasing difficulty tiers.",
        icon: Zap,
      },
      {
        label: "Simulations",
        value: "FLAGSHIP — Multi-team incident response simulations mirroring national-scale coordination and escalation.",
        icon: AlertTriangle,
      },
      {
        label: "College Collaborations",
        value: "PAST → PRESENT — Long-term partnerships enabling curriculum alignment and faculty co-design.",
        icon: Handshake,
      },
    ],
    gradient: "from-fuchsia-500/20 via-purple-500/10 to-fuchsia-900/20",
    ringColor: "rgba(244, 114, 182, 0.18)",
    glowColor: "rgba(244, 114, 182, 0.28)",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop",
  },
};

const BackgroundGradient: React.FC<{ product: ProductData }> = ({ product }) => {
  return (
    <div
      className={`absolute inset-0 bg-gradient-to-br ${product.gradient} opacity-60`}
      style={{
        background: `radial-gradient(circle at 30% 50%, ${product.glowColor}, transparent 50%),
                     radial-gradient(circle at 70% 50%, ${product.glowColor}, transparent 50%)`,
      }}
    />
  );
};

const ProductVisual: React.FC<{ product: ProductData; isActive: boolean }> = ({
  product,
  isActive,
}) => {
  return (
    /* HEIGHT REDUCED: min-h-[450px] -> min-h-[350px] */
    <div className="relative flex items-center justify-center h-full min-h-[350px]">
      {/* Rotating dashed rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        {[1, 2, 3].map((ring) => {
          /* RINGS SCALED DOWN: 140/70 -> 100/50 */
          const size = 100 + ring * 50; 
          return (
            <motion.div
              key={ring}
              {...({
                className: "absolute rounded-full border border-dashed",
                style: {
                  width: `${size}px`,
                  height: `${size}px`,
                  borderColor: product.ringColor,
                },
                animate: {
                  rotate: isActive ? 360 : 0,
                },
                transition: {
                  duration: 20 + ring * 5,
                  repeat: Infinity,
                  ease: "linear",
                },
              } as any)}
            />
          );
        })}
      </div>

      {/* Floating object with glow */}
      <motion.div
        {...({
          className: "relative z-10",
          animate: {
            y: isActive ? [0, -10, 0] : 0,
            scale: isActive ? [1, 1.05, 1] : 1,
          },
          transition: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          },
        } as any)}
      >
        {/* IMAGE SCALED DOWN: w-40 h-40 -> w-32 h-32 */}
        <div
          className="relative w-32 h-32 rounded-2xl overflow-hidden border-2"
          style={{
            borderColor: product.ringColor,
            boxShadow: `0 0 40px ${product.glowColor}, 0 0 80px ${product.glowColor}`,
          }}
        >
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${product.glowColor}20, transparent)`,
            }}
          />
        </div>
      </motion.div>

      {/* Ambient glow */}
      <motion.div
        {...({
          className: "absolute inset-0 rounded-full blur-3xl",
          style: {
            background: `radial-gradient(circle, ${product.glowColor}, transparent 70%)`,
          },
          animate: {
            opacity: isActive ? [0.3, 0.6, 0.3] : 0.2,
            scale: isActive ? [1, 1.2, 1] : 1,
          },
          transition: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          },
        } as any)}
      />
    </div>
  );
};

const ProductDetails: React.FC<{ product: ProductData; isActive: boolean }> = ({
  product,
  isActive,
}) => {
  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          key={product.id}
          {...({
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -20 },
            transition: { duration: 0.5 },
            className: "space-y-4", /* REDUCED: space-y-8 -> space-y-4 */
          } as any)}
        >
          <div>
            <h3 className="text-2xl font-light text-white mb-1">{product.title}</h3>
            <p className="text-white/70 text-sm leading-relaxed">{product.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-stretch">
            {product.features.map((feature, index) => {
              const Icon = feature.icon;
              const isDominant = feature.value.includes("FLAGSHIP");
              return (
                <motion.div
                  key={feature.label}
                  {...({
                    initial: { opacity: 0, x: -20 },
                    animate: { opacity: 1, x: 0 },
                    transition: { delay: index * 0.1 },
                    whileHover: {
                      scale: 1.02,
                      y: -2,
                      boxShadow: `0 8px 30px ${product.glowColor}`,
                    },
                    whileTap: { scale: 0.995 },
                    /* REDUCED PADDING: p-6/p-5 -> p-4/p-3 */
                    className: isDominant
                      ? "flex flex-col gap-2 p-4 rounded-xl bg-white/10 border border-cyan-400/30 transition-transform duration-200 h-full"
                      : "flex flex-col gap-2 p-3 rounded-lg bg-white/5 border border-white/10 transition-transform duration-200 h-full",
                  } as any)}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="p-1.5 rounded-md"
                      style={{
                        backgroundColor: `${product.glowColor}20`,
                      }}
                    >
                      <Icon className="w-4 h-4" style={{ color: product.glowColor }} />
                    </div>
                    <div className="text-xs font-bold text-white uppercase tracking-wider">
                      {feature.label}
                    </div>
                  </div>
                  
                  <div className="text-xs font-medium text-white/70 leading-relaxed line-clamp-4">
                    {feature.value}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Switcher: React.FC<{
  activeProduct: ProductId;
  onSwitch: (id: ProductId) => void;
}> = ({ activeProduct, onSwitch }) => {
  return (
    <div className="flex items-center gap-2 p-1 bg-black/40 rounded-full border border-white/10 backdrop-blur-sm">
      {(["left", "right"] as ProductId[]).map((id) => {
        const product = PRODUCT_DATA[id];
        const isActive = activeProduct === id;
        return (
          <button
            key={id}
            onClick={() => onSwitch(id)}
            /* REDUCED PADDING: px-8 py-3 -> px-6 py-2 */
            className={`relative px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              isActive ? "text-black" : "text-white/70 hover:text-white"
            }`}
          >
            <AnimatePresence>
              {isActive && (
                <motion.span
                  layoutId="activeSwitcher"
                  className="absolute inset-0 rounded-full bg-white"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </AnimatePresence>
            <span className="relative z-10">{product.title}</span>
          </button>
        );
      })}
    </div>
  );
};

const SpatialProductShowcase: React.FC = () => {
  const [activeProduct, setActiveProduct] = useState<ProductId>("left");
  const currentProduct = PRODUCT_DATA[activeProduct];

  return (
    <section className="relative mt-6 md:mt-8 max-w-7xl mx-auto px-4 md:px-6">
      <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#0a0a0f]">
        <BackgroundGradient product={currentProduct} />

        {/* COMPACT PADDING: p-8/p-12 -> p-6/p-8 */}
        <div className="relative z-10 p-6 md:p-8">
          {/* Header */}
          <div className="mb-4">
            <p className="font-orbitron text-[10px] uppercase tracking-[0.3em] text-cyan-300/80 mb-2">
              Learning Surface
            </p>
            <h2 className="text-2xl md:text-3xl font-light text-white mb-2">
              What We Teach
            </h2>
          </div>

          {/* COMPACT GRID GAP: gap-12 -> gap-8 */}
          <div className="grid lg:grid-cols-2 gap-8 items-center mb-6">
            {/* Left: Visual */}
            <div className="order-2 lg:order-1 w-full">
              <ProductVisual product={currentProduct} isActive={true} />
            </div>

            {/* Right: Details */}
            <div className="order-1 lg:order-2 w-full">
              <ProductDetails product={currentProduct} isActive={true} />
            </div>
          </div>

          {/* Switcher */}
          <div className="flex justify-center pt-2">
            <Switcher activeProduct={activeProduct} onSwitch={setActiveProduct} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpatialProductShowcase;