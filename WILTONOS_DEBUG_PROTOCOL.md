# WiltonOS Debug Protocol - Iframe Loading Issues

## PROBLEM ANALYSIS
- **Unified Dashboard Loading**: ✅ Main interface loads correctly
- **Module Routes**: ✅ All HTML files accessible (HTTP 200)
- **Iframe Content**: ❌ Modules not displaying within iframes
- **Console Logs**: Showing repeated initialization messages

## ROOT CAUSE IDENTIFICATION

### Issue 1: Content Security Policy (CSP)
Iframes may be blocked by CSP headers preventing embedded content.

### Issue 2: JavaScript Execution Context
Sacred geometry modules with Three.js may fail in iframe sandboxing.

### Issue 3: Relative Path Resolution
CSS/JS assets within iframes may not resolve correctly.

## DIAGNOSTIC STEPS

### Step 1: Test Direct Access
```bash
# Verify modules work independently
curl http://localhost:5000/geometria-sagrada-3d.html
curl http://localhost:5000/sacred-geometry-demo.html
curl http://localhost:5000/teatro-visual/index.html
```

### Step 2: Check Console Errors
Monitor browser console for:
- CSP violations
- JavaScript errors
- Resource loading failures
- Three.js initialization errors

### Step 3: Iframe Sandboxing
Test iframe attributes:
- `sandbox="allow-scripts allow-same-origin"`
- `allow="web-gl"` for Three.js content

## SOLUTION MATRIX

### Solution A: Direct Route Serving
Replace iframe approach with direct navigation to preserve full context.

### Solution B: Enhanced Iframe Configuration
Add proper sandbox permissions and CSP headers.

### Solution C: Component Integration
Integrate sacred geometry directly into unified dashboard without iframes.

### Solution D: External Window Approach
Open modules in new windows/tabs with proper context.

## IMPLEMENTATION PRIORITY
1. Fix iframe CSP and sandbox configuration
2. Add comprehensive error handling and logging
3. Create fallback direct navigation system
4. Integrate external AI debugging assistance

## EXTERNAL AI INTEGRATION PLAN
- **GitHub Copilot**: Code analysis and iframe debugging
- **ChatGPT API**: Systematic error diagnosis
- **Gemini Pro**: Visual debugging assistance
- **Local DeepSeek**: Formal verification of fixes