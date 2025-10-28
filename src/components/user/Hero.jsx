import React from "react";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <>
      {/* Hero Section */}
      <section
        className="relative min-h-[90vh] w-full overflow-hidden mt-15"
        style={{
          backgroundImage: "url('/assets/images/hero_bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Content */}
        <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-6 pt-40 pb-20 text-center text-white">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs uppercase tracking-widest backdrop-blur-sm">
            new season <span className="h-1 w-1 rounded-full bg-emerald-400" /> now live
          </span>

          <h1 className="text-3xl font-bold leading-tight md:text-5xl lg:text-6xl">
            Elevate Your Style with <span className="text-blue-500">Bold</span> Designs
          </h1>

          <p className="mt-4 max-w-2xl text-base text-white/80 md:text-lg">
            Premium picks, crafted for performance and everyday wear. Explore fresh
            drops, limited runs, and fan-favorite essentials.
          </p>

          {/* CTA */}
          <div className="mt-10">
            <button className="group inline-flex items-center gap-2 rounded-lg border border-white/30 bg-black/60 px-6 py-2.5 text-sm font-medium text-white shadow-sm backdrop-blur-md transition cursor-pointer hover:bg-white/10 hover:border-white/50">
              <span onClick={() => navigate("/products/all")}>
                Explore Collection
              </span>
              <svg
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
