"use client";
import React from "react";
import { motion } from "framer-motion";
import { LampContainer } from "../ui/lamp";
import { CoverDemo } from "./callpreloader";

export function LampDemo() {
  return (
    (<LampContainer>
      <motion.h1
        initial={{ opacity: 0.5, x:100  }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
          
        }}
        style={{
            display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
       
        width:"100%",
        height: "100%",
        position: "absolute",
        left:"15%"
        }}
        className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl">
        <CoverDemo/>
      </motion.h1>
    </LampContainer>)
  );
}
