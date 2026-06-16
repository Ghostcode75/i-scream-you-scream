import { IconLock } from "@tabler/icons-react";

export default function Footer() {
  return (
    <footer className="pt-4 pb-8 px-4">
      {/* Wave divider */}
      <div className="max-w-lg mx-auto mb-3 overflow-hidden">
        <svg viewBox="0 0 400 12" preserveAspectRatio="none" className="w-full h-3 animate-wave">
          <path
            d="M0 6 Q50 0 100 6 T200 6 T300 6 T400 6"
            fill="none"
            stroke="#6EC6CE"
            strokeWidth="1.5"
            opacity="0.3"
          />
        </svg>
      </div>
      <p className="text-center text-xs text-[#8A9BA8] mb-4">
        Built with love for Cedar City by{" "}
        <a
          href="https://cedarcitywebdesign.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-[#3A2D1E] hover:text-[#6EC6CE] transition"
        >
          Cedar City Web Design
        </a>
      </p>
      <div className="text-center">
        <a
          href="/operator"
          className="inline-flex items-center gap-1.5 text-xs text-[#B0BEC5] hover:text-[#6EC6CE] transition font-medium"
        >
          <IconLock size={12} />
          Operator Login
        </a>
      </div>
    </footer>
  );
}
