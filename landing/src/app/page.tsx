"use client";

import { motion } from "framer-motion";
import { ArrowRight, Search, Zap, BookOpen, Clock, PlayCircle, BarChart2 } from "lucide-react";
import React from "react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="max-w-[1200px] mx-auto px-6 h-20 flex items-center justify-between">
        <div className="font-sohne font-medium text-[16px] text-ink-black flex items-center gap-2">
          <div className="w-5 h-5 bg-ink-black rounded-full" />
          Yellow.ai Nexus
        </div>
        <div className="hidden md:flex gap-8 font-sohne text-[16px] text-ink-black">
          <a href="#pipeline" className="hover:text-slate-gray transition-colors py-[2px]">Pipeline</a>
          <a href="#operator" className="hover:text-slate-gray transition-colors py-[2px]">Operator Desk</a>
          <a href="#impact" className="hover:text-slate-gray transition-colors py-[2px]">Impact</a>
        </div>
        <div className="flex items-center gap-4">
          <a href="#" className="font-sohne text-[16px] text-ink-black hover:underline underline-offset-4 py-5">Log in →</a>
          <a href="#" className="font-sohne text-[16px] bg-ink-black text-paper-white px-5 py-0 rounded-full border border-ink-black transition-transform hover:scale-105">
            Get started
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-[1200px] mx-auto px-6 pt-24 pb-20 relative flex flex-col items-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-signifier text-[44px] md:text-[90px] leading-[1.1] tracking-[-1.5px] md:tracking-[-2.25px] text-ink-black text-center max-w-4xl z-10"
        >
          Evaluate. Verify. <span className="italic">Decide.</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="font-sohne text-[17px] md:text-[20px] text-slate-gray mt-6 text-center max-w-2xl z-10"
        >
          The automated pipeline and human-in-the-loop Operator Desk for conversational AI. Run thousands of checks, verify against golden sets, and empower managers with tracing data.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap justify-center gap-4 mt-10 z-10"
        >
          <a href="#" className="font-sohne text-[16px] bg-ink-black text-paper-white px-5 py-0 rounded-full flex items-center hover:bg-gray-800 transition-colors">
            View the Demo
          </a>
          <a href="#" className="font-sohne text-[16px] bg-transparent text-ink-black border border-ink-black px-5 py-0 rounded-full flex items-center hover:bg-mist-gray transition-colors">
            Read Docs
          </a>
        </motion.div>

        {/* Floating Product Artifacts Collage */}
        <div className="relative w-full h-[400px] mt-16 max-w-5xl">
          {/* Left Table Artifact */}
          <motion.div 
            initial={{ opacity: 0, x: -30, y: 30 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="absolute left-0 md:left-10 top-0 bg-paper-white rounded-2xl-2 pt-4 pr-5 pb-3 pl-3 shadow-subtle-3 border border-mist-gray w-[320px] z-20"
          >
            <div className="font-sohne font-medium text-[20px] text-ink-black mb-1">Cold Run Coverage</div>
            <div className="font-sohne text-[14px] text-slate-gray mb-4">12 flows tested today</div>
            <div className="space-y-3">
              {[
                { flow: "Authentication", stat: "100%", ok: true },
                { flow: "Checkout", stat: "98%", ok: true },
                { flow: "Refunds", stat: "42%", ok: false }
              ].map((row, i) => (
                <div key={i} className="flex justify-between items-center text-[15px] font-sohne">
                  <span className="text-ink-black">{row.flow}</span>
                  <span className={row.ok ? "text-ink-black" : "text-[#C9372C] font-medium"}>{row.stat}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right AI Composer / Terminal Artifact */}
          <motion.div 
            initial={{ opacity: 0, x: 30, y: 40 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="absolute right-0 md:right-10 top-20 bg-paper-white rounded-2xl-2 pt-4 pr-5 pb-3 pl-3 shadow-subtle-3 border border-mist-gray w-[340px] z-20"
          >
            <div className="flex gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-[#C9372C]/20" />
              <div className="w-3 h-3 rounded-full bg-[#FFC82C]/40" />
              <div className="w-3 h-3 rounded-full bg-[#1F845A]/20" />
            </div>
            <div className="font-mono text-[14px] text-ink-black space-y-2">
              <p className="text-slate-gray">$ python3 run.py --kit demo</p>
              <p>Analyzing 14,203 logs...</p>
              <p>Finding root causes...</p>
              <p className="font-medium">» Generated loop-report.json</p>
            </div>
          </motion.div>

          {/* Center Bottom Operator Action Artifact */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="absolute left-1/2 -translate-x-1/2 bottom-0 bg-paper-white rounded-2xl-2 pt-4 pr-5 pb-3 pl-3 shadow-subtle-3 border border-mist-gray w-[400px] z-30"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center font-sohne font-medium text-[#C9372C]">
                !
              </div>
              <div>
                <div className="font-sohne text-[16px] text-ink-black">Needs Attention</div>
                <div className="font-signifier text-[18px] text-ink-black mt-1">Fallback loop detected in Returns</div>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button className="flex-1 bg-[#1F845A] text-white rounded-full py-2 font-sohne text-[14px]">Accept</button>
              <button className="flex-1 bg-[#C9372C] text-white rounded-full py-2 font-sohne text-[14px]">Reject</button>
              <button className="flex-1 bg-mist-gray text-ink-black rounded-full py-2 font-sohne text-[14px]">Defer</button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Section 1 (Fog White Background) */}
      <section id="pipeline" className="bg-fog-white py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="font-signifier text-[44px] md:text-[64px] tracking-[-0.96px] text-ink-black text-center mb-6">
            A deterministic pipeline.
          </h2>
          <p className="font-sohne text-[18px] text-slate-gray text-center max-w-2xl mx-auto mb-16">
            LLMs are not used for finding problems. The pipeline folds facts, detects coverage gaps, and verifies fixes with mathematical precision.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-mist-gray rounded-3xl py-8 px-5">
              <div className="font-sohne text-[14px] text-ash-gray mb-8">Step 1</div>
              <h3 className="font-sohne text-[22px] font-medium text-ink-black mb-3">Cold Run</h3>
              <p className="font-sohne text-[16px] text-ink-black leading-relaxed">
                Evaluates agent logic, folds facts, and finds coverage gaps across thousands of logs without running a single LLM prompt for detection.
              </p>
            </div>
            <div className="bg-mist-gray rounded-3xl py-8 px-5">
              <div className="font-sohne text-[14px] text-ash-gray mb-8">Step 2</div>
              <h3 className="font-sohne text-[22px] font-medium text-ink-black mb-3">Replay Service</h3>
              <p className="font-sohne text-[16px] text-ink-black leading-relaxed">
                Verifies proposed fixes against ground truth and generates before/after impact bars mathematically.
              </p>
            </div>
            <div className="bg-mist-gray rounded-3xl py-8 px-5">
              <div className="font-sohne text-[14px] text-ash-gray mb-8">Step 3</div>
              <h3 className="font-sohne text-[22px] font-medium text-ink-black mb-3">The Operator Desk</h3>
              <p className="font-sohne text-[16px] text-ink-black leading-relaxed">
                Human managers review organized panes: "Needs Attention", "Dismissed Signals", and "No Measurement".
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Accent Section */}
      <section className="bg-paper-white py-20">
        <div className="max-w-[1000px] mx-auto px-6">
          <div className="bg-blush-peach rounded-3xl p-10">
            <h2 className="font-sohne text-[26px] md:text-[32px] font-medium text-sienna-brown tracking-[-0.23px] mb-6 leading-tight max-w-2xl">
              "We replaced subjective LLM grades with a deterministic replay service. Now, every approval is backed by an immutable before/after delta."
            </h2>
            <p className="font-sohne text-[18px] text-sienna-brown/80 mb-2">— Nexus Engineering</p>
          </div>
        </div>
      </section>

      {/* Feature Section 2 */}
      <section id="operator" className="bg-fog-white py-20">
        <div className="max-w-[1200px] mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="font-signifier text-[44px] md:text-[64px] tracking-[-0.96px] text-ink-black mb-6 leading-tight">
              Human in the loop.
            </h2>
            <p className="font-sohne text-[18px] text-slate-gray mb-10 leading-relaxed">
              The Operator Desk is designed around manager psychology. No ambiguous buttons. A strict "Accept, Reject, Defer" gate that forces reasoned decisions.
            </p>
            <ul className="space-y-6">
              {[
                { title: "Manager English", desc: "Complex technical jargon is translated into clear language for non-technical approvers." },
                { title: "Signed Copy", desc: "One click generates a fixed, plain-text hand-off note, ensuring no context is lost." },
                { title: "Impact KPIs", desc: "See the exact impact of a fix with front-and-center cost warnings and resolution rates." }
              ].map((f, i) => (
                <li key={i} className="flex gap-4">
                  <div className="mt-1 w-6 h-6 rounded-full bg-mist-gray flex items-center justify-center shrink-0">
                    <div className="w-2 h-2 bg-ink-black rounded-full" />
                  </div>
                  <div>
                    <h4 className="font-sohne text-[17px] font-medium text-ink-black">{f.title}</h4>
                    <p className="font-sohne text-[15px] text-slate-gray mt-1">{f.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            {/* Visual Artifact */}
            <div className="bg-paper-white rounded-2xl-2 pt-4 pr-5 pb-3 pl-3 shadow-subtle-2 border border-mist-gray">
              <div className="flex justify-between items-center border-b border-mist-gray pb-4 mb-4">
                <div className="font-sohne text-[14px] text-ash-gray">Signed Copy Handoff</div>
                <button className="font-sohne text-[14px] bg-ink-black text-paper-white px-5 py-0 rounded-full leading-none">Copy</button>
              </div>
              <div className="font-mono text-[13px] text-ink-black leading-relaxed bg-mist-gray p-4 rounded-xl">
                [DECISION: REJECT]<br/><br/>
                Reason: The fallback loop is still triggering on multi-turn intents.<br/><br/>
                Impact: 42% resolution rate (vs 98% baseline).<br/>
                Path: /flows/returns/auth<br/><br/>
                Please escalate to engineering.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-paper-white pt-20 pb-10 text-center border-t border-mist-gray">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="font-signifier text-[44px] tracking-[-0.66px] text-ink-black mb-6">
            Secure your AI deployments.
          </h2>
          <p className="font-sohne text-[20px] text-slate-gray mb-10">
            Explore the repository to run the cold pipeline and spin up the Operator Desk locally.
          </p>
          <a href="https://github.com/6sLOGAN78/yellow-ai" className="inline-block font-sohne text-[16px] bg-ink-black text-paper-white px-5 py-0 rounded-full transition-transform hover:scale-105">
            Explore GitHub Repository
          </a>
          
          <div className="mt-32 pt-8 border-t border-mist-gray flex flex-wrap justify-between items-center gap-6 font-sohne text-[15px] text-slate-gray">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-ink-black rounded-full" />
              Yellow.ai Nexus
            </div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-ink-black py-[2px]">Solution Overview</a>
              <a href="#" className="hover:text-ink-black py-[2px]">UX Psychology</a>
              <a href="#" className="hover:text-ink-black py-[2px]">API Contract</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
