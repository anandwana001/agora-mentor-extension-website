'use client'

export function AuroraMesh() {
  return (
    <div className="aurora-mesh" aria-hidden="true">
      <div className="dot-grid" />
      {/* Primary Agora blue orb — upper left */}
      <div
        style={{
          position: 'absolute',
          width: '900px',
          height: '700px',
          top: '-15%',
          left: '-8%',
          background: 'radial-gradient(ellipse, rgba(9,157,253,0.18) 0%, transparent 65%)',
          filter: 'blur(80px)',
        }}
      />
      {/* Secondary blue orb — lower right */}
      <div
        style={{
          position: 'absolute',
          width: '700px',
          height: '500px',
          bottom: '0%',
          right: '-5%',
          background: 'radial-gradient(ellipse, rgba(9,157,253,0.1) 0%, transparent 65%)',
          filter: 'blur(90px)',
        }}
      />
      {/* Lighter blue accent — center right */}
      <div
        style={{
          position: 'absolute',
          width: '500px',
          height: '400px',
          top: '25%',
          right: '10%',
          background: 'radial-gradient(ellipse, rgba(77,196,255,0.06) 0%, transparent 70%)',
          filter: 'blur(70px)',
        }}
      />
    </div>
  )
}
