'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { Navbar } from '@/components/navbar'

const B = '#099DFD'
const BL = '#4DC4FF'

const navSections = [
  { group: 'Overview', links: [
    { id: 'products', label: 'Agora Products' },
    { id: 'architecture', label: 'Architecture' },
    { id: 'auth', label: 'Authentication' },
    { id: 'config', label: 'Configuration' },
  ]},
  { group: 'Session Modes', links: [
    { id: 'modes', label: 'Mode Overview' },
    { id: 'voice-flow', label: 'Voice Mode Flow' },
    { id: 'chat-flow', label: 'Chat Mode Flow' },
  ]},
  { group: 'API Reference', links: [
    { id: 'convoai-api', label: 'ConvoAI REST APIs' },
    { id: 'token-api', label: 'Token Builder APIs' },
    { id: 'rtc-api', label: 'RTC Web SDK APIs' },
    { id: 'rtm-api', label: 'RTM Web SDK APIs' },
    { id: 'tokens', label: 'Token Details' },
  ]},
  { group: 'Deep Dive', links: [
    { id: 'providers', label: 'Provider Stacks' },
    { id: 'lifecycle', label: 'Session Lifecycle' },
    { id: 'files', label: 'File Map' },
    { id: 'decisions', label: 'Design Decisions' },
  ]},
  { group: 'Cost', links: [
    { id: 'pricing', label: 'Pricing Guide' },
  ]},
]

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
    blue:   { border: B,       bg: 'rgba(9,157,253,0.08)' },
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

function Code({ children }: { children: React.ReactNode }) {
  return <code className="font-mono text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(9,157,253,0.1)', border: '1px solid rgba(9,157,253,0.2)', color: BL }}>{children}</code>
}

function Pre({ children }: { children: string }) {
  return (
    <pre className="code-block p-5 my-5 text-sm overflow-x-auto leading-relaxed whitespace-pre-wrap break-words"
      style={{ color: '#AAAAAA' }}>
      {children}
    </pre>
  )
}

function ProductCard({ badge, badgeColor, name, desc, version }: {
  badge: string; badgeColor: string; name: string; desc: string; version: string
}) {
  return (
    <div className="glass-card p-6 flex flex-col gap-3">
      <span className="self-start text-xs font-mono font-bold tracking-widest uppercase px-2 py-0.5 rounded-full"
        style={{ background: `${badgeColor}18`, color: badgeColor, border: `1px solid ${badgeColor}30` }}>
        {badge}
      </span>
      <div className="font-mono font-bold text-sm" style={{ color: '#FFFFFF' }}>{name}</div>
      <p className="text-sm leading-relaxed" style={{ color: '#888888' }}>{desc}</p>
      <div className="text-xs font-mono" style={{ color: '#555555' }}>{version}</div>
    </div>
  )
}

function SeqTable({ title, columns, rows }: {
  title: string
  columns: { label: string; color: string }[]
  rows: ({ cells: (string | null)[]; note?: string } | { note: string; cells?: (string | null)[] })[]
}) {
  return (
    <div className="my-5 rounded-xl overflow-hidden" style={{ border: '1px solid rgba(9,157,253,0.15)' }}>
      <div className="px-5 py-3 text-sm font-mono font-bold tracking-widest uppercase"
        style={{ background: 'rgba(9,157,253,0.06)', borderBottom: '1px solid rgba(9,157,253,0.15)', color: '#888888' }}>
        {title}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full" style={{ borderCollapse: 'collapse', minWidth: 500 }}>
          <thead>
            <tr style={{ background: 'rgba(9,157,253,0.03)', borderBottom: '2px solid rgba(9,157,253,0.15)' }}>
              {columns.map((col, i) => (
                <th key={i} className="py-3 px-4 text-center text-xs font-mono font-bold tracking-widest uppercase"
                  style={{ color: col.color, borderRight: i < columns.length - 1 ? '1px solid rgba(9,157,253,0.1)' : 'none' }}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              row.note ? (
                <tr key={ri} style={{ borderBottom: '1px solid rgba(9,157,253,0.08)', background: 'rgba(9,157,253,0.03)' }}>
                  <td colSpan={columns.length} className="px-5 py-2 text-sm italic" style={{ color: '#555555' }}>{row.note}</td>
                </tr>
              ) : (
                <tr key={ri} className="hover:bg-[rgba(9,157,253,0.03)]"
                  style={{ borderBottom: '1px solid rgba(9,157,253,0.08)', minHeight: 40 }}>
                  {(row.cells ?? []).map((cell, ci) => (
                    <td key={ci} className="py-3 px-4 text-center text-sm"
                      style={{ color: '#AAAAAA', borderRight: ci < columns.length - 1 ? '1px solid rgba(9,157,253,0.08)' : 'none', verticalAlign: 'middle' }}>
                      {cell}
                    </td>
                  ))}
                </tr>
              )
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function DocsPage() {
  const [activeId, setActiveId] = useState('')
  const allIds = navSections.flatMap(g => g.links.map(l => l.id))

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        }
      },
      { rootMargin: '-20% 0px -70% 0px' }
    )
    allIds.forEach(id => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24">
        {/* Back link */}
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
              <div className="pb-4 mb-4" style={{ borderBottom: '1px solid rgba(9,157,253,0.12)' }}>
                <div className="flex items-center gap-2 mb-1">
                  <Image src="/agora-logo-mark.svg" alt="Agora" width={18} height={18} />
                  <span className="font-mono font-bold text-sm" style={{ color: '#FFFFFF' }}>Agora Mentor</span>
                </div>
                <div className="text-xs font-mono" style={{ color: '#555555' }}>Integration Reference</div>
              </div>
              {navSections.map((group) => (
                <div key={group.group} className="mb-3">
                  <div className="text-xs font-mono font-bold tracking-widest uppercase mb-1 px-1" style={{ color: '#555555' }}>
                    {group.group}
                  </div>
                  {group.links.map(link => (
                    <a key={link.id} href={`#${link.id}`}
                      className="block py-1 px-2 text-xs rounded transition-all"
                      style={{
                        color: activeId === link.id ? B : '#888888',
                        background: activeId === link.id ? 'rgba(9,157,253,0.08)' : 'transparent',
                        borderLeft: `2px solid ${activeId === link.id ? B : 'transparent'}`,
                      }}>
                      {link.label}
                    </a>
                  ))}
                </div>
              ))}
            </div>
          </aside>

          {/* Main */}
          <main className="flex-1 min-w-0 max-w-3xl">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="mb-12 pb-8" style={{ borderBottom: '1px solid rgba(9,157,253,0.15)' }}>
              <p className="section-label mb-3">Technical Integration Reference</p>
              <h1 className="font-display font-bold leading-tight mb-4" style={{ fontSize: 'clamp(28px, 4vw, 42px)', color: '#FFFFFF', letterSpacing: '-0.03em' }}>
                How Agora is Used in<br />Agora Mentor
              </h1>
              <p className="text-base leading-relaxed mb-5" style={{ color: '#888888', maxWidth: '60ch' }}>
                Complete documentation of every Agora product, SDK, API call, and data flow — for both voice and text chat modes.
              </p>
              <div className="flex flex-wrap gap-2.5">
                {['agora-agents@2.4.0', 'agora-token@2.0.5', 'AgoraRTC_N.js@4.20.2', 'agora-rtm@2.2.3'].map(b => (
                  <span key={b} className="font-mono text-xs px-2.5 py-1 rounded-md"
                    style={{ background: 'rgba(9,157,253,0.08)', border: '1px solid rgba(9,157,253,0.2)', color: B }}>
                    {b}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.1 }}>

            {/* §1 Products */}
            <section id="products">
              <SectionHeading id="products" num="§1" title="Agora Products Used" />
              <p className="text-base leading-loose mb-6" style={{ color: '#888888', maxWidth: '65ch' }}>
                The extension uses four distinct Agora products. Each operates in a different runtime and serves a specific role:
              </p>
              <div className="grid sm:grid-cols-2 gap-3 mb-5">
                <ProductCard badge="ConvoAI" badgeColor={B} name="Conversational AI"
                  desc="Orchestrates the full STT→LLM→TTS pipeline. Hosts the AI agent in Agora's cloud. Called from the Node.js extension host via REST."
                  version="agora-agents SDK · npm · Node.js only" />
                <ProductCard badge="RTC" badgeColor="#4ade80" name="Real-Time Communication"
                  desc="Carries the audio channel: mic capture from the browser companion, and agent voice playback. Browser API — requires a real browser tab."
                  version="AgoraRTC_N.js · browser companion only" />
                <ProductCard badge="RTM" badgeColor="#a78bfa" name="Real-Time Messaging"
                  desc="Delivers structured transcript events (user.transcription / assistant.transcription) to both the VS Code sidebar and the browser companion."
                  version="agora-rtm.js · sidebar + companion" />
                <ProductCard badge="Token" badgeColor="#fbbf24" name="Token Builder"
                  desc="Generates RTC (AccessToken2) and RTM (AccessToken v1) tokens locally in Node.js. No network call — uses appId + appCertificate to sign tokens."
                  version="agora-token · npm · Node.js only" />
              </div>
            </section>

            {/* §2 Architecture */}
            <section id="architecture">
              <SectionHeading id="architecture" num="§2" title="Architecture Overview" />
              <p className="text-base leading-loose mb-6" style={{ color: '#888888', maxWidth: '65ch' }}>
                Four runtime zones communicate through a message-passing bridge. The App Certificate <strong style={{ color: '#FFFFFF' }}>never leaves the extension host</strong> — only minted tokens reach the browser.
              </p>
              <div className="space-y-3">
                {[
                  { label: 'VS Code Extension Host · Node.js', color: B, items: ['extension.ts — Commands · Panel · Bridge', 'backend.ts — AgoraBackendClient', 'agora-agents SDK — AgoraClient · Agent · Session', 'agora-token — RtcTokenBuilder · RtmTokenBuilder'], arrows: ['→ Sends session-live (appId, channel, tokens) to Webview via postMessage', '→ Writes companion HTML to os.tmpdir() and calls openExternal()', '→ Calls ConvoAI REST POST /agents/join via agora-agents SDK'] },
                  { label: 'Webview Sidebar · Browser Sandbox (VS Code)', color: '#a78bfa', items: ['webview.ts HTML/JS — UI · State · Chat Input', 'AgoraRTM Client — Transcript only · uid=1'], arrows: ['↔ postMessage bridge with extension host (start-session, stop-session, chat-message)', '→ RTM: login → subscribe(channel) → addEventListener(\'message\')'] },
                  { label: 'Browser Companion · System Browser (Voice mode only)', color: '#4ade80', items: ['AgoraRTC Client — Mic capture · Agent audio', 'AgoraRTM Client — Transcript fallback · uid=1', 'Stop via REST — keepalive fetch on unload'], arrows: ['→ RTC: join(appId, channel, clientToken, 1) + publishes microphone audio', '← RTC: receives agent audio track → plays through speakers'] },
                  { label: 'Agora Cloud', color: '#f87171', items: ['ConvoAI Agent — STT → LLM → TTS', 'RTC Channel — Audio transport', 'RTM Channel — Transcript events'], arrows: ['↔ Agent publishes synthesized voice audio into the RTC channel', '→ Agent emits assistant.transcription and user.transcription JSON to RTM channel'] },
                ].map(zone => (
                  <div key={zone.label} className="rounded-xl overflow-hidden" style={{ border: `1px solid ${zone.color}25` }}>
                    <div className="px-5 py-3 text-sm font-mono font-bold flex items-center gap-2"
                      style={{ background: `${zone.color}10`, borderBottom: `1px solid ${zone.color}20`, color: zone.color }}>
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: zone.color }} />
                      {zone.label}
                    </div>
                    <div className="p-6 grid sm:grid-cols-2 gap-8">
                      <div className="flex flex-wrap gap-3">
                        {zone.items.map(item => (
                          <div key={item} className="text-sm px-3 py-2 rounded-lg leading-snug"
                            style={{ background: `${zone.color}10`, border: `1px solid ${zone.color}20`, color: '#CCCCCC' }}>
                            {item}
                          </div>
                        ))}
                      </div>
                      <div className="space-y-3">
                        {zone.arrows.map(a => (
                          <div key={a} className="text-sm leading-relaxed" style={{ color: '#888888' }}>
                            <span style={{ color: zone.color, fontFamily: 'monospace', marginRight: 6 }}>{a.charAt(0)}</span>
                            {a.slice(2)}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* §3 Auth */}
            <section id="auth">
              <SectionHeading id="auth" num="§3" title="Authentication" />
              <p className="text-base leading-loose mb-6" style={{ color: '#888888', maxWidth: '65ch' }}>
                Two auth modes are supported for the ConvoAI REST API. The mode is chosen automatically at session start:
              </p>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <Callout color="blue">
                  <strong>Token Auth (default)</strong><br />
                  Uses <Code>appId</Code> + <Code>appCertificate</Code> only. The <Code>agora-agents</Code> SDK derives a ConvoAI token internally. No additional credentials needed.
                </Callout>
                <Callout color="green">
                  <strong>Basic Auth (preferred)</strong><br />
                  Requires <Code>customerId</Code> + <Code>customerSecret</Code> from Agora Console → RESTful API keys. Sent as <Code>Authorization: Basic base64(id:secret)</Code> on every ConvoAI request.
                </Callout>
              </div>
              <Callout color="orange">
                <strong>Security note:</strong> The browser companion receives a pre-computed <Code>stopAuth</Code> value so it can call the stop endpoint on page unload, but <Code>appCertificate</Code> is never sent to any browser context.
              </Callout>
            </section>

            {/* §4 Config */}
            <section id="config">
              <SectionHeading id="config" num="§4" title="VS Code Configuration" />
              <Table
                headers={['Setting', 'Type', 'Default', 'Description']}
                rows={[
                  [<Code key="1">agoraMentor.appId</Code>, 'string', <Code key="2">""</Code>, '32-char hex Agora App ID'],
                  [<Code key="3">agoraMentor.appCertificate</Code>, 'string', <Code key="4">""</Code>, '32-char hex App Certificate · never sent to browser'],
                  [<Code key="5">agoraMentor.customerId</Code>, 'string', <Code key="6">""</Code>, 'RESTful API Customer ID (enables Basic Auth)'],
                  [<Code key="7">agoraMentor.customerSecret</Code>, 'string', <Code key="8">""</Code>, 'RESTful API Customer Secret'],
                  [<Code key="9">agoraMentor.agentUid</Code>, 'string', <Code key="10">"123456"</Code>, 'UID assigned to the AI agent in the RTC channel'],
                  [<Code key="11">agoraMentor.geofence</Code>, 'string', <Code key="12">"us"</Code>, 'Agora geofence region for ConvoAI API calls'],
                ]}
              />
            </section>

            {/* §5 Modes */}
            <section id="modes">
              <SectionHeading id="modes" num="§5" title="Session Mode Overview" />
              <p className="text-base leading-loose mb-6" style={{ color: '#888888' }}>
                Every session uses the ConvoAI engine. The mode determines how input reaches the agent and whether the browser companion is opened.
              </p>
              <Table
                headers={['Mode', 'Input', 'Output', 'RTC', 'Browser tab']}
                rows={[
                  ['Cascading (voice)', 'Microphone audio', 'Synthesized speech + RTM transcript', 'Required', 'Yes'],
                  ['Realtime MLLM (voice)', 'Microphone audio', 'Synthesized speech + RTM transcript', 'Required', 'Yes'],
                  ['Chat (text)', <Code key="c1">session.think(text)</Code>, 'RTM transcript only', 'None', 'No'],
                ]}
              />
              <Callout color="blue">
                <strong>idleTimeout:</strong> Voice sessions use <Code>idleTimeout: 30</Code> (auto-stop after 30 s of silence). Chat sessions use <Code>idleTimeout: 0</Code> — they never auto-stop. Always click Stop when done with a chat session.
              </Callout>
            </section>

            {/* §6 Voice Flow */}
            <section id="voice-flow">
              <SectionHeading id="voice-flow" num="§6" title="Voice Mode Flow" />
              <p className="text-base leading-loose mb-6" style={{ color: '#888888' }}>Extension host → ConvoAI → Browser companion → Audio playback.</p>
              <SeqTable
                title="Voice session startup sequence"
                columns={[
                  { label: 'Extension Host', color: B },
                  { label: 'agora-agents SDK', color: '#fbbf24' },
                  { label: 'ConvoAI API', color: '#f87171' },
                  { label: 'Webview', color: '#a78bfa' },
                  { label: 'Browser', color: '#4ade80' },
                ]}
                rows={[
                  { cells: ['startSession()', null, null, null, null] },
                  { cells: ['new AgoraClient()', null, null, null, null] },
                  { cells: ['buildTokens()', null, null, null, null] },
                  { cells: ['agent.createSession()', '→ POST /agents/join', null, null, null] },
                  { cells: [null, null, '← agentId', null, null] },
                  { cells: ['session.start()', null, null, null, null] },
                  { cells: ['→ session-live msg', null, null, 'joinRtmOnly()', null] },
                  { cells: ['openExternal()', null, null, null, null] },
                  { cells: [null, null, null, null, 'RTC join + mic'] },
                  { cells: [null, null, 'Agent joins RTC', null, null] },
                  { note: 'Voice session live — audio flows via RTC, transcripts via RTM' },
                ]}
              />
            </section>

            {/* §7 Chat Flow */}
            <section id="chat-flow">
              <SectionHeading id="chat-flow" num="§7" title="Chat Mode Flow" />
              <p className="text-base leading-loose mb-6" style={{ color: '#888888' }}>Text input bypasses STT. No browser tab is opened. Transcripts arrive via RTM only.</p>
              <SeqTable
                title="Chat session — message send sequence"
                columns={[
                  { label: 'User (Webview)', color: '#888888' },
                  { label: 'Extension Host', color: B },
                  { label: 'agora-agents SDK', color: '#fbbf24' },
                  { label: 'ConvoAI Agent', color: '#f87171' },
                  { label: 'RTM → Webview', color: '#a78bfa' },
                ]}
                rows={[
                  { cells: ['types message', null, null, null, null] },
                  { cells: ['→ chat-message msg', null, null, null, null] },
                  { cells: [null, 'sendChatMessage()', null, null, null] },
                  { cells: [null, 'session.think(text)', null, null, null] },
                  { cells: [null, null, '→ inject text', 'LLM processes', null] },
                  { cells: [null, null, null, '→ TTS (unused)', null] },
                  { cells: [null, null, null, '→ RTM transcript', null] },
                  { cells: [null, null, null, null, 'assistant.transcription'] },
                  { note: 'No RTC join · No browser tab · idleTimeout: 0' },
                ]}
              />
              <Callout color="purple">
                <strong>think() options:</strong> <Code>on_listening_action: &apos;inject&apos;</Code>, <Code>on_thinking_action: &apos;interrupt&apos;</Code>, <Code>on_speaking_action: &apos;ignore&apos;</Code>, <Code>interruptable: true</Code>
              </Callout>
            </section>

            {/* §8 ConvoAI API */}
            <section id="convoai-api">
              <SectionHeading id="convoai-api" num="§8" title="ConvoAI REST APIs" />
              <Table
                headers={['Operation', 'SDK Method', 'REST endpoint', 'When called']}
                rows={[
                  ['Create + join agent', <Code key="1">agent.createSession()</Code>, <Code key="2">POST /agents/join</Code>, 'startSession()'],
                  ['Start agent session', <Code key="3">session.start()</Code>, 'internal to SDK', 'After createSession()'],
                  ['Send text to agent', <Code key="4">session.think(text)</Code>, 'internal to SDK', 'sendChatMessage()'],
                  ['Stop agent', <Code key="5">client.stopAgent(id)</Code>, <Code key="6">POST /agents/{'{id}'}/leave</Code>, 'stopSession() or tab unload'],
                ]}
              />
              <p className="text-xs font-mono mb-2 mt-4" style={{ color: '#888888' }}>Base URL: <Code>https://api.agora.io/api/conversational-ai-agent/v2/projects/{'{appId}'}/agents/</Code></p>
            </section>

            {/* §9 Token API */}
            <section id="token-api">
              <SectionHeading id="token-api" num="§9" title="Token Builder APIs" />
              <Pre>{`// RTC token (AccessToken2) — used by client + agent
const clientToken = RtcTokenBuilder.buildTokenWithRtm(
  appId, appCertificate,
  channel, String(CLIENT_UID),    // uid = 1
  RtcRole.PUBLISHER,
  SESSION_TTL_SECONDS,            // 3600
  SESSION_TTL_SECONDS
);

// RTM token (AccessToken v1) — used by webview sidebar
const rtmToken = RtmTokenBuilder.buildToken(
  appId, appCertificate,
  String(CLIENT_UID),
  Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS
);`}</Pre>
              <Table
                headers={['Token', 'Builder', 'Token type', 'Used by']}
                rows={[
                  ['clientToken', 'RtcTokenBuilder.buildTokenWithRtm()', 'AccessToken2', 'Browser companion RTC join'],
                  ['rtmToken', 'RtmTokenBuilder.buildToken()', 'AccessToken v1', 'Webview sidebar RTM login'],
                  ['Agent token', 'SDK-internal', 'Derived from appId+cert', 'ConvoAI REST API'],
                ]}
              />
            </section>

            {/* §10 RTC API */}
            <section id="rtc-api">
              <SectionHeading id="rtc-api" num="§10" title="RTC Web SDK APIs" />
              <p className="text-base leading-loose mb-6" style={{ color: '#888888' }}>Used only in the browser companion. The VS Code webview never joins RTC.</p>
              <Table
                headers={['Call', 'Purpose']}
                rows={[
                  [<Code key="1">AgoraRTC.createClient({'{mode:"rtc", codec:"vp8"}'})​</Code>, 'Create RTC client'],
                  [<Code key="2">client.join(appId, channel, token, uid)</Code>, 'Join RTC channel as uid=1'],
                  [<Code key="3">AgoraRTC.createMicrophoneAudioTrack()</Code>, 'Capture microphone'],
                  [<Code key="4">client.publish([micTrack])</Code>, 'Stream mic audio to channel'],
                  [<Code key="5">client.on("user-published", ...)</Code>, 'Detect agent audio track'],
                  [<Code key="6">client.subscribe(agentUser, "audio")</Code>, 'Subscribe to agent audio'],
                  [<Code key="7">audioTrack.play()</Code>, 'Play agent voice through speakers'],
                  [<Code key="8">client.leave()</Code>, 'Leave channel on stop'],
                ]}
              />
            </section>

            {/* §11 RTM API */}
            <section id="rtm-api">
              <SectionHeading id="rtm-api" num="§11" title="RTM Web SDK APIs" />
              <p className="text-base leading-loose mb-6" style={{ color: '#888888' }}>Used in both the webview sidebar and browser companion for transcript delivery.</p>
              <Table
                headers={['Call', 'Purpose']}
                rows={[
                  [<Code key="1">new AgoraRTM.RTM(appId, String(uid))</Code>, 'Create RTM client'],
                  [<Code key="2">rtm.login({'{token: rtmToken}'})</Code>, 'Authenticate'],
                  [<Code key="3">rtm.subscribe(channel)</Code>, 'Subscribe to session channel'],
                  [<Code key="4">rtm.addEventListener("message", ...)</Code>, 'Receive transcript events'],
                  [<Code key="5">rtm.unsubscribe(channel)</Code>, 'Leave channel'],
                  [<Code key="6">rtm.logout()</Code>, 'Clean up on stop'],
                ]}
              />
              <Callout color="blue">
                RTM message payload is JSON with <Code>stream_id</Code>, <Code>text</Code>, <Code>object</Code> (<Code>"assistant.transcription"</Code> or <Code>"user.transcription"</Code>), <Code>turn_id</Code>, and <Code>is_final</Code>. Chunks with the same <Code>turn_id</Code> are streamed in order; the final chunk has <Code>is_final: true</Code>.
              </Callout>
            </section>

            {/* §12 Tokens */}
            <section id="tokens">
              <SectionHeading id="tokens" num="§12" title="Token Details" />
              <Table
                headers={['Field', 'clientToken', 'rtmToken']}
                rows={[
                  ['Type', 'AccessToken2', 'AccessToken v1'],
                  ['Builder', 'RtcTokenBuilder.buildTokenWithRtm()', 'RtmTokenBuilder.buildToken()'],
                  ['UID', '1 (CLIENT_UID constant)', '1 (CLIENT_UID constant)'],
                  ['TTL', '3600 seconds', 'Math.floor(Date.now()/1000) + 3600'],
                  ['Used by', 'Browser companion RTC join', 'Webview sidebar RTM login'],
                  ['Sent to browser?', 'Yes — companion HTML', 'Yes — webview postMessage'],
                ]}
              />
              <Callout color="orange">
                <strong>Two-UID system:</strong> Client (browser/webview) always joins as UID <Code>1</Code>. The AI agent joins as the configured <Code>agentUid</Code> (default <Code>&quot;123456&quot;</Code>). These must be different to avoid channel conflicts.
              </Callout>
            </section>

            {/* §13 Providers */}
            <section id="providers">
              <SectionHeading id="providers" num="§13" title="Provider Stacks" />
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="glass-card p-6">
                  <div className="text-xs font-mono font-bold tracking-widest uppercase mb-5" style={{ color: '#4ade80' }}>Cascading Mode (default)</div>
                  <div className="space-y-4">
                    {[
                      { role: 'STT', provider: 'Deepgram Nova-2', color: B },
                      { role: 'LLM', provider: 'OpenAI GPT-4o', color: BL },
                      { role: 'TTS', provider: 'MiniMax Speech-01-HD', color: '#a78bfa' },
                    ].map(item => (
                      <div key={item.role} className="flex items-center justify-between text-sm">
                        <span className="font-mono text-xs tracking-widest" style={{ color: '#555555' }}>{item.role}</span>
                        <span style={{ color: item.color }}>{item.provider}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="glass-card p-6" style={{ opacity: 0.75 }}>
                  <div className="text-xs font-mono font-bold tracking-widest uppercase mb-5" style={{ color: '#fbbf24' }}>Realtime Mode (MLLM)</div>
                  <div className="space-y-4">
                    {[
                      { role: 'MLLM', provider: 'OpenAI Realtime', color: B },
                      { role: 'MLLM', provider: 'Gemini Live', color: BL },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span className="font-mono text-xs tracking-widest" style={{ color: '#555555' }}>{item.role}</span>
                        <span style={{ color: item.color }}>{item.provider}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm mt-4" style={{ color: '#555555' }}>Single multimodal model handles STT+LLM+TTS as one pipeline.</p>
                </div>
              </div>
            </section>

            {/* §14 Lifecycle */}
            <section id="lifecycle">
              <SectionHeading id="lifecycle" num="§14" title="Session Lifecycle" />
              <div className="flex flex-col gap-0 my-4">
                {[
                  { state: 'IDLE', color: '#555555', bg: 'transparent', border: 'rgba(9,157,253,0.2)' },
                  { arrow: 'startSession() called', label: 'User clicks Start' },
                  { state: 'STARTING', color: '#fbbf24', bg: 'rgba(251,191,36,0.07)', border: '#fbbf24' },
                  { arrow: 'session.start() completes', label: 'Agent ready in cloud' },
                  { state: 'LIVE', color: '#4ade80', bg: 'rgba(74,222,128,0.07)', border: '#4ade80' },
                  { arrow: 'stopSession() or tab close or idle timeout', label: 'User stops or silence' },
                  { state: 'STOPPED', color: '#f87171', bg: 'rgba(248,113,113,0.07)', border: '#f87171' },
                ].map((item, i) => (
                  'state' in item ? (
                    <div key={i} className="self-start px-5 py-2.5 rounded-lg font-mono font-bold text-sm"
                      style={{ border: `2px solid ${item.border}`, background: item.bg, color: item.color }}>
                      {item.state}
                    </div>
                  ) : (
                    <div key={i} className="flex flex-col items-start gap-0.5 ml-6 py-1">
                      <div className="w-px h-4" style={{ background: 'rgba(9,157,253,0.2)' }} />
                      <div className="text-xs font-mono" style={{ color: B }}>{item.arrow}</div>
                      <div className="text-xs" style={{ color: '#555555' }}>{item.label}</div>
                      <div className="w-px h-4" style={{ background: 'rgba(9,157,253,0.2)' }} />
                    </div>
                  )
                ))}
              </div>
            </section>

            {/* §15 Files */}
            <section id="files">
              <SectionHeading id="files" num="§15" title="File Map" />
              <div className="space-y-3">
                {[
                  { path: 'src/extension.ts', desc: 'VS Code entry point. Registers commands, handles webview messages, calls backend, opens browser companion.' },
                  { path: 'src/backend.ts', desc: 'AgoraBackendClient. Owns the agora-agents SDK instance. startSession(), stopSession(), sendChatMessage().' },
                  { path: 'src/webview.ts', desc: 'Full webview HTML + JS (2500+ lines). Sidebar UI, RTM transcript stream, chat input, session state.' },
                  { path: 'src/types.ts', desc: 'SessionState, ModelConfig, all provider ID types.' },
                  { path: 'src/prompt.ts', desc: 'buildMentorPrompt() — assembles system prompt from selection, file, language, and action hint.' },
                  { path: 'media/AgoraRTC_N.js', desc: 'Bundled Agora RTC SDK for the browser companion (not loaded in Node.js or webview).' },
                  { path: 'media/agora-rtm.js', desc: 'Bundled Agora RTM SDK — loaded in the webview sidebar and browser companion.' },
                  { path: 'package.json', desc: 'Node dependencies: agora-agents@2.4.0, agora-token@^2.0.5.' },
                ].map(f => (
                  <div key={f.path} className="flex gap-4 p-5 rounded-xl text-sm"
                    style={{ background: 'rgba(9,157,253,0.04)', border: '1px solid rgba(9,157,253,0.1)' }}>
                    <span className="font-mono text-sm flex-shrink-0 mt-0.5" style={{ color: B, minWidth: 180 }}>{f.path}</span>
                    <span style={{ color: '#888888' }}>{f.desc}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* §16 Design Decisions */}
            <section id="decisions">
              <SectionHeading id="decisions" num="§16" title="Key Design Decisions" />
              <div className="space-y-3">
                <Callout color="blue">
                  <strong>App Certificate never leaves the extension host.</strong> Tokens are minted in Node.js using <Code>agora-token</Code>. The companion receives only the signed <Code>clientToken</Code>, <Code>rtmToken</Code>, and a pre-computed <Code>stopAuth</Code> Basic Auth header — never the raw certificate.
                </Callout>
                <Callout color="green">
                  <strong>Browser companion is a separate HTML file in tmpdir.</strong> The VS Code webview sandbox blocks microphone access and direct audio playback. The companion is written to <Code>os.tmpdir()</Code> and opened via <Code>vscode.env.openExternal()</Code> to get a full browser context with mic/speaker APIs.
                </Callout>
                <Callout color="purple">
                  <strong>Webview uses RTM only — no RTC join.</strong> The sidebar only needs the transcript text, not audio. It joins RTM directly for transcript events without touching the RTC channel, keeping the webview&apos;s Agora footprint minimal.
                </Callout>
                <Callout color="orange">
                  <strong>Chat mode reuses the voice ConvoAI agent.</strong> <Code>idleTimeout:0</Code> prevents auto-stop on silence. <Code>session.think()</Code> bypasses the STT stage entirely, injecting text directly into the LLM pipeline. The agent still runs TTS but no audio is consumed.
                </Callout>
                <Callout color="blue">
                  <strong><Code>enable_rtm: true</Code> is always set.</strong> This ensures transcripts are reliably delivered via the RTM channel in both voice and chat mode, regardless of whether the RTC stream-message data channel is available.
                </Callout>
                <Callout color="green">
                  <strong>Stop endpoint is pre-computed at session start.</strong> The browser companion receives <Code>stopUrl</Code> + <Code>stopAuth</Code> so it can call the ConvoAI stop endpoint with <Code>keepalive: true</Code> even when the tab is being closed.
                </Callout>
              </div>
            </section>

            {/* §17 Pricing */}
            <section id="pricing">
              <SectionHeading id="pricing" num="§17" title="Pricing Guide" />
              <p className="text-base leading-loose mb-6" style={{ color: '#888888', maxWidth: '65ch' }}>
                Three Agora products run under the hood. Their costs differ dramatically — ConvoAI dominates everything else regardless of mode.
              </p>
              <div className="flex flex-wrap gap-2 mb-5">
                {['300 min free · ConvoAI (one-time)', '10,000 min/mo free · RTC', '1M msgs/mo free · RTM'].map(b => (
                  <span key={b} className="text-xs font-mono px-2.5 py-1 rounded-full font-bold"
                    style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.25)', color: '#4ade80' }}>
                    ✓ {b}
                  </span>
                ))}
              </div>
              <div className="grid sm:grid-cols-3 gap-4 mb-6">
                {[
                  { badge: 'ConvoAI', color: B, name: 'Conversational AI', rate: '$0.10', unit: '/ min', free: 'First 300 min free (one-time)', desc: 'Applies to every session — voice and chat. The dominant cost.' },
                  { badge: 'RTC', color: '#4ade80', name: 'Voice Calling', rate: '$0.99', unit: '/ 1,000 min', free: 'First 10,000 min/mo free', desc: 'Voice mode only. Two participants per session.' },
                  { badge: 'RTM', color: '#a78bfa', name: 'Signaling', rate: '$59', unit: '/ mo (next tier)', free: 'First 1M msgs/mo free', desc: '~278 hrs of conversation per month on the free tier.' },
                ].map(p => (
                  <div key={p.badge} className="glass-card p-6 flex flex-col gap-3">
                    <span className="self-start text-xs font-mono font-bold tracking-widest uppercase px-2 py-0.5 rounded-full"
                      style={{ background: `${p.color}18`, color: p.color, border: `1px solid ${p.color}30` }}>
                      {p.badge}
                    </span>
                    <div className="font-mono font-bold text-sm" style={{ color: '#FFFFFF' }}>{p.name}</div>
                    <div className="font-mono font-bold" style={{ fontSize: '1.4rem', color: '#FFFFFF', lineHeight: 1.2 }}>
                      {p.rate}<span className="text-xs font-normal" style={{ color: '#888888' }}> {p.unit}</span>
                    </div>
                    <div className="text-sm font-bold" style={{ color: '#4ade80' }}>✓ {p.free}</div>
                    <p className="text-sm leading-relaxed" style={{ color: '#888888' }}>{p.desc}</p>
                  </div>
                ))}
              </div>

              <h3 className="font-mono font-bold text-base mb-4 mt-8" style={{ color: '#FFFFFF' }}>Cost by mode</h3>
              <Table
                headers={['Cost component', 'Voice mode', 'Chat mode']}
                rows={[
                  ['ConvoAI agent', '$0.10/min — primary cost', '$0.10/min — only cost'],
                  ['RTC audio', '~$0.002/min (usually free tier)', <span key="rtc" style={{ color: '#888888' }}>$0 — not used</span>],
                  ['RTM transcripts', <span key="rtmv" style={{ color: '#4ade80' }}>free tier</span>, <span key="rtmc" style={{ color: '#4ade80' }}>free tier</span>],
                  [<strong key="t">Effective total</strong>, <strong key="tv">~$0.102/min</strong>, <strong key="tc">~$0.10/min</strong>],
                ]}
              />

              <h3 className="font-mono font-bold text-base mb-4 mt-8" style={{ color: '#FFFFFF' }}>Monthly cost examples (after free trial)</h3>
              <Table
                headers={['Scenario', 'Session time', 'ConvoAI', 'RTC', 'Total']}
                rows={[
                  ['Solo dev · 30 min/day · voice', '900 min', '$90', <span key="1" style={{ color: '#4ade80' }}>free tier</span>, <strong key="t1">~$90</strong>],
                  ['Solo dev · 1 hr/day · voice', '1,800 min', '$180', <span key="2" style={{ color: '#4ade80' }}>free tier</span>, <strong key="t2">~$180</strong>],
                  ['Solo dev · 1 hr/day · chat only', '1,800 min', '$180', <span key="3" style={{ color: '#888888' }}>$0</span>, <strong key="t3">~$180</strong>],
                  ['Team of 5 · 30 min/day', '4,500 min', '$450', <span key="4" style={{ color: '#4ade80' }}>free tier</span>, <strong key="t4">~$450</strong>],
                  ['Team of 10 · 1 hr/day', '18,000 min', '$1,800', '~$7.92', <strong key="t5">~$1,808</strong>],
                ]}
              />

              <div className="space-y-4 mt-6">
                {[
                  { color: 'green' as const, text: <><strong>Stop sessions explicitly.</strong> ConvoAI charges from <Code>session.start()</Code> to stop. Chat mode has <Code>idleTimeout:0</Code> — click Stop as soon as you&apos;re done.</> },
                  { color: 'blue' as const, text: <><strong>Use chat for quick questions.</strong> Chat mode skips RTC entirely — zero RTC participant-minutes consumed.</> },
                  { color: 'purple' as const, text: <><strong>One Agora project per team.</strong> Each project gets its own free tier (10,000 RTC min, 1M RTM messages/month).</> },
                  { color: 'orange' as const, text: <><strong>Monitor in Agora Console.</strong> The Usage dashboard shows ConvoAI minutes, RTC minutes, and RTM messages in real time.</> },
                ].map((tip, i) => <Callout key={i} color={tip.color}>{tip.text}</Callout>)}
              </div>

              <p className="text-sm font-mono mt-6" style={{ color: '#555555' }}>
                Rates from{' '}
                <a href="https://www.agora.io/en/pricing/" target="_blank" rel="noopener noreferrer" style={{ color: B }}>
                  agora.io/en/pricing <ExternalLink className="inline w-3 h-3 ml-0.5" />
                </a>
                {' '}· July 2026. Verify current rates before making budget decisions.
              </p>
            </section>

            </motion.div>
          </main>
        </div>
      </div>
    </div>
  )
}
