"use client";

import { motion } from "framer-motion";
import { Radar } from "lucide-react";

export default function ByteMentorPill() {
    return (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="hidden md:flex"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative"
          >
            <div className="flex items-center gap-2 rounded-full app-border bg-transparent px-3 py-1 text-xs font-medium hover:border-amber-400/40 hover:bg-gradient-to-r hover:from-amber-400/10 hover:to-blue-500/10 transition-all duration-300">
              <motion.div
                className="relative"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Radar className="h-4 w-4 text-amber-400" />
              </motion.div>
              <span className="text-xs font-medium text-neutral-900 dark:text-neutral-100">
                ByteMentor
              </span>
              <span className="hidden sm:inline text-neutral-500">AI‑Powered Conversations</span>
            </div>
            
            {/* Animated border glow */}
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-300/30 to-blue-500/30 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: 'linear-gradient(90deg, rgba(255,165,0,0.28) 0%, rgba(59,130,246,0.28) 100%)'
              }}
              animate={{
                opacity: [0.3, 0.7, 0.3],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        </motion.div>
    )
}
