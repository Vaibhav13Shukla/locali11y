"use client";

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import type { ReactNode, ReactElement } from "react";
import { useState, useRef } from "react";

export function FadeIn({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function FadeInView({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: 0.08 },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 16, scale: 0.98 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: "easeOut" } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function HoverCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.18 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function ScaleIn({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function GradientText({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent ${className ?? ""}`}
    >
      {children}
    </span>
  );
}

export function SlideIn({
  children,
  direction = "left",
  delay = 0,
  className,
}: {
  children: ReactNode;
  direction?: "left" | "right" | "up" | "down";
  delay?: number;
  className?: string;
}) {
  const directions = {
    left: { x: -40, y: 0 },
    right: { x: 40, y: 0 },
    up: { x: 0, y: -40 },
    down: { x: 0, y: 40 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...directions[direction] }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function BounceIn({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.3 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Pulse({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      animate={{
        scale: [1, 1.02, 1],
        opacity: [0.7, 1, 0.7],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedBackground({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      animate={{
        backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
      }}
      transition={{
        duration: 15,
        repeat: Infinity,
        ease: "linear",
      }}
      className={`bg-[length:200%_200%] bg-gradient-to-br from-indigo-50 via-white to-purple-50 ${className ?? ""}`}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedBorder({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      animate={{
        backgroundPosition: ["0% 0%", "200% 200%"],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "linear",
      }}
      className={`bg-[length:200%_200%] bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 rounded-2xl p-[2px] ${className ?? ""}`}
    >
      <div className="bg-white rounded-[14px]">
        {children}
      </div>
    </motion.div>
  );
}

export function CountUp({
  end,
  duration = 1,
  className,
}: {
  end: number;
  duration?: number;
  className?: string;
}) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className={className}
    >
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3 }}
      >
        {end}
      </motion.span>
    </motion.span>
  );
}

export function AnimatedListItem({
  children,
  index,
  className,
}: {
  children: ReactNode;
  index: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Shimmer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      animate={{
        backgroundPosition: ["200% 0", "-200% 0"],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "linear",
      }}
      className={`bg-[length:200%_100%] bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 ${className ?? ""}`}
    >
      {children}
    </motion.div>
  );
}

export function ProgressBar({
  progress,
  className,
}: {
  progress: number;
  className?: string;
}) {
  return (
    <div className={`h-2 bg-gray-100 rounded-full overflow-hidden ${className ?? ""}`}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
      />
    </div>
  );
}

export function AnimatedGradientBorder({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative rounded-2xl ${className ?? ""}`}>
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 animate-pulse" />
      <div className="relative rounded-2xl bg-white">
        {children}
      </div>
    </div>
  );
}

export function AnimatedNumber({
  value,
  duration = 1.5,
  className,
  decimals = 0,
}: {
  value: number;
  duration?: number;
  className?: string;
  decimals?: number;
}) {
  const [displayValue, setDisplayValue] = useState(0);
  
  return (
    <motion.span
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={className}
    >
      {value.toFixed(decimals)}
    </motion.span>
  );
}

export function TiltCard({
  children,
  className,
  tiltAmount = 15,
}: {
  children: ReactNode;
  className?: string;
  tiltAmount?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateX = useTransform(y, [-100, 100], [tiltAmount, -tiltAmount]);
  const rotateY = useTransform(x, [-100, 100], [-tiltAmount, tiltAmount]);
  
  const springConfig = { stiffness: 300, damping: 30 };
  const rotateXSpring = useSpring(rotateX, springConfig);
  const rotateYSpring = useSpring(rotateY, springConfig);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };
  
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };
  
  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: rotateXSpring,
        rotateY: rotateYSpring,
        transformStyle: "preserve-3d",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SpotlightCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };
  
  return (
    <div
      className={`relative overflow-hidden rounded-2xl ${className ?? ""}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(99, 102, 241, 0.15) 0%, transparent 50%)`,
        }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}

export function MagneticWrap({
  children,
  className,
}: {
  children: ReactElement;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springConfig = { stiffness: 300, damping: 20 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.3);
    y.set((e.clientY - centerY) * 0.3);
  };
  
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };
  
  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: xSpring, y: ySpring }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function WordReveal({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const words = text.split(" ");
  
  return (
    <span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: delay + i * 0.05 }}
          style={{ display: "inline-block", marginRight: "0.25em" }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

export function ScrollProgress({
  className,
}: {
  className?: string;
}) {
  const [progress, setProgress] = useState(0);
  
  return (
    <motion.div
      className={`h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 ${className ?? ""}`}
      style={{ scaleX: progress, transformOrigin: "left" }}
    />
  );
}

export function GradientBlobs({
  className,
}: {
  className?: string;
}) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className ?? ""}`}>
      <motion.div
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          x: [0, -30, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-300/30 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          x: [0, 20, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/2 right-1/3 w-64 h-64 bg-fuchsia-300/20 rounded-full blur-3xl"
      />
    </div>
  );
}

export function FloatingElement({
  children,
  className,
  floatDistance = 10,
  duration = 3,
}: {
  children: ReactNode;
  className?: string;
  floatDistance?: number;
  duration?: number;
}) {
  return (
    <motion.div
      animate={{
        y: [0, -floatDistance, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function MarqueeText({
  text,
  className,
  speed = 30,
}: {
  text: string;
  className?: string;
  speed?: number;
}) {
  return (
    <div className={`overflow-hidden ${className ?? ""}`}>
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: "linear",
        }}
        className="whitespace-nowrap"
      >
        <span className="inline-block">{text}</span>
        <span className="inline-block mx-4">•</span>
        <span className="inline-block">{text}</span>
        <span className="inline-block mx-4">•</span>
      </motion.div>
    </div>
  );
}
