'use client'

import { useRef, useEffect, useState } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useMotionValue,
  useSpring,
  animate,
} from 'framer-motion'
import {
  Zap,
  Shield,
  Code2,
  Mic,
  MessageSquare,
  SignalHigh,
  StopCircle,
  Lock,
  CheckCircle2,
  ArrowRight,
  Layers,
  ChevronDown,
  ExternalLink,
} from 'lucide-react'
import Image from 'next/image'
import { Navbar } from '@/components/navbar'
import { AuroraMesh } from '@/components/aurora-mesh'
import { Waveform } from '@/components/waveform'
import { ScrollProgress } from '@/components/scroll-progress'

const B = '#099DFD'
const BL = '#4DC4FF'

const metrics = [
  { value: '100', prefix: '< ', suffix: 'ms', label: 'Audio latency', sub: 'via Agora RTC' },
  { value: '5', prefix: '', suffix: '', label: 'Focus modes', sub: 'Explain to Write Tests' },
  { value: '∞', prefix: '', suffix: '', label: 'Languages', sub: 'Any VS Code can open' },
  { value: '0', prefix: '', suffix: '', label: 'Data stored', sub: 'Sessions are ephemeral' },
]

const steps = [
  {
    n: '01',
    title: 'Create a free Agora account',
    description: 'Sign up at console.agora.io — no credit card required. Create a new project, then copy your App ID and App Certificate from the project settings.',
    icon: Zap,
    link: { label: 'Sign up free →', href: 'https://sso2.agora.io/en/signup?' },
  },
  {
    n: '02',
    title: 'Paste credentials into VS Code',
    description: 'Open VS Code Settings (⌘, or Ctrl+,) and search "Agora Mentor". Paste your App ID and App Certificate. That\'s the only config you need.',
    icon: Code2,
    link: null,
  },
  {
    n: '03',
    title: 'Select code and start talking',
    description: 'Highlight any code, open the Agora Mentor panel, choose a focus mode, then click "Open Mic in Browser". A live voice session starts in seconds.',
    icon: Mic,
    link: null,
  },
]

const modelStack = [
  { role: 'STT', provider: 'Deepgram' },
  { role: 'LLM', provider: 'OpenAI GPT-4o' },
  { role: 'TTS', provider: 'MiniMax' },
  { role: 'Voice', provider: 'OpenAI Realtime' },
]

const roadmap = [
  'AssemblyAI', 'Anthropic Claude', 'ElevenLabs', 'Gemini Live',
  'Google STT', 'Cartesia', 'xAI Grok', 'Azure OpenAI',
]

const quickStart = [
  {
    title: 'Step 1 — Create a free Agora account & project',
    tokens: [
      { text: '1. Go to ', color: '#888888' },
      { text: 'console.agora.io', color: '#099DFD' },
      { text: ' and sign up (free, no credit card)\n', color: '#888888' },
      { text: '2. Click ', color: '#888888' },
      { text: '"New Project"', color: '#FFFFFF' },
      { text: ' → name it anything → Save\n', color: '#888888' },
      { text: '3. Copy your ', color: '#888888' },
      { text: 'App ID', color: '#4DC4FF' },
      { text: ' and ', color: '#888888' },
      { text: 'App Certificate', color: '#4DC4FF' },
      { text: ' from the project page', color: '#888888' },
    ],
  },
  {
    title: 'Step 2 — Add credentials to VS Code Settings',
    tokens: [
      { text: '{\n', color: '#FFFFFF' },
      { text: '  "agoraMentor.appId"', color: '#099DFD' },
      { text: ': ', color: '#888888' },
      { text: '"paste-your-app-id-here"', color: '#86efac' },
      { text: ',\n  ', color: '#FFFFFF' },
      { text: '"agoraMentor.appCertificate"', color: '#099DFD' },
      { text: ': ', color: '#888888' },
      { text: '"paste-your-certificate-here"\n', color: '#86efac' },
      { text: '}', color: '#FFFFFF' },
    ],
  },
  {
    title: 'Step 3 — Install extension & open the panel',
    tokens: [
      { text: '// Coming soon to VS Code Marketplace\n', color: '#555555' },
      { text: '// In the meantime: star the repo to get notified\n\n', color: '#555555' },
      { text: '// Then in VS Code:\n', color: '#555555' },
      { text: '1. ', color: '#888888' },
      { text: 'Select', color: '#4DC4FF' },
      { text: ' any code in the editor\n', color: '#888888' },
      { text: '2. Open ', color: '#888888' },
      { text: 'Agora Mentor', color: '#099DFD' },
      { text: ' panel (sidebar)\n', color: '#888888' },
      { text: '3. Pick a focus → click ', color: '#888888' },
      { text: '"Open Mic in Browser"', color: '#FFFFFF' },
    ],
  },
]

const faqs = [
  {
    q: 'Is my code safe? Does Agora Mentor store anything?',
    a: 'No. Sessions are completely ephemeral — your code is sent to the AI model for processing and is not stored anywhere. Once you close the session, nothing persists. The extension is open source so you can verify this yourself.',
  },
  {
    q: 'How much does it cost to use?',
    a: 'The extension itself is free and open source. You pay Agora for Conversational AI Engine usage at $0.10/minute — a typical 5-minute code review session costs $0.50. For context, 20 sessions/month ≈ $10, comparable to other AI dev tools but pay-as-you-go with no subscription.',
  },
  {
    q: 'Do I need to create an Agora account?',
    a: 'Yes — Agora Mentor uses your own Agora credentials so all usage is billed directly to you with full transparency. Sign up free at console.agora.io (no credit card required to create an account), create a project, and paste your App ID and App Certificate into VS Code Settings.',
  },
  {
    q: 'When will it be on the VS Code Marketplace?',
    a: 'We\'re in active development and targeting a marketplace release soon. Star the GitHub repo to get notified the moment it\'s available.',
  },
  {
    q: 'What programming languages are supported?',
    a: 'Any language VS Code can open — TypeScript, JavaScript, Python, Go, Rust, Swift, Kotlin, Java, C++, and more. The AI model understands the language from context automatically.',
  },
  {
    q: 'Can I use it without speaking? Is text chat supported?',
    a: 'Yes. Agora Mentor supports both voice sessions (via "Open Mic in Browser") and text chat (via "Open Chat"). You can type your questions and read the AI\'s responses if you prefer not to speak.',
  },
]

// ── helpers ──────────────────────────────────────────────────────────────────

function SplitWords({
  text, className, style, baseDelay = 0,
}: {
  text: string; className?: string; style?: React.CSSProperties; baseDelay?: number
}) {
  const words = text.split(' ')
  return (
    <span className={className} style={style}>
      {words.map((word, i) => (
        <span key={i} style={{ display: 'inline-block' }}>
          <span style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}>
            <motion.span
              style={{ display: 'inline-block' }}
              variants={{
                hidden: { y: '110%', opacity: 0, skewY: 4 },
                visible: { y: 0, opacity: 1, skewY: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: baseDelay + i * 0.07 } },
              }}
            >
              {word}
            </motion.span>
          </span>
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </span>
  )
}

function CountUp({ target, prefix = '', suffix = '' }: { target: string; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const num = parseInt(target, 10)
  const mv = useMotionValue(0)
  const spring = useSpring(mv, { stiffness: 60, damping: 20 })

  useEffect(() => {
    if (isInView && !isNaN(num)) animate(mv, num, { duration: 1.6, ease: 'easeOut' })
  }, [isInView, num, mv])

  if (isNaN(num)) {
    return (
      <motion.span ref={ref} initial={{ opacity: 0, scale: 0.6 }} animate={isInView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
        {prefix}{target}{suffix}
      </motion.span>
    )
  }
  return (
    <span ref={ref}>
      {prefix}
      <motion.span>{useTransform(spring, (v) => Math.round(v).toString())}</motion.span>
      {suffix}
    </span>
  )
}

function Marquee({ items }: { items: string[] }) {
  const doubled = [...items, ...items]
  return (
    <div className="overflow-hidden w-full">
      <motion.div className="flex gap-3" style={{ width: 'max-content' }} animate={{ x: ['0%', '-50%'] }} transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}>
        {doubled.map((item, i) => (
          <div key={i} className="text-sm py-2 px-4 rounded-lg whitespace-nowrap flex-shrink-0" style={{ color: '#888888', background: 'rgba(9,157,253,0.05)', border: '1px solid rgba(9,157,253,0.12)' }}>
            {item}
          </div>
        ))}
      </motion.div>
    </div>
  )
}

const filePaths = [
  { label: 'Agora Mentor', path: 'src/hooks/useAuth.ts' },
  { label: 'Agora Mentor', path: 'src/api/client.ts' },
  { label: 'Agora Mentor', path: 'src/utils/validate.ts' },
  { label: 'Agora Mentor', path: 'src/components/Dashboard.tsx' },
]

function TypewriterPath() {
  const [fileIdx, setFileIdx] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [phase, setPhase] = useState<'typing' | 'hold' | 'deleting'>('typing')

  useEffect(() => {
    const full = filePaths[fileIdx].path
    let t: ReturnType<typeof setTimeout>
    if (phase === 'typing') {
      if (displayed.length < full.length) t = setTimeout(() => setDisplayed(full.slice(0, displayed.length + 1)), 55)
      else t = setTimeout(() => setPhase('hold'), 2000)
    } else if (phase === 'hold') {
      t = setTimeout(() => setPhase('deleting'), 400)
    } else {
      if (displayed.length > 0) t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 28)
      else { setFileIdx((i) => (i + 1) % filePaths.length); setPhase('typing') }
    }
    return () => clearTimeout(t)
  }, [displayed, phase, fileIdx])

  return (
    <span className="font-mono text-xs" style={{ color: '#555555' }}>
      <span style={{ color: '#888888' }}>{filePaths[fileIdx].label}</span>
      <span style={{ color: '#444444' }}> · </span>
      {displayed}
      <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.9, repeat: Infinity, ease: 'steps(1)' }} style={{ color: '#099DFD', marginLeft: '1px' }}>|</motion.span>
    </span>
  )
}

function CodeLine({ tokens }: { tokens: { text: string; color: string }[] }) {
  return (
    <pre className="code-block p-4 text-sm overflow-x-auto whitespace-pre-wrap break-words">
      <code>{tokens.map((t, i) => <span key={i} style={{ color: t.color }}>{t.text}</span>)}</code>
    </pre>
  )
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <motion.div
      className="glass-card overflow-hidden cursor-pointer"
      onClick={() => setOpen(!open)}
      whileHover={{ borderColor: 'rgba(9,157,253,0.3)' }}
    >
      <div className="flex items-center justify-between gap-4 p-6">
        <span className="text-sm font-semibold leading-snug" style={{ color: '#FFFFFF' }}>{q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }} className="flex-shrink-0">
          <ChevronDown className="w-4 h-4" style={{ color: B }} />
        </motion.div>
      </div>
      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        style={{ overflow: 'hidden' }}
      >
        <p className="px-6 pb-6 text-sm leading-relaxed" style={{ color: '#888888' }}>{a}</p>
      </motion.div>
    </motion.div>
  )
}

// ── page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const panelY = useTransform(heroScroll, [0, 1], ['0px', '-80px'])
  const panelScale = useTransform(heroScroll, [0, 1], [1, 0.92])
  const panelOpacity = useTransform(heroScroll, [0, 0.7], [1, 0])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ScrollProgress />
      <AuroraMesh />
      <Navbar />

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative z-10 min-h-[92vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden pt-16 pb-0">
        <div className="max-w-5xl mx-auto text-center w-full">

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{ border: `1px solid rgba(9,157,253,0.35)`, background: 'rgba(9,157,253,0.08)' }}
          >
            <span className="text-base leading-none">🎙️</span>
            <span className="section-label tracking-widest">Voice + Text AI code review · VS Code extension</span>
          </motion.div>

          {/* Coming soon badge */}
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="flex justify-center mb-10"
          >
            <span
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{ background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.35)', color: '#fbbf24' }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#fbbf24' }} />
              Coming soon to VS Code Marketplace — star the repo to get notified
            </span>
          </motion.div>

          <motion.div initial="hidden" animate="visible">
            <h1 className="font-display font-bold leading-[0.92] tracking-[-0.04em] mb-4 text-balance" style={{ fontSize: 'clamp(56px, 9vw, 108px)', color: '#FFFFFF' }}>
              <SplitWords text="Talk to your code." baseDelay={0.2} />
            </h1>
            <h2 className="gradient-text font-display font-bold leading-[0.92] tracking-[-0.04em] mb-8 text-balance" style={{ fontSize: 'clamp(48px, 7.5vw, 88px)' }}>
              <SplitWords text="Get answers instantly." baseDelay={0.45} />
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.6 }}
            className="text-lg sm:text-xl mb-10 max-w-2xl mx-auto leading-relaxed" style={{ color: '#888888' }}
          >
            Select any code in VS Code, pick a focus — explain, debug, refactor — then speak or type.
            Agora Mentor connects you to an AI mentor in seconds via voice or text chat.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 justify-center mb-16"
          >
            <a
              href="https://github.com/anandwana001/agora-mentor-vscode"
              target="_blank" rel="noopener noreferrer"
              className="btn-primary px-8 py-4 text-base"
            >
              ⭐ Star on GitHub
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="https://sso2.agora.io/en/signup?"
              target="_blank" rel="noopener noreferrer"
              className="btn-ghost px-8 py-4 text-base"
            >
              Create Free Agora Account
            </a>
          </motion.div>

          {/* Hero panel */}
          <motion.div className="hero-panel max-w-2xl mx-auto pb-0" style={{ y: panelY, scale: panelScale, opacity: panelOpacity }}>
            <div className="shimmer-panel-wrapper">
              <div className="shimmer-panel-inner">
                <div className="flex items-center gap-2 px-4 py-3" style={{ background: '#030303', borderBottom: '1px solid rgba(9,157,253,0.1)' }}>
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full" style={{ background: '#FF5F57' }} />
                    <div className="w-3 h-3 rounded-full" style={{ background: '#FEBC2E' }} />
                    <div className="w-3 h-3 rounded-full" style={{ background: '#28C840' }} />
                  </div>
                  <span className="mx-auto"><TypewriterPath /></span>
                </div>
                <div className="p-6 text-left">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                      <Image src="/agora-logo-mark.svg" alt="Agora" width={20} height={20} />
                      <span className="font-display font-bold text-sm" style={{ color: '#FFFFFF' }}>Mentor</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs" style={{ color: '#4ade80' }}>
                      <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#4ade80' }} />
                      Live
                    </div>
                  </div>
                  <div className="rounded-lg p-3 mb-5" style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(9,157,253,0.12)' }}>
                    <div className="text-xs font-mono mb-2" style={{ color: '#555555' }}>
                      src/hooks/useAuth.ts:34 · <span style={{ color: B }}>Find Bugs</span>
                    </div>
                    <pre className="text-xs font-mono leading-relaxed" style={{ color: '#888888' }}>
                      <span style={{ color: BL }}>useEffect</span>{'(() => {\n  '}<span style={{ color: B }}>validateToken</span>{'(authToken);\n}, [authToken]);'}
                    </pre>
                  </div>
                  <div className="flex gap-1.5 mb-5 flex-wrap">
                    {['Explain', 'Find Bugs', 'Refactor', 'Write Tests', 'Summarize'].map((mode, i) => (
                      <span key={mode} className="px-2.5 py-1 rounded-md text-xs font-medium" style={i === 1 ? { background: B, color: '#000000' } : { background: 'rgba(9,157,253,0.07)', color: '#555555', border: '1px solid rgba(9,157,253,0.12)' }}>
                        {mode}
                      </span>
                    ))}
                  </div>
                  <div className="space-y-4 mb-5">
                    <div>
                      <div className="text-xs font-mono mb-1" style={{ color: '#555555' }}>You</div>
                      <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.8)' }}>Why is this useEffect firing twice in dev mode?</p>
                    </div>
                    <div>
                      <div className="text-xs font-mono mb-1" style={{ color: B }}>Agent</div>
                      <p className="text-sm leading-relaxed" style={{ color: '#888888' }}>In React 18 Strict Mode, effects run twice intentionally to surface side-effect bugs. Return a cleanup function to handle the double invocation correctly...</p>
                    </div>
                  </div>
                  {/* Voice + Chat buttons */}
                  <div className="flex gap-2 mb-4">
                    <button className="flex-1 flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold" style={{ background: B, color: '#000' }}>
                      <Mic className="w-3.5 h-3.5" /> Open Mic in Browser
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold" style={{ background: 'rgba(9,157,253,0.1)', color: B, border: '1px solid rgba(9,157,253,0.25)' }}>
                      <MessageSquare className="w-3.5 h-3.5" /> Open Chat
                    </button>
                  </div>
                  <div className="rounded-lg px-4 py-3 flex items-center gap-4" style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(9,157,253,0.1)' }}>
                    <Waveform />
                    <span className="text-xs flex-1" style={{ color: '#555555' }}>Listening…</span>
                    <button className="text-xs rounded-md px-2.5 py-1 font-medium" style={{ color: '#f87171', border: '1px solid rgba(248,113,113,0.3)', background: 'rgba(248,113,113,0.05)' }}>Stop</button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── METRICS ── */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="glass-card grid grid-cols-2 md:grid-cols-4 overflow-hidden">
            {metrics.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true, margin: '-60px' }}
                className="metric-divider py-8 px-6 text-center"
              >
                <div className="font-display font-bold mb-1 gradient-text" style={{ fontSize: 'clamp(28px, 4vw, 40px)' }}>
                  <CountUp target={m.value} prefix={m.prefix} suffix={m.suffix} />
                </div>
                <div className="text-sm font-semibold mb-0.5" style={{ color: '#FFFFFF' }}>{m.label}</div>
                <div className="text-xs" style={{ color: '#888888' }}>{m.sub}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="relative z-10 py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} className="text-center mb-20">
            <motion.p variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0, transition: { duration: 0.5 } } }} className="section-label mb-5">How it works</motion.p>
            <h2 className="font-display font-bold text-balance" style={{ fontSize: 'clamp(36px, 5vw, 60px)', color: '#FFFFFF', letterSpacing: '-0.03em' }}>
              <SplitWords text="Three steps to your first session" baseDelay={0.1} />
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6" style={{ perspective: '1200px' }}>
            {steps.map((step, i) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.n}
                  initial={{ opacity: 0, y: 60, rotateX: 18 }} whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  whileHover={{ y: -6, boxShadow: `0 20px 40px rgba(9,157,253,0.12)` }}
                  transition={{ duration: 0.65, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                  viewport={{ once: true, margin: '-60px' }}
                  className="glass-card p-8" style={{ transformStyle: 'preserve-3d' }}
                >
                  <div className="font-mono text-xs font-semibold tracking-widest mb-6" style={{ color: 'rgba(9,157,253,0.4)' }}>{step.n}</div>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5" style={{ background: 'rgba(9,157,253,0.1)', border: '1px solid rgba(9,157,253,0.2)' }}>
                    <Icon className="w-5 h-5" style={{ color: B }} />
                  </div>
                  <h3 className="font-display font-bold text-lg mb-4" style={{ color: '#FFFFFF' }}>{step.title}</h3>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: '#888888' }}>{step.description}</p>
                  {step.link && (
                    <a href={step.link.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold" style={{ color: B }}>
                      {step.link.label} <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── FEATURES BENTO ── */}
      <section className="relative z-10 py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} className="text-center mb-20">
            <motion.p variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0, transition: { duration: 0.5 } } }} className="section-label mb-5">Features</motion.p>
            <h2 className="font-display font-bold text-balance" style={{ fontSize: 'clamp(36px, 5vw, 60px)', color: '#FFFFFF', letterSpacing: '-0.03em' }}>
              <SplitWords text="Everything you need for AI-powered code review" baseDelay={0.1} />
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-5 auto-rows-auto" style={{ perspective: '1400px' }}>

            {/* Wide — Five focus modes */}
            <motion.div initial={{ opacity: 0, y: 50, rotateX: 14 }} whileInView={{ opacity: 1, y: 0, rotateX: 0 }} whileHover={{ y: -4 }} transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }} viewport={{ once: true, margin: '-60px' }} className="md:col-span-2 glass-card p-8" style={{ transformStyle: 'preserve-3d' }}>
              <h3 className="font-display font-bold text-2xl mb-3" style={{ color: '#FFFFFF' }}>Five focus modes</h3>
              <p className="text-sm leading-relaxed mb-8" style={{ color: '#888888' }}>Each mode builds a targeted prompt from your editor selection, surrounding context, and file metadata — no copy-pasting into a chat window.</p>
              <div className="rounded-xl p-1.5 flex flex-wrap gap-1" style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(9,157,253,0.1)' }}>
                {['Explain', 'Find Bugs', 'Refactor', 'Write Tests', 'Summarize'].map((mode, i) => (
                  <div key={mode} className="flex-1 py-2 px-3 rounded-lg text-xs font-medium text-center min-w-fit transition-all" style={i === 1 ? { background: B, color: '#000000', boxShadow: `0 2px 12px rgba(9,157,253,0.4)` } : { color: '#555555' }}>
                    {mode}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Voice + Text */}
            <motion.div initial={{ opacity: 0, y: 50, rotateX: 14 }} whileInView={{ opacity: 1, y: 0, rotateX: 0 }} whileHover={{ y: -4 }} transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }} viewport={{ once: true, margin: '-60px' }} className="glass-card p-6 flex flex-col" style={{ transformStyle: 'preserve-3d' }}>
              <div className="flex gap-2 mb-5">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(9,157,253,0.1)', border: '1px solid rgba(9,157,253,0.2)' }}><Mic className="w-4 h-4" style={{ color: B }} /></div>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(9,157,253,0.1)', border: '1px solid rgba(9,157,253,0.2)' }}><MessageSquare className="w-4 h-4" style={{ color: BL }} /></div>
              </div>
              <h4 className="font-semibold mb-2" style={{ color: '#FFFFFF' }}>Voice & text chat</h4>
              <p className="text-sm leading-relaxed" style={{ color: '#888888' }}>Prefer typing? Use text chat. Prefer speaking? Open mic. Both modes share the same AI context and real-time transcript.</p>
            </motion.div>

            {/* Agora RTC */}
            <motion.div initial={{ opacity: 0, y: 50, rotateX: 14 }} whileInView={{ opacity: 1, y: 0, rotateX: 0 }} whileHover={{ y: -4 }} transition={{ duration: 0.65, delay: 0.05, ease: [0.16, 1, 0.3, 1] }} viewport={{ once: true, margin: '-60px' }} className="glass-card p-6 flex flex-col" style={{ transformStyle: 'preserve-3d' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5" style={{ background: 'rgba(9,157,253,0.1)', border: '1px solid rgba(9,157,253,0.2)' }}><SignalHigh className="w-5 h-5" style={{ color: BL }} /></div>
              <h4 className="font-semibold mb-2" style={{ color: '#FFFFFF' }}>Agora RTC audio</h4>
              <p className="text-sm leading-relaxed" style={{ color: '#888888' }}>Sub-100ms latency over Agora's global real-time network. No WebRTC fumbling.</p>
            </motion.div>

            {/* Real-time transcript — wide */}
            <motion.div initial={{ opacity: 0, y: 50, rotateX: 14 }} whileInView={{ opacity: 1, y: 0, rotateX: 0 }} whileHover={{ y: -4 }} transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }} viewport={{ once: true, margin: '-60px' }} className="md:col-span-2 glass-card p-8" style={{ transformStyle: 'preserve-3d' }}>
              <h3 className="font-display font-bold text-2xl mb-3" style={{ color: '#FFFFFF' }}>Real-time transcript</h3>
              <p className="text-sm leading-relaxed mb-6" style={{ color: '#888888' }}>Every word — yours and the agent's — streams live into the VS Code panel simultaneously. Scroll back anytime.</p>
              <div className="rounded-xl p-4 space-y-3 text-sm font-mono" style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(9,157,253,0.1)' }}>
                <div><span style={{ color: B }}>You</span><span style={{ color: '#444444' }}>  › </span><span style={{ color: '#888888' }}>How should I optimize this query?</span></div>
                <div><span style={{ color: BL }}>Agent</span><span style={{ color: '#444444' }}> › </span><span style={{ color: '#888888' }}>Consider adding an index on user_id. Your current scan is O(n)…</span></div>
                <div className="flex items-center gap-2 pt-1">
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#4ade80' }} />
                  <span style={{ color: '#555555', fontSize: '0.7rem' }}>Agent is speaking…</span>
                </div>
              </div>
            </motion.div>

            {/* Ephemeral */}
            <motion.div initial={{ opacity: 0, y: 50, rotateX: 14 }} whileInView={{ opacity: 1, y: 0, rotateX: 0 }} whileHover={{ y: -4 }} transition={{ duration: 0.65, delay: 0.05, ease: [0.16, 1, 0.3, 1] }} viewport={{ once: true, margin: '-60px' }} className="glass-card p-6 flex flex-col" style={{ transformStyle: 'preserve-3d' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5" style={{ background: 'rgba(9,157,253,0.1)', border: '1px solid rgba(9,157,253,0.2)' }}><Shield className="w-5 h-5" style={{ color: B }} /></div>
              <h4 className="font-semibold mb-2" style={{ color: '#FFFFFF' }}>Ephemeral sessions</h4>
              <p className="text-sm leading-relaxed" style={{ color: '#888888' }}>Sessions live only while active. No code ever leaves your machine.</p>
            </motion.div>

            {/* Any language */}
            <motion.div initial={{ opacity: 0, y: 50, rotateX: 14 }} whileInView={{ opacity: 1, y: 0, rotateX: 0 }} whileHover={{ y: -4 }} transition={{ duration: 0.65, delay: 0.08, ease: [0.16, 1, 0.3, 1] }} viewport={{ once: true, margin: '-60px' }} className="glass-card p-6 flex flex-col" style={{ transformStyle: 'preserve-3d' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5" style={{ background: 'rgba(9,157,253,0.1)', border: '1px solid rgba(9,157,253,0.2)' }}><Code2 className="w-5 h-5" style={{ color: BL }} /></div>
              <h4 className="font-semibold mb-2" style={{ color: '#FFFFFF' }}>Any language</h4>
              <p className="text-sm leading-relaxed" style={{ color: '#888888' }}>TypeScript, Python, Go, Rust, Swift — if VS Code can open it, Agora Mentor can discuss it.</p>
            </motion.div>

            {/* Context-aware */}
            <motion.div initial={{ opacity: 0, y: 50, rotateX: 14 }} whileInView={{ opacity: 1, y: 0, rotateX: 0 }} whileHover={{ y: -4 }} transition={{ duration: 0.65, delay: 0.12, ease: [0.16, 1, 0.3, 1] }} viewport={{ once: true, margin: '-60px' }} className="glass-card p-6 flex flex-col" style={{ transformStyle: 'preserve-3d' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5" style={{ background: 'rgba(9,157,253,0.1)', border: '1px solid rgba(9,157,253,0.2)' }}><Layers className="w-5 h-5" style={{ color: B }} /></div>
              <h4 className="font-semibold mb-2" style={{ color: '#FFFFFF' }}>Context-aware prompts</h4>
              <p className="text-sm leading-relaxed" style={{ color: '#888888' }}>Surrounding lines, file path, and language are automatically included. The agent already knows where you are.</p>
            </motion.div>

            {/* One-click stop */}
            <motion.div initial={{ opacity: 0, y: 50, rotateX: 14 }} whileInView={{ opacity: 1, y: 0, rotateX: 0 }} whileHover={{ y: -4 }} transition={{ duration: 0.65, delay: 0.06, ease: [0.16, 1, 0.3, 1] }} viewport={{ once: true, margin: '-60px' }} className="glass-card p-6 flex flex-col" style={{ transformStyle: 'preserve-3d' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5" style={{ background: 'rgba(9,157,253,0.1)', border: '1px solid rgba(9,157,253,0.2)' }}><StopCircle className="w-5 h-5" style={{ color: B }} /></div>
              <h4 className="font-semibold mb-2" style={{ color: '#FFFFFF' }}>One-click stop</h4>
              <p className="text-sm leading-relaxed" style={{ color: '#888888' }}>Close the tab or click Stop. Either action terminates the session and clears all context instantly.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── MODEL STACK ── */}
      <section className="relative z-10 py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} className="text-center mb-20">
            <motion.p variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0, transition: { duration: 0.5 } } }} className="section-label mb-5">Model stack</motion.p>
            <h2 className="font-display font-bold text-balance mb-4" style={{ fontSize: 'clamp(36px, 5vw, 60px)', color: '#FFFFFF', letterSpacing: '-0.03em' }}>
              <SplitWords text="Agora-managed defaults. More providers soon." baseDelay={0.1} />
            </h2>
            <motion.p variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.4 } } }} className="text-lg max-w-xl mx-auto" style={{ color: '#888888' }}>
              v0.1 ships with a battle-tested default stack. Swap providers as the ecosystem grows.
            </motion.p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }} viewport={{ once: true, margin: '-60px' }} className="glass-card p-8">
              <div className="flex items-center gap-2 mb-8">
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#4ade80' }} />
                <span className="font-display font-bold" style={{ color: '#4ade80' }}>What ships today</span>
              </div>
              <div className="space-y-5">
                {modelStack.map((item, i) => (
                  <motion.div key={item.role} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: i * 0.08 }} viewport={{ once: true }} className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono tracking-widest block mb-0.5" style={{ color: '#555555' }}>{item.role}</span>
                      <span className="text-sm font-medium" style={{ color: '#FFFFFF' }}>{item.provider}</span>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: 'rgba(74,222,128,0.1)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.25)' }}>Active</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }} viewport={{ once: true, margin: '-60px' }} className="glass-card p-8 relative" style={{ opacity: 0.75 }}>
              <Lock className="absolute top-5 right-5 w-4 h-4" style={{ color: '#555555' }} />
              <div className="flex items-center gap-2 mb-8">
                <span className="w-2 h-2 rounded-full" style={{ background: '#fbbf24' }} />
                <span className="font-display font-bold" style={{ color: '#fbbf24' }}>On the roadmap</span>
              </div>
              <Marquee items={roadmap} />
              <div className="mt-3"><Marquee items={[...roadmap].reverse()} /></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="relative z-10 py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} className="text-center mb-20">
            <motion.p variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0, transition: { duration: 0.5 } } }} className="section-label mb-5">Pricing</motion.p>
            <h2 className="font-display font-bold text-balance" style={{ fontSize: 'clamp(36px, 5vw, 60px)', color: '#FFFFFF', letterSpacing: '-0.03em' }}>
              <SplitWords text="Pay only for what you use." baseDelay={0.1} />
            </h2>
            <motion.p variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.35 } } }} className="text-lg max-w-2xl mx-auto mt-4" style={{ color: '#888888' }}>
              The extension is free and open source. You pay Agora directly for Conversational AI Engine usage — transparent, usage-based, no subscription.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Extension */}
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} viewport={{ once: true, margin: '-60px' }} className="glass-card p-8">
              <div className="text-xs font-mono tracking-widest mb-4" style={{ color: '#555555' }}>EXTENSION</div>
              <div className="font-display font-bold mb-2" style={{ fontSize: '3rem', color: '#FFFFFF', lineHeight: 1 }}>Free</div>
              <p className="text-sm mb-8" style={{ color: '#888888' }}>MIT licensed. Open source. Always free.</p>
              <div className="space-y-3">
                {['VS Code extension', 'All 5 focus modes', 'Voice + text chat', 'Real-time transcript', 'Open source & auditable'].map(f => (
                  <div key={f} className="flex items-center gap-3 text-sm" style={{ color: '#FFFFFF' }}>
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: '#4ade80' }} />
                    {f}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Agora usage */}
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }} viewport={{ once: true, margin: '-60px' }} className="glass-card p-8" style={{ border: '1px solid rgba(9,157,253,0.3)' }}>
              <div className="text-xs font-mono tracking-widest mb-4" style={{ color: B }}>AGORA CONVERSATIONAL AI</div>
              <div className="flex items-end gap-1 mb-2">
                <span className="font-display font-bold" style={{ fontSize: '3rem', color: '#FFFFFF', lineHeight: 1 }}>$0.10</span>
                <span className="text-base mb-2" style={{ color: '#888888' }}>/minute</span>
              </div>
              <p className="text-sm mb-8" style={{ color: '#888888' }}>Billed by Agora directly. No markup, no subscription.</p>
              <div className="space-y-3 mb-8">
                {[
                  '5-min session ≈ $0.50',
                  '10-min deep dive ≈ $1.00',
                  '20 sessions/month ≈ $10',
                  'Includes STT + LLM + TTS',
                  'Your own Agora account',
                ].map(f => (
                  <div key={f} className="flex items-center gap-3 text-sm" style={{ color: '#FFFFFF' }}>
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: B }} />
                    {f}
                  </div>
                ))}
              </div>
              <a
                href="https://www.agora.io/en/pricing/conversational-ai-engine/"
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold"
                style={{ color: B }}
              >
                Full pricing details on Agora <ExternalLink className="w-3 h-3" />
              </a>
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.3 }} viewport={{ once: true }}
            className="text-center text-xs mt-8" style={{ color: '#555555' }}
          >
            Agora offers a free signup with initial credits — create your account at{' '}
            <a href="https://sso2.agora.io/en/signup?" target="_blank" rel="noopener noreferrer" style={{ color: B }}>console.agora.io</a>
            {' '}to get started. No credit card required to sign up.
          </motion.p>
        </div>
      </section>

      {/* ── QUICK START ── */}
      <section className="relative z-10 py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} className="text-center mb-20">
            <motion.p variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0, transition: { duration: 0.5 } } }} className="section-label mb-5">Quick start</motion.p>
            <h2 className="font-display font-bold text-balance" style={{ fontSize: 'clamp(36px, 5vw, 60px)', color: '#FFFFFF', letterSpacing: '-0.03em' }}>
              <SplitWords text="Up and running in under 5 minutes" baseDelay={0.1} />
            </h2>
          </motion.div>
          <div className="space-y-5">
            {quickStart.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -60 : 60 }} whileInView={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true, margin: '-60px' }}
                className="glass-card p-7"
              >
                <div className="flex items-start gap-5">
                  <div className="min-w-fit w-8 h-8 rounded-full flex items-center justify-center font-mono text-sm font-bold mt-0.5" style={{ background: 'rgba(9,157,253,0.12)', border: '1px solid rgba(9,157,253,0.25)', color: B }}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold mb-4" style={{ color: '#FFFFFF' }}>{item.title}</h3>
                    <CodeLine tokens={item.tokens} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.3 }} viewport={{ once: true }} className="text-center mt-10">
            <a href="https://sso2.agora.io/en/signup?" target="_blank" rel="noopener noreferrer" className="btn-primary px-8 py-3 text-sm inline-flex">
              Create Free Agora Account <ExternalLink className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="relative z-10 py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} className="text-center mb-16">
            <motion.p variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0, transition: { duration: 0.5 } } }} className="section-label mb-5">FAQ</motion.p>
            <h2 className="font-display font-bold text-balance" style={{ fontSize: 'clamp(36px, 5vw, 60px)', color: '#FFFFFF', letterSpacing: '-0.03em' }}>
              <SplitWords text="Common questions" baseDelay={0.1} />
            </h2>
          </motion.div>
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
            className="space-y-3"
          >
            {faqs.map((faq, i) => (
              <motion.div key={i} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}>
                <FaqItem q={faq.q} a={faq.a} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── QUOTE ── */}
      <section className="relative z-10 py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <motion.blockquote initial={{ opacity: 0, scale: 0.94, y: 30 }} whileInView={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} viewport={{ once: true, margin: '-80px' }}>
            <motion.div initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} viewport={{ once: true }} className="font-display font-bold mb-8 leading-none select-none" style={{ fontSize: '6rem', color: 'rgba(9,157,253,0.2)', lineHeight: 1 }}>
              "
            </motion.div>
            <p className="font-display font-bold text-balance leading-tight mb-8" style={{ fontSize: 'clamp(24px, 4vw, 38px)', color: '#FFFFFF', letterSpacing: '-0.02em' }}>
              Instead of stopping to type in ChatGPT, I just… talk. It feels like pair programming with someone who already read your whole file.
            </p>
            <motion.cite initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.4 }} viewport={{ once: true }} className="text-sm not-italic" style={{ color: '#888888' }}>
              — A developer using Agora Mentor
            </motion.cite>
          </motion.blockquote>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="relative z-10 py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
          <div style={{ width: '900px', height: '500px', borderRadius: '50%', background: `radial-gradient(ellipse, rgba(9,157,253,0.15) 0%, transparent 70%)`, filter: 'blur(80px)' }} />
        </div>
        <div className="max-w-3xl mx-auto text-center relative">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} viewport={{ once: true, margin: '-80px' }} className="space-y-8">
            <h2 className="font-display font-bold text-balance" style={{ fontSize: 'clamp(44px, 7vw, 80px)', color: '#FFFFFF', letterSpacing: '-0.04em', lineHeight: '0.95' }}>
              <SplitWords text="Be first when it launches." baseDelay={0.1} />
            </h2>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.5 }} viewport={{ once: true }} className="text-lg" style={{ color: '#888888' }}>
              The extension is coming to VS Code Marketplace soon. Star the repo to get notified, and set up your free Agora account now so you're ready to go.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.5 }} viewport={{ once: true }} className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <a href="https://github.com/anandwana001/agora-mentor-vscode" target="_blank" rel="noopener noreferrer" className="btn-primary px-10 py-4 text-base">
                ⭐ Star on GitHub
                <ArrowRight className="w-4 h-4" />
              </a>
              <a href="https://sso2.agora.io/en/signup?" target="_blank" rel="noopener noreferrer" className="btn-ghost px-10 py-4 text-base">
                Create Free Agora Account
              </a>
            </motion.div>
            <div className="flex items-center justify-center gap-5 pt-10 flex-wrap text-xs font-mono tracking-wide" style={{ color: '#555555' }}>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" />MIT License</span>
              <span>·</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" />Built with Agora RTC</span>
              <span>·</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" />Open source</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 py-12 px-4 sm:px-6 lg:px-8" style={{ borderTop: '1px solid rgba(9,157,253,0.1)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8 items-center">
            <div className="flex items-center gap-3">
              <div>
                <Image src="/agora-logo-rgb-blue.svg" alt="agora" width={80} height={27} />
                <div className="text-xs mt-0.5" style={{ color: '#555555' }}>Mentor · Voice AI for developers</div>
              </div>
            </div>
            <div className="flex justify-start md:justify-center gap-6 text-sm flex-wrap">
              {[
                { label: 'GitHub', href: 'https://github.com/anandwana001/agora-mentor-vscode' },
                { label: 'Changelog', href: 'https://github.com/anandwana001/agora-mentor-vscode/releases' },
                { label: 'Issues', href: 'https://github.com/anandwana001/agora-mentor-vscode/issues' },
                { label: 'Agora Pricing', href: 'https://www.agora.io/en/pricing/conversational-ai-engine/' },
              ].map(link => (
                <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="transition-colors" style={{ color: '#555555' }}
                  onMouseEnter={e => ((e.target as HTMLElement).style.color = '#FFFFFF')}
                  onMouseLeave={e => ((e.target as HTMLElement).style.color = '#555555')}
                >
                  {link.label}
                </a>
              ))}
            </div>
            <div className="text-right text-xs" style={{ color: '#555555' }}>
              <p>MIT License</p>
              <p>Built by Akshay Nandwana</p>
            </div>
          </div>
          <div className="pt-8 text-center text-xs" style={{ borderTop: '1px solid rgba(9,157,253,0.08)', color: '#444444' }}>
            © 2026 Agora Mentor. Not affiliated with Agora Inc.
          </div>
        </div>
      </footer>
    </div>
  )
}
