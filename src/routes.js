// Minimal SPA router for WiltonOS unified architecture
import { bootDashboard } from './dashboard.js';
import { mountSpiral } from './modules/spiral.js';

const routes = {
  '/spiral': () => {
    document.body.innerHTML = '<div id="viz" style="width:100vw;height:100vh"></div>';
    return mountSpiral(document.querySelector('#viz'));
  },
  
  '/dashboard': () => {
    document.body.innerHTML = `
      <div id="viz" style="width:80vw;height:80vh;margin:auto;display:flex;align-items:center;justify-content:center"></div>
      <div id="ui-container" style="position:fixed;top:20px;right:20px"></div>
    `;
    return bootDashboard();
  },
  
  '/tesseract': async () => {
    try {
      const { mountTesseract } = await import('./modules/tesseract.js');
      document.body.innerHTML = '<div id="viz" style="width:100vw;height:100vh"></div>';
      return mountTesseract(document.querySelector('#viz'));
    } catch (error) {
      console.log('[Routes] Tesseract module not yet implemented');
      document.body.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:center;height:100vh;color:#ffd700;font-family:'Courier New'">
          <div style="text-align:center">
            <h1>ψOS • 4D Tesseract Projection</h1>
            <p>Coming soon...</p>
            <button onclick="window.location.href='/dashboard'" style="margin-top:20px;padding:10px 20px;background:rgba(255,215,0,0.2);border:1px solid #ffd700;color:#ffd700;border-radius:6px;cursor:pointer">← Back to Dashboard</button>
          </div>
        </div>
      `;
    }
  },
  
  '/coherence': () => {
    document.body.innerHTML = `
      <div style="padding:20px;color:#ffd700;font-family:'Courier New'">
        <h1>ψOS • Coherence Analytics</h1>
        <div id="analytics-container" style="margin-top:20px"></div>
        <button onclick="window.location.href='/dashboard'" style="margin-top:20px;padding:10px 20px;background:rgba(255,215,0,0.2);border:1px solid #ffd700;color:#ffd700;border-radius:6px;cursor:pointer">← Back to Dashboard</button>
      </div>
    `;
    // Future: Load coherence analytics dashboard
    return document.querySelector('#analytics-container');
  },
  
  '/capture': () => {
    document.body.innerHTML = `
      <div style="padding:20px;color:#ffd700;font-family:'Courier New'">
        <h1>ψOS • Media Capture Studio</h1>
        <div id="capture-container" style="margin-top:20px"></div>
        <button onclick="window.location.href='/dashboard'" style="margin-top:20px;padding:10px 20px;background:rgba(255,215,0,0.2);border:1px solid #ffd700;color:#ffd700;border-radius:6px;cursor:pointer">← Back to Dashboard</button>
      </div>
    `;
    // Future: Load capture studio interface
    return document.querySelector('#capture-container');
  },
  
  '/eeg': () => {
    document.body.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 300px;height:100vh;gap:20px;padding:20px;box-sizing:border-box">
        <div id="viz" style="width:100%;height:100%;border:2px solid rgba(255,215,0,0.3);border-radius:12px;background:rgba(0,0,0,0.9);box-shadow:0 0 30px rgba(255,215,0,0.2);backdrop-filter:blur(15px);display:flex;align-items:center;justify-content:center"></div>
        <div id="ui-container" style="height:100%;overflow-y:auto"></div>
      </div>
      <div style="position:fixed;top:20px;left:20px;padding:10px 15px;background:rgba(0,0,0,0.9);border:1px solid rgba(255,215,0,0.3);border-radius:6px;font-size:14px;color:#ffd700;backdrop-filter:blur(10px);font-weight:bold">
        ψOS • EEG Brain Coupling Interface
      </div>
      <div style="position:fixed;top:20px;right:320px;padding:8px 12px;background:rgba(255,215,0,0.1);border:1px solid rgba(255,215,0,0.3);color:#ffd700;border-radius:6px;cursor:pointer;font-family:'Courier New';font-size:12px;text-decoration:none" onclick="window.location.href='/dashboard'">← Dashboard</div>
    `;
    
    // Initialize EEG interface with forced EEG mode
    import('./dashboard.js').then(({ bootDashboard }) => {
      bootDashboard().then(() => {
        // Force EEG mode after boot
        import('./core/coherence.js').then(({ setInputSource }) => {
          setInputSource('eeg');
        });
      });
    });
    
    return document.querySelector('#viz');
  }
};

export function route() {
  const path = window.location.pathname;
  const routeHandler = routes[path] || routes['/dashboard'];
  
  // Apply global styles
  applyGlobalStyles();
  
  // Execute route
  return routeHandler();
}

function applyGlobalStyles() {
  document.body.style.cssText = `
    margin: 0;
    padding: 0;
    background: radial-gradient(circle at center, #0a0a0a 0%, #1a1a2e 50%, #000 100%);
    font-family: 'Courier New', monospace;
    color: #ffffff;
    overflow: hidden;
    height: 100vh;
  `;
  
  // Add global CSS if not present
  if (!document.getElementById('wiltonos-global-styles')) {
    const style = document.createElement('style');
    style.id = 'wiltonos-global-styles';
    style.textContent = `
      * {
        box-sizing: border-box;
      }
      
      .wiltonos-container {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
      }
      
      .wiltonos-canvas {
        border: 2px solid rgba(255, 215, 0, 0.3);
        border-radius: 12px;
        background: rgba(0, 0, 0, 0.9);
        box-shadow: 0 0 30px rgba(255, 215, 0, 0.2);
      }
    `;
    document.head.appendChild(style);
  }
}

// Navigation helper
export function navigateTo(path) {
  window.history.pushState({}, '', path);
  route();
}

// Setup navigation handling
window.addEventListener('popstate', route);

export default route;