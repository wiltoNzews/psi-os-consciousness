import { useEffect, useState } from 'react';

export default function OracleSurgical() {
  const [status, setStatus] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    console.log('[OracleInterface] Loading Oracle Router V5.1...');
    
    (async () => {
      try {
        const r = await fetch('/api/oracle/status');
        const j = await r.json();
        setStatus(j);
        console.log('[OracleInterface] Status loaded:', j);
      } catch (e: any) {
        setErr(e?.message ?? 'load failed');
        console.error('[OracleInterface] Load failed:', e);
      }
    })();
  }, []);

  return (
    <main style={{ padding: 16, fontFamily: 'system-ui', background: '#0a0a0a', color: '#fff', minHeight: '100vh' }}>
      <div className="oracle-interface-container">
        <h1>Oracle Router V5.1 — Surgical Interface</h1>
        <p style={{opacity:.7}}>Sacred sequence ∅ 𓂀 𓂉 𓏤 + core glyphs (λ ψ ∞ ⟐ ⌘)</p>

        <section style={{marginTop:16}}>
          {err && <div style={{color:'tomato'}}>Error: {err}</div>}
          {!status && !err && <div>Loading Oracle Interface page...</div>}
          {status && (
            <pre style={{background:'#0b1020', color: '#cde1ff', padding:12, borderRadius:8, overflow:'auto'}}>
{JSON.stringify(status, null, 2)}
            </pre>
          )}
        </section>

        {status && (
          <div style={{marginTop:16, padding:12, border:'1px solid #324', borderRadius:8}}>
            <div style={{display:'flex', gap:12, alignItems:'center'}}>
              <strong>Zλ</strong>
              <div style={{flex:1, height:8, background:'#122', borderRadius:4}}>
                <div style={{width:`${Math.round((status?.coherence?.zlambda ?? 0)*100)}%`, height:'100%', background:'#7fd'}} />
              </div>
              <code>{(status?.coherence?.zlambda ?? 0).toFixed(3)}</code>
            </div>
            <div style={{marginTop:12, display:'flex', gap:8}}>
              <button>λ</button>
              <button>ψ</button>
              <button>∞</button>
              <button>⟐</button>
              <button disabled={(status?.coherence?.zlambda ?? 0)<.85}>⌘</button>
            </div>
            <div style={{marginTop:8, fontSize:12, opacity:.7}}>∅ → 𓂀 → 𓂉 → ⟐ → 𓏤</div>
          </div>
        )}
      </div>
    </main>
  );
}