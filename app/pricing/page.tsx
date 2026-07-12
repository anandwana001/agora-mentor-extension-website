'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, ExternalLink, ChevronDown } from 'lucide-react'
import { Navbar } from '@/components/navbar'

const B = '#099DFD'

function SectionHeading({ id, num, title }: { id: string; num: string; title: string }) {
  return (
    <h2 id={id} className="font-mono font-bold text-xl mb-6 mt-20 pb-4 flex items-baseline gap-3"
      style={{ borderBottom: '1px solid rgba(9,157,253,0.15)', color: '#FFFFFF', letterSpacing: '-0.01em' }}>
      <span style={{ color: B, fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.06em' }}>{num} ·</span>
      {title}
    </h2>
  )
}

function Callout({ color = 'blue', children }: { color?: 'blue' | 'green' | 'orange' | 'purple'; children: React.ReactNode }) {
  const colors = {
    blue:   { border: B,         bg: 'rgba(9,157,253,0.08)' },
    green:  { border: '#4ade80', bg: 'rgba(74,222,128,0.07)' },
    orange: { border: '#fbbf24', bg: 'rgba(251,191,36,0.07)' },
    purple: { border: '#a78bfa', bg: 'rgba(167,139,250,0.07)' },
  }
  const c = colors[color]
  return (
    <div className="my-5 px-5 py-4 rounded-r-xl text-base leading-loose"
      style={{ borderLeft: `3px solid ${c.border}`, background: c.bg, color: '#FFFFFF' }}>
      {children}
    </div>
  )
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="font-mono text-xs px-1.5 py-0.5 rounded"
      style={{ background: 'rgba(9,157,253,0.1)', border: '1px solid rgba(9,157,253,0.2)', color: '#4DC4FF' }}>
      {children}
    </code>
  )
}

function Table({ headers, rows }: { headers: string[]; rows: (string | React.ReactNode)[][] }) {
  return (
    <div className="overflow-x-auto my-6 rounded-xl" style={{ border: '1px solid rgba(9,157,253,0.12)' }}>
      <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: 'rgba(9,157,253,0.04)' }}>
            {headers.map((h, i) => (
              <th key={i} className="text-left py-3 px-5 font-mono text-xs tracking-widest uppercase whitespace-nowrap"
                style={{ color: '#888888', borderBottom: '1px solid rgba(9,157,253,0.15)' }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: '1px solid rgba(9,157,253,0.08)' }}
              className="transition-colors hover:bg-[rgba(9,157,253,0.04)]">
              {row.map((cell, j) => (
                <td key={j} className="py-3.5 px-5 align-top leading-relaxed" style={{ color: '#CCCCCC' }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const navLinks = [
  { id: 'quick', label: 'Quick Answer' },
  { id: 'calculator', label: 'Cost Calculator' },
  { id: 'examples', label: 'Monthly Examples' },
  { id: 'tips', label: 'Cost Optimization' },
]

function Calculator() {
  const [minsDay, setMinsDay] = useState(30)
  const [devs, setDevs] = useState(1)

  const CONVOAI_RATE = 0.10
  const RTC_RATE = 0.00099
  const RTC_FREE = 10000

  const monthly = minsDay * 30 * devs
  const convoai = monthly * CONVOAI_RATE
  const rtcBillable = Math.max(0, monthly * 2 - RTC_FREE)
  const rtc = rtcBillable * RTC_RATE
  const voiceTotal = convoai + rtc
  const chatTotal = convoai
  const freeDays = Math.round(300 / (minsDay * devs))

  function fmt(n: number) { return n >= 1000 ? `$${(n/1000).toFixed(1)}k` : `$${n.toFixed(2)}` }

  const barMax = Math.max(voiceTotal, 1)
  const convoaiPct = (convoai / barMax) * 100
  const rtcPct = (rtc / barMax) * 100

  return (
    <div className="glass-card overflow-hidden">
      <div className="px-5 py-3 text-sm font-mono font-bold tracking-widest uppercase"
        style={{ background: 'rgba(9,157,253,0.06)', borderBottom: '1px solid rgba(9,157,253,0.15)', color: '#888888' }}>
        Monthly cost estimator · ongoing (post free-trial)
      </div>
      <div className="p-6">
        <div className="grid sm:grid-cols-2 gap-6 mb-8">
          {[
            { label: 'Minutes per day', value: minsDay, min: 5, max: 180, step: 5, display: `${minsDay} min`, onChange: setMinsDay },
            { label: 'Developers', value: devs, min: 1, max: 20, step: 1, display: `${devs} dev${devs > 1 ? 's' : ''}`, onChange: setDevs },
          ].map(field => (
            <div key={field.label}>
              <div className="flex justify-between items-baseline mb-3">
                <span className="text-sm font-mono font-bold tracking-widest uppercase" style={{ color: '#888888' }}>{field.label}</span>
                <span className="font-mono font-bold text-lg" style={{ color: B }}>{field.display}</span>
              </div>
              <input type="range" min={field.min} max={field.max} step={field.step} value={field.value}
                onChange={e => field.onChange(parseInt(e.target.value))}
                className="w-full h-1 rounded-full outline-none cursor-pointer"
                style={{ background: `linear-gradient(to right, ${B} 0%, ${B} ${((field.value - field.min) / (field.max - field.min)) * 100}%, rgba(9,157,253,0.2) ${((field.value - field.min) / (field.max - field.min)) * 100}%, rgba(9,157,253,0.2) 100%)`, WebkitAppearance: 'none', appearance: 'none' }}
              />
            </div>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <div className="rounded-xl p-5" style={{ background: 'rgba(9,157,253,0.08)', border: `1px solid rgba(9,157,253,0.3)` }}>
            <div className="text-xs font-mono font-bold tracking-widest uppercase mb-3" style={{ color: B }}>Voice mode / month</div>
            <div className="font-display font-bold text-3xl mb-2" style={{ color: '#FFFFFF' }}>{fmt(voiceTotal)}</div>
            <div className="text-sm" style={{ color: '#888888' }}>
              ConvoAI {fmt(convoai)} · RTC {rtc < 0.01 ? 'within free tier' : fmt(rtc)}
            </div>
          </div>
          <div className="rounded-xl p-5" style={{ background: 'rgba(9,157,253,0.04)', border: '1px solid rgba(9,157,253,0.15)' }}>
            <div className="text-xs font-mono font-bold tracking-widest uppercase mb-3" style={{ color: '#888888' }}>Chat mode / month</div>
            <div className="font-display font-bold text-3xl mb-2" style={{ color: '#FFFFFF' }}>{fmt(chatTotal)}</div>
            <div className="text-sm" style={{ color: '#888888' }}>ConvoAI {fmt(convoai)} · no RTC</div>
          </div>
        </div>

        {/* Bar chart */}
        <div className="mb-5">
          <div className="flex gap-4 mb-4">
            <div className="flex items-center gap-1.5 text-sm" style={{ color: '#888888' }}>
              <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: B }} />
              Conversational AI
            </div>
            <div className="flex items-center gap-1.5 text-sm" style={{ color: '#888888' }}>
              <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: '#4ade80' }} />
              RTC audio (voice only)
            </div>
          </div>
          <div className="space-y-4">
            {[
              { label: 'Voice mode', convoaiW: convoaiPct, rtcW: rtcPct },
              { label: 'Chat mode', convoaiW: convoaiPct, rtcW: 0 },
            ].map(bar => (
              <div key={bar.label}>
                <div className="text-sm font-mono mb-2" style={{ color: '#888888' }}>{bar.label}</div>
                <div className="relative h-6 rounded-md overflow-hidden" style={{ background: 'rgba(9,157,253,0.08)' }}>
                  <div className="absolute inset-y-0 left-0 flex rounded-md overflow-hidden transition-all duration-300"
                    style={{ width: `${bar.convoaiW + bar.rtcW}%` }}>
                    <div style={{ width: bar.convoaiW + bar.rtcW > 0 ? `${(bar.convoaiW / (bar.convoaiW + bar.rtcW)) * 100}%` : '100%', background: B }} />
                    {bar.rtcW > 0 && <div style={{ flex: 1, background: '#4ade80' }} />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-sm font-mono mt-5" style={{ color: '#555555' }}>
          After one-time 300 free ConvoAI minutes ≈ {freeDays} day{freeDays !== 1 ? 's' : ''} at this usage.
        </p>
      </div>
    </div>
  )
}

export default function PricingPage() {
  const [activeId, setActiveId] = useState('')
  const [detailOpen, setDetailOpen] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        for (const e of entries) if (e.isIntersecting) setActiveId(e.target.id)
      },
      { rootMargin: '-20% 0px -70% 0px' }
    )
    navLinks.forEach(l => {
      const el = document.getElementById(l.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24">
        <Link href="/" className="inline-flex items-center gap-2 text-sm mb-8 transition-colors"
          style={{ color: '#888888' }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#FFFFFF')}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#888888')}>
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to home
        </Link>

        <div className="flex gap-10">
          {/* Sidebar */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-24">
              <div className="text-xs font-mono font-bold tracking-widest uppercase mb-4 px-1" style={{ color: '#555555' }}>
                Cost Reference
              </div>
              {navLinks.map(link => (
                <a key={link.id} href={`#${link.id}`}
                  className="block py-1 px-2 text-xs rounded mb-0.5 transition-all"
                  style={{
                    color: activeId === link.id ? B : '#888888',
                    background: activeId === link.id ? 'rgba(9,157,253,0.08)' : 'transparent',
                    borderLeft: `2px solid ${activeId === link.id ? B : 'transparent'}`,
                  }}>
                  {link.label}
                </a>
              ))}
              <div className="mt-6 p-4 rounded-xl" style={{ background: 'rgba(74,222,128,0.07)', border: '1px solid rgba(74,222,128,0.2)' }}>
                <div className="text-xs font-bold mb-2" style={{ color: '#4ade80' }}>Free trial</div>
                <div className="text-sm leading-relaxed" style={{ color: '#888888' }}>
                  300 free minutes · one-time · ≈ your first 1–2 weeks
                </div>
              </div>
            </div>
          </aside>

          {/* Main */}
          <main className="flex-1 min-w-0 max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="mb-8 pb-6" style={{ borderBottom: '1px solid rgba(9,157,253,0.15)' }}>
              <p className="section-label mb-3">Cost Reference</p>
              <h1 className="font-display font-bold leading-tight mb-4" style={{ fontSize: 'clamp(28px, 4vw, 42px)', color: '#FFFFFF', letterSpacing: '-0.03em' }}>
                What does Agora Mentor<br />cost to run?
              </h1>
              <p className="text-base leading-relaxed" style={{ color: '#888888', maxWidth: '60ch' }}>
                Simple answer below. The full technical breakdown (RTC, RTM, free tiers) is one click away if you need it.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.1 }}>

            {/* Quick Answer */}
            <section id="quick">
              <h2 className="font-mono font-bold text-xl mb-6 pb-4 flex items-baseline gap-3"
                style={{ borderBottom: '1px solid rgba(9,157,253,0.15)', color: '#FFFFFF', letterSpacing: '-0.01em' }}>
                <span style={{ color: B, fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.06em' }}>TL;DR ·</span>
                Simple pricing answer
              </h2>

              {/* Two big cards */}
              <div className="grid sm:grid-cols-2 gap-5 mb-6">
                {/* Chat */}
                <div className="rounded-2xl p-7 flex flex-col gap-4" style={{ background: 'rgba(74,222,128,0.07)', border: '2px solid rgba(74,222,128,0.35)' }}>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#4ade80' }} />
                    <span className="font-mono font-bold text-sm tracking-widest uppercase" style={{ color: '#4ade80' }}>Chat mode</span>
                  </div>
                  <div>
                    <span className="font-display font-bold" style={{ fontSize: '3rem', color: '#FFFFFF', lineHeight: 1 }}>$0.10</span>
                    <span className="text-base ml-2" style={{ color: '#888888' }}>/ minute</span>
                  </div>
                  <div className="text-base leading-loose" style={{ color: '#CCCCCC' }}>
                    That&apos;s it. One charge, one rate.<br />
                    <span style={{ color: '#888888' }}>No audio fee. No signaling fee.</span>
                  </div>
                  <div className="pt-2" style={{ borderTop: '1px solid rgba(74,222,128,0.2)' }}>
                    <div className="text-sm font-bold mb-1" style={{ color: '#4ade80' }}>✓ First 300 minutes free</div>
                    <div className="text-sm" style={{ color: '#888888' }}>≈ your first 1–2 weeks of use</div>
                  </div>
                </div>

                {/* Voice */}
                <div className="rounded-2xl p-7 flex flex-col gap-4" style={{ background: 'rgba(9,157,253,0.07)', border: '2px solid rgba(9,157,253,0.3)' }}>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: B }} />
                    <span className="font-mono font-bold text-sm tracking-widest uppercase" style={{ color: B }}>Voice mode</span>
                  </div>
                  <div>
                    <span className="font-display font-bold" style={{ fontSize: '3rem', color: '#FFFFFF', lineHeight: 1 }}>≈$0.10</span>
                    <span className="text-base ml-2" style={{ color: '#888888' }}>/ minute</span>
                  </div>
                  <div className="text-base leading-loose" style={{ color: '#CCCCCC' }}>
                    Practically the same as chat.<br />
                    <span style={{ color: '#888888' }}>Audio calling adds &lt;2% on top — and only after 5,000 free minutes/month.</span>
                  </div>
                  <div className="pt-2" style={{ borderTop: '1px solid rgba(9,157,253,0.2)' }}>
                    <div className="text-sm font-bold mb-1" style={{ color: B }}>✓ Same 300 free minutes apply</div>
                    <div className="text-sm" style={{ color: '#888888' }}>Shared with chat sessions</div>
                  </div>
                </div>
              </div>

              {/* What counts as a minute */}
              <div className="rounded-xl p-6 mb-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="font-bold text-base mb-3" style={{ color: '#FFFFFF' }}>What counts as a &ldquo;minute&rdquo;?</div>
                <div className="text-base leading-loose" style={{ color: '#888888' }}>
                  The clock runs from when you click <strong style={{ color: '#FFFFFF' }}>Start</strong> to when you click <strong style={{ color: '#FFFFFF' }}>Stop</strong> — wall-clock time, not just when the AI is speaking. So a 5-minute session where you ask two questions costs <strong style={{ color: '#FFFFFF' }}>$0.50</strong>, regardless of how much silence is in between.
                </div>
                <div className="mt-4 flex flex-wrap gap-6 text-sm" style={{ color: '#555555' }}>
                  <span>▸ Chat: timer stops the moment you hit Stop</span>
                  <span>▸ Voice: auto-stops after 30 s of silence</span>
                </div>
              </div>

              <Callout color="green">
                <strong>Bottom line for most users:</strong> Budget <strong>$0.10 per active session-minute</strong>. At 30 minutes a day, that&apos;s roughly <strong>$90/month</strong> after the free trial. Voice and chat cost the same.
              </Callout>

              {/* Collapsible full breakdown */}
              <div className="mt-8 rounded-xl overflow-hidden" style={{ border: '1px solid rgba(9,157,253,0.15)' }}>
                <button
                  onClick={() => setDetailOpen(v => !v)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left transition-colors"
                  style={{ background: 'rgba(9,157,253,0.05)' }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(9,157,253,0.1)')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(9,157,253,0.05)')}>
                  <div>
                    <div className="font-mono font-bold text-sm" style={{ color: B }}>Full breakdown — RTC, RTM &amp; free tier details</div>
                    <div className="text-sm mt-0.5" style={{ color: '#555555' }}>Products, per-product rates, cost-by-mode table, when each free tier runs out</div>
                  </div>
                  <ChevronDown className="w-5 h-5 flex-shrink-0 transition-transform duration-200" style={{ color: B, transform: detailOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                </button>

                {detailOpen && (
                  <div className="px-6 pb-6 pt-2">

                    {/* Products */}
                    <h3 className="font-mono font-bold text-base mt-6 mb-4 pb-3" style={{ color: '#FFFFFF', borderBottom: '1px solid rgba(9,157,253,0.1)' }}>
                      Three products under the hood
                    </h3>
                    <div className="grid sm:grid-cols-3 gap-4 mb-6">
                      {[
                        { badge: 'ConvoAI', color: B, name: 'Conversational AI Engine', rate: '$0.10', unit: '/ minute', free: 'First 300 min free (one-time)', desc: 'Runs on every session — voice and chat. This is the charge you actually notice.' },
                        { badge: 'RTC Audio', color: '#4ade80', name: 'Voice Calling', rate: '$0.99', unit: '/ 1,000 min', free: 'First 10,000 min/mo free', desc: 'Voice mode only. Zero cost for chat. At 1 hr/day you use 1,800 min — well inside the 5,000 min free limit.' },
                        { badge: 'RTM', color: '#a78bfa', name: 'Signaling / Transcripts', rate: '$59', unit: '/ month (next tier)', free: 'First 1,000,000 msgs/mo free', desc: '1M messages ≈ 278 hrs of conversation. Effectively free for any normal usage.' },
                      ].map(p => (
                        <div key={p.badge} className="glass-card p-5 flex flex-col gap-3">
                          <span className="self-start text-xs font-mono font-bold tracking-widest uppercase px-2 py-0.5 rounded-full"
                            style={{ background: `${p.color}18`, color: p.color, border: `1px solid ${p.color}30` }}>
                            {p.badge}
                          </span>
                          <div className="font-mono font-bold text-sm" style={{ color: '#FFFFFF' }}>{p.name}</div>
                          <div className="font-mono font-bold" style={{ fontSize: '1.4rem', color: '#FFFFFF', lineHeight: 1.1 }}>
                            {p.rate}<span className="text-xs font-normal ml-1" style={{ color: '#888888' }}>{p.unit}</span>
                          </div>
                          <div className="text-sm font-bold" style={{ color: '#4ade80' }}>✓ {p.free}</div>
                          <p className="text-sm leading-relaxed" style={{ color: '#888888' }}>{p.desc}</p>
                        </div>
                      ))}
                    </div>

                    {/* Per-mode breakdown */}
                    <h3 className="font-mono font-bold text-base mt-8 mb-4 pb-3" style={{ color: '#FFFFFF', borderBottom: '1px solid rgba(9,157,253,0.1)' }}>
                      Per-mode cost breakdown
                    </h3>
                    <div className="grid sm:grid-cols-3 gap-4 mb-6">
                      {[
                        { label: 'Voice Mode', color: B, rows: [['ConvoAI (AI engine)', '$0.10/min'], ['RTC (audio calling)', '~$0.002/min'], ['RTM (transcripts)', 'free tier'], ['Total', '~$0.102/min']] },
                        { label: 'Chat Mode', color: '#4ade80', rows: [['ConvoAI (AI engine)', '$0.10/min'], ['RTC (audio calling)', '$0 — not used'], ['RTM (transcripts)', 'free tier'], ['Total', '$0.10/min']] },
                        { label: 'Mixed (both)', color: '#fbbf24', rows: [['Billed', 'per session type'], ['Voice sessions', '~$0.102/min'], ['Chat sessions', '$0.10/min'], ['Total', 'sum of sessions']] },
                      ].map(mode => (
                        <div key={mode.label} className="rounded-xl overflow-hidden" style={{ border: `1px solid ${mode.color}25` }}>
                          <div className="px-4 py-3 text-sm font-mono font-bold flex items-center gap-2"
                            style={{ background: `${mode.color}10`, borderBottom: `1px solid ${mode.color}20`, color: mode.color }}>
                            <span className="w-2 h-2 rounded-full" style={{ background: mode.color }} />
                            {mode.label}
                          </div>
                          <div className="p-4 space-y-3">
                            {mode.rows.map(([label, val]) => (
                              <div key={label} className="flex justify-between items-baseline text-sm">
                                <span style={{ color: '#888888' }}>{label}</span>
                                <span className="font-mono font-bold" style={{ color: label === 'Total' ? mode.color : '#CCCCCC' }}>{val}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Free tier thresholds */}
                    <h3 className="font-mono font-bold text-base mt-8 mb-4 pb-3" style={{ color: '#FFFFFF', borderBottom: '1px solid rgba(9,157,253,0.1)' }}>
                      When each free tier runs out
                    </h3>
                    <Table
                      headers={['Product', 'Free until…', 'What triggers the first bill']}
                      rows={[
                        [
                          <span key="convoai"><strong style={{ color: '#FFFFFF' }}>ConvoAI</strong><br /><span className="text-xs" style={{ color: '#555555' }}>Voice &amp; chat</span></span>,
                          <span key="cf">300 session minutes<br /><span className="text-xs" style={{ color: '#555555' }}>one-time new-account credit</span></span>,
                          'Every minute after that · at 30 min/day ≈ 10 days of use',
                        ],
                        [
                          <span key="rtc"><strong style={{ color: '#FFFFFF' }}>RTC Audio</strong><br /><span className="text-xs" style={{ color: '#555555' }}>Voice only</span></span>,
                          <span key="rf">10,000 participant-min/mo<br /><span className="text-xs" style={{ color: '#555555' }}>= 5,000 voice session min</span></span>,
                          '~2.8 hrs/day of continuous voice · resets monthly · most users never hit this',
                        ],
                        [
                          <span key="rtm"><strong style={{ color: '#FFFFFF' }}>RTM Signaling</strong><br /><span className="text-xs" style={{ color: '#555555' }}>Voice &amp; chat</span></span>,
                          <span key="rtmf">1,000,000 messages/mo<br /><span className="text-xs" style={{ color: '#555555' }}>≈ 278 hrs of conversation</span></span>,
                          'Practically unlimited for individuals and small teams',
                        ],
                      ]}
                    />
                    <Callout color="orange">
                      <strong>RTC free tier math:</strong> 10,000 free participant-minutes ÷ 2 participants = <strong>5,000 free voice-session minutes/month</strong>. At 1 hr/day that&apos;s 1,800 min — you&apos;d need ~2.8 hrs/day of non-stop voice before RTC starts charging.
                    </Callout>
                  </div>
                )}
              </div>
            </section>

            {/* Calculator */}
            <section id="calculator">
              <SectionHeading id="calculator" num="§2" title="Cost Calculator" />
              <p className="text-base leading-loose mb-6" style={{ color: '#888888', maxWidth: '65ch' }}>
                Adjust the sliders to see your ongoing monthly cost after the free trial. Voice and chat come out nearly identical — the only difference is a tiny RTC fee on voice.
              </p>
              <Calculator />
            </section>

            {/* Examples */}
            <section id="examples">
              <SectionHeading id="examples" num="§3" title="Monthly Cost Examples" />
              <p className="text-base leading-loose mb-6" style={{ color: '#888888' }}>
                All figures are ongoing (after the 300 free ConvoAI minutes). RTC costs assume voice mode throughout.
              </p>
              <Table
                headers={['Scenario', 'Session time', 'ConvoAI', 'RTC', 'Total / month']}
                rows={[
                  ['Solo dev · 30 min/day · voice', '900 min', '$90.00', <span key="1" style={{ color: '#4ade80' }}>free tier</span>, <strong key="t1">~$90</strong>],
                  ['Solo dev · 1 hr/day · voice', '1,800 min', '$180.00', <span key="2" style={{ color: '#4ade80' }}>free tier</span>, <strong key="t2">~$180</strong>],
                  ['Solo dev · 1 hr/day · chat only', '1,800 min', '$180.00', <span key="3" style={{ color: '#888888' }}>$0</span>, <strong key="t3">~$180</strong>],
                  ['Solo dev · 3 hrs/day · voice', '5,400 min', '$540.00', '~$0.79', <strong key="t4">~$541</strong>],
                  ['Team of 5 · 30 min/day · voice', '4,500 min', '$450.00', <span key="5" style={{ color: '#4ade80' }}>free tier</span>, <strong key="t5">~$450</strong>],
                  ['Team of 10 · 1 hr/day · voice', '18,000 min', '$1,800.00', '~$7.92', <strong key="t6">~$1,808</strong>],
                ]}
              />
            </section>

            {/* Tips */}
            <section id="tips">
              <SectionHeading id="tips" num="§4" title="Cost Optimization" />
              <div className="space-y-4">
                {[
                  { color: 'green' as const, n: 1, content: <><strong>Stop sessions explicitly.</strong> ConvoAI charges from <Code>session.start()</Code> to stop. Voice mode auto-stops after 30 s of silence (<Code>idleTimeout:30</Code>). Chat mode has <Code>idleTimeout:0</Code> — click Stop as soon as you&apos;re done.</> },
                  { color: 'blue' as const, n: 2, content: <><strong>Use chat for quick questions.</strong> Chat mode skips RTC entirely — zero participant-minutes consumed. The ConvoAI cost is identical, but it helps larger teams stay inside the 10,000 free RTC minutes per month.</> },
                  { color: 'purple' as const, n: 3, content: <><strong>One Agora project per team.</strong> Each Agora project gets its own free tier (10,000 RTC min, 1M RTM messages). For large teams, separate projects each get their own free pool — requires separate <Code>appId</Code> and <Code>appCertificate</Code> pairs.</> },
                  { color: 'orange' as const, n: 4, content: <><strong>Monitor in Agora Console.</strong> The Usage dashboard shows ConvoAI minutes, RTC minutes, and RTM messages in real time. Set billing alerts before you expect to hit thresholds — not after.</> },
                  { color: 'blue' as const, n: 5, content: <><strong>Ask about volume pricing.</strong> For sustained monthly spend above ~$200, Agora offers custom / volume pricing. Contact them via the Agora Console. The default rates above are pay-as-you-go.</> },
                ].map(tip => (
                  <div key={tip.n} className="flex gap-4 items-start">
                    <span className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center font-mono text-xs font-bold mt-0.5"
                      style={{ background: 'rgba(9,157,253,0.12)', border: '1px solid rgba(9,157,253,0.25)', color: B }}>
                      {tip.n}
                    </span>
                    <Callout color={tip.color}>{tip.content}</Callout>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <a href="https://www.agora.io/en/pricing/" target="_blank" rel="noopener noreferrer"
                  className="btn-ghost px-5 py-2.5 text-sm inline-flex">
                  Full Agora pricing <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <Link href="/docs#pricing" className="btn-ghost px-5 py-2.5 text-sm inline-flex">
                  Pricing in integration docs →
                </Link>
              </div>

              <p className="text-sm font-mono mt-6" style={{ color: '#555555' }}>
                Rates from agora.io/en/pricing · July 2026. Verify current rates in Agora Console before making budget decisions.
              </p>
            </section>

            </motion.div>
          </main>
        </div>
      </div>
    </div>
  )
}
