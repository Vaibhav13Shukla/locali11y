export const tokens = {
  colors: {
    brand: {
      primary: "#4F46E5",
      secondary: "#7C3AED",
      accent: "#C026D3",
      gradient: {
        start: "#4F46E5",
        mid: "#7C3AED",
        end: "#C026D3",
      },
    },
    score: {
      excellent: "#059669",
      good: "#10B981",
      warning: "#F59E0B",
      danger: "#EF4444",
      critical: "#DC2626",
    },
    surface: {
      primary: "#FFFFFF",
      secondary: "#F9FAFB",
      tertiary: "#F3F4F6",
      elevated: "#FFFFFF",
    },
    border: {
      subtle: "#F3F4F6",
      default: "#E5E7EB",
      strong: "#D1D5DB",
      focus: "#818CF8",
    },
    text: {
      primary: "#111827",
      secondary: "#6B7280",
      tertiary: "#9CA3AF",
      inverse: "#FFFFFF",
      link: "#4F46E5",
    },
  },
  spacing: {
    section: "py-20 md:py-28",
    container: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
    card: "p-6 md:p-8",
  },
  radius: {
    sm: "rounded-lg",
    md: "rounded-xl",
    lg: "rounded-2xl",
    xl: "rounded-3xl",
    full: "rounded-full",
  },
  shadow: {
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg shadow-indigo-100/20",
    xl: "shadow-xl shadow-indigo-100/30",
    glow: "shadow-lg shadow-indigo-500/20",
    glowStrong: "shadow-xl shadow-indigo-500/30",
  },
  animation: {
    fast: "duration-150",
    normal: "duration-200",
    slow: "duration-300",
    spring: { type: "spring" as const, stiffness: 260, damping: 20 },
    springGentle: { type: "spring" as const, stiffness: 180, damping: 22 },
    springBouncy: { type: "spring" as const, stiffness: 400, damping: 15 },
    easeOut: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
} as const;

export function getScoreColor(score: number): string {
  if (score >= 90) return tokens.colors.score.excellent;
  if (score >= 80) return tokens.colors.score.good;
  if (score >= 60) return tokens.colors.score.warning;
  return tokens.colors.score.danger;
}

export function getScoreLabel(score: number): string {
  if (score >= 90) return "Excellent";
  if (score >= 80) return "Good";
  if (score >= 60) return "Needs work";
  return "Critical";
}
