'use client'

import { motion } from 'framer-motion'

const barHeights: number[][] = [
  [4, 16, 8, 20, 6],
  [10, 24, 14, 18, 8],
  [16, 10, 28, 12, 22],
  [6, 20, 10, 26, 8],
  [22, 8, 18, 6, 24],
  [4, 26, 12, 20, 10],
  [18, 12, 22, 8, 16],
  [8, 24, 10, 18, 12],
  [14, 6, 20, 16, 8],
  [4, 18, 8, 22, 14],
  [20, 10, 16, 4, 22],
  [6, 22, 12, 18, 8],
  [18, 8, 20, 12, 6],
  [10, 20, 6, 18, 24],
  [4, 12, 22, 8, 18],
  [16, 6, 24, 10, 4],
  [8, 20, 14, 6, 22],
  [12, 4, 18, 22, 8],
  [20, 14, 6, 18, 12],
  [4, 22, 10, 16, 20],
]

export function Waveform() {
  return (
    <div className="flex items-end gap-[3px] h-8">
      {barHeights.map((heights, i) => (
        <motion.div
          key={i}
          className="rounded-full"
          style={{
            width: '3px',
            background:
              i % 3 === 0
                ? '#099DFD'
                : i % 3 === 1
                ? '#4DC4FF'
                : 'rgba(9,157,253,0.4)',
          }}
          animate={{
            height: heights.map(h => `${h}px`),
          }}
          transition={{
            duration: 1.2 + (i % 4) * 0.2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.05,
          }}
        />
      ))}
    </div>
  )
}
