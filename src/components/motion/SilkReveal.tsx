'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const SILK_EASE: readonly [number, number, number, number] = [
  0.16, 1, 0.3, 1,
];

interface SilkRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'left' | 'scale';
}

/**
 * Hydration-safe scroll-triggered silk reveal (cubic-bezier 0.16, 1, 0.3, 1).
 * Renders identical DOM markup on server and client to avoid React hydration mismatches.
 */
export function SilkReveal({
  children,
  className = '',
  delay = 0,
  direction = 'up',
}: SilkRevealProps) {
  const initialVariant =
    direction === 'left'
      ? { opacity: 0.01, x: -28 }
      : direction === 'scale'
        ? { opacity: 0.01, scale: 0.96 }
        : { opacity: 0.01, y: 24 };

  return (
    <motion.div
      initial={initialVariant}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.85, delay, ease: SILK_EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
