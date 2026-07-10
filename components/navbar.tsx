'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="sticky top-0 z-50"
      style={{
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        background: 'rgba(5, 5, 5, 0.85)',
        borderBottom: '1px solid rgba(0, 194, 255, 0.12)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[68px] flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <Image src="/agora-logo-mark.svg" alt="Agora" width={32} height={32} />
          <span className="font-display font-bold text-[15px] tracking-tight" style={{ color: '#FFFFFF' }}>
            Mentor
          </span>
        </div>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { label: 'GitHub', href: 'https://github.com/anandwana001/agora-mentor-extension-website' },
            { label: 'Changelog', href: 'https://github.com/anandwana001/agora-mentor-extension-website/releases' },
          ].map(link => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm transition-colors"
              style={{ color: '#888888' }}
              onMouseEnter={e => ((e.target as HTMLElement).style.color = '#FFFFFF')}
              onMouseLeave={e => ((e.target as HTMLElement).style.color = '#888888')}
            >
              {link.label}
            </a>
          ))}
          <div className="relative">
            <button
              disabled
              className="btn-primary px-5 py-2 text-sm opacity-60 cursor-not-allowed"
            >
              Coming Soon
            </button>
            <span
              className="absolute -top-2 -right-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
              style={{ background: '#fbbf24', color: '#000' }}
            >
              v0.1
            </span>
          </div>
        </div>

        {/* Mobile */}
        <div className="md:hidden">
          <button disabled className="btn-primary px-4 py-2 text-sm opacity-60 cursor-not-allowed">
            Coming Soon
          </button>
        </div>
      </div>
    </motion.nav>
  )
}
