import Link from "next/link";
import React from "react";
import Particles from "./components/particles";

const navigation = [
  { name: "Projects", href: "/projects" },
  { name: "Contact", href: "/contact" },
];

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen overflow-hidden bg-gradient-to-tl from-black via-zinc-600/20 to-black">
      <nav className="my-16 animate-fade-in">
        <ul className="flex items-center justify-center gap-24">
          {navigation.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="group relative inline-flex items-center justify-center px-7 py-4 text-lg font-medium text-zinc-800 bg-white/90 backdrop-blur-sm rounded-full border border-white/20 shadow-lg transition-all duration-300 ease-out hover:bg-white hover:scale-105 hover:shadow-xl active:scale-95 active:shadow-md"
              >
                <span className="relative z-10 transition-colors duration-300 group-hover:text-zinc-900">
                  {item.name}
                </span>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/20 to-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="hidden w-screen h-px animate-glow md:block animate-fade-left bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0" />
      <Particles
        className="absolute inset-0 -z-10 animate-fade-in"
        quantity={100}
      />
      <h1 className="py-3.5 px-0.5 z-10 text-4xl text-transparent duration-1000 bg-white cursor-default text-edge-outline animate-title font-display sm:text-6xl md:text-9xl whitespace-nowrap bg-clip-text ">
        Sai Teja
      </h1>

      <div className="hidden w-screen h-px animate-glow md:block animate-fade-right bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0" />
      <div className="my-16 text-center animate-fade-in max-w-2xl px-4">
        <h2 className="text-sm text-zinc-400 leading-relaxed text-justify">
          Computer Science student at VIT with experience in web development, AI automation, and full-stack applications. Skilled in technologies from React frontends to LangChain pipelines, I am driven by building solutions that deliver real impact. Outside of tech, I am passionate about Formula 1 and automotive engineering and enjoy connecting with like-minded professionals.
        </h2>
      </div>
    </div>
  );
}
