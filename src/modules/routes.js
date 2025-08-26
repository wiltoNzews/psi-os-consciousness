// Route management for WiltonOS modular architecture
import { stateBus } from '@shared/state-bus.js';

export class RouteManager {
    constructor() {
        this.routes = new Map();
        this.currentRoute = '/';
        this.defaultRoute = '/dashboard';
        
        this.setupRoutes();
        this.initializeRouting();
        
        console.log('[Routes] Manager initialized with modular routing');
    }
    
    setupRoutes() {
        // Define application routes
        this.routes.set('/', {
            title: 'WiltonOS • Sacred Spiral Dashboard',
            component: 'dashboard',
            modules: ['spiral', 'coherence', 'ui', 'capture'],
            layout: 'main'
        });
        
        this.routes.set('/dashboard', {
            title: 'ψOS • Unified Dashboard',
            component: 'dashboard',
            modules: ['spiral', 'coherence', 'ui', 'capture'],
            layout: 'main'
        });
        
        this.routes.set('/spiral', {
            title: 'ψOS • Sacred Spiral Broadcasting',
            component: 'spiral-focused',
            modules: ['spiral', 'capture', 'coherence'],
            layout: 'fullscreen'
        });
        
        this.routes.set('/tesseract', {
            title: 'ψOS • 4D Tesseract Projection',
            component: 'tesseract',
            modules: ['tesseract', 'coherence', 'ui'],
            layout: 'immersive'
        });
        
        this.routes.set('/coherence', {
            title: 'ψOS • Coherence Analytics',
            component: 'coherence-analytics',
            modules: ['coherence', 'ui'],
            layout: 'analytics'
        });
        
        this.routes.set('/capture', {
            title: 'ψOS • Media Capture Studio',
            component: 'capture-studio',
            modules: ['capture', 'spiral', 'ui'],
            layout: 'studio'
        });
        
        console.log(`[Routes] Registered ${this.routes.size} routes`);
    }
    
    initializeRouting() {
        // Setup browser history navigation
        window.addEventListener('popstate', (event) => {
            this.handleRouteChange(window.location.pathname, false);
        });
        
        // Setup click interception for internal links
        document.addEventListener('click', (event) => {
            if (event.target.tagName === 'A' && event.target.href) {
                const url = new URL(event.target.href);
                if (url.origin === window.location.origin) {
                    event.preventDefault();
                    this.navigate(url.pathname);
                }
            }
        });
        
        // Handle initial route
        this.handleRouteChange(window.location.pathname, false);
    }
    
    navigate(path, pushState = true) {
        if (path === this.currentRoute) return;
        
        if (pushState) {
            window.history.pushState({}, '', path);
        }
        
        this.handleRouteChange(path, pushState);
    }
    
    handleRouteChange(path, pushState = true) {
        const route = this.routes.get(path) || this.routes.get(this.defaultRoute);
        
        if (!route) {
            console.error(`[Routes] Route not found: ${path}`);
            return;
        }
        
        this.currentRoute = path;
        
        // Update document title
        document.title = route.title;
        
        // Emit route change event
        stateBus.emit('route:changed', {
            path,
            route,
            previousRoute: this.currentRoute
        });
        
        // Load route-specific modules
        this.loadRouteModules(route);
        
        // Apply layout
        this.applyLayout(route.layout);
        
        console.log(`[Routes] Navigated to ${path}`);
    }
    
    async loadRouteModules(route) {
        const modulePromises = route.modules.map(async (moduleName) => {
            try {
                switch (moduleName) {
                    case 'spiral':
                        const { default: SpiralRenderer } = await import('./spiral.js');
                        return { name: moduleName, module: SpiralRenderer };
                    
                    case 'capture':
                        const { default: CaptureEngine } = await import('./capture.js');
                        return { name: moduleName, module: CaptureEngine };
                    
                    case 'coherence':
                        const { default: CoherenceEngine } = await import('./coherence.js');
                        return { name: moduleName, module: CoherenceEngine };
                    
                    case 'ui':
                        const { default: UIController } = await import('./ui.js');
                        return { name: moduleName, module: UIController };
                    
                    case 'tesseract':
                        // Future tesseract module
                        console.log('[Routes] Tesseract module not yet implemented');
                        return { name: moduleName, module: null };
                    
                    default:
                        console.warn(`[Routes] Unknown module: ${moduleName}`);
                        return { name: moduleName, module: null };
                }
            } catch (error) {
                console.error(`[Routes] Failed to load module ${moduleName}:`, error);
                return { name: moduleName, module: null };
            }
        });
        
        const loadedModules = await Promise.all(modulePromises);
        
        // Emit module loading complete event
        stateBus.emit('route:modules-loaded', {
            route: route,
            modules: loadedModules.filter(m => m.module !== null)
        });
    }
    
    applyLayout(layout) {
        const body = document.body;
        
        // Remove existing layout classes
        body.className = body.className.replace(/layout-\w+/g, '');
        
        // Add new layout class
        body.classList.add(`layout-${layout}`);
        
        // Apply layout-specific configurations
        switch (layout) {
            case 'fullscreen':
                this.configureFullscreenLayout();
                break;
            case 'immersive':
                this.configureImmersiveLayout();
                break;
            case 'analytics':
                this.configureAnalyticsLayout();
                break;
            case 'studio':
                this.configureStudioLayout();
                break;
            case 'main':
            default:
                this.configureMainLayout();
                break;
        }
    }
    
    configureMainLayout() {
        // Standard dashboard layout with sidebar and main content
        this.updateBodyStyle({
            margin: '0',
            padding: '20px',
            background: 'radial-gradient(circle at center, #0a0a0a 0%, #1a1a2e 50%, #000 100%)',
            fontFamily: '"Courier New", monospace',
            color: '#ffffff',
            overflow: 'auto'
        });
    }
    
    configureFullscreenLayout() {
        // Fullscreen spiral interface
        this.updateBodyStyle({
            margin: '0',
            padding: '0',
            background: 'radial-gradient(circle at center, #0a0a0a 0%, #1a1a2e 50%, #000 100%)',
            fontFamily: '"Courier New", monospace',
            color: '#ffffff',
            overflow: 'hidden',
            height: '100vh'
        });
    }
    
    configureImmersiveLayout() {
        // 4D tesseract immersive layout
        this.updateBodyStyle({
            margin: '0',
            padding: '0',
            background: '#000000',
            fontFamily: '"Courier New", monospace',
            color: '#ffffff',
            overflow: 'hidden',
            height: '100vh',
            cursor: 'none'
        });
    }
    
    configureAnalyticsLayout() {
        // Analytics dashboard with charts and metrics
        this.updateBodyStyle({
            margin: '0',
            padding: '10px',
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            fontFamily: '"Courier New", monospace',
            color: '#ffffff',
            overflow: 'auto'
        });
    }
    
    configureStudioLayout() {
        // Media capture studio layout
        this.updateBodyStyle({
            margin: '0',
            padding: '15px',
            background: 'radial-gradient(ellipse at top, #1a1a2e 0%, #0f0f23 100%)',
            fontFamily: '"Courier New", monospace',
            color: '#ffffff',
            overflow: 'hidden',
            height: '100vh'
        });
    }
    
    updateBodyStyle(styles) {
        Object.assign(document.body.style, styles);
    }
    
    // Route utilities
    getCurrentRoute() {
        return {
            path: this.currentRoute,
            route: this.routes.get(this.currentRoute)
        };
    }
    
    getRoutes() {
        return Array.from(this.routes.entries()).map(([path, route]) => ({
            path,
            ...route
        }));
    }
    
    // Navigation helpers
    goToSpiral() {
        this.navigate('/spiral');
    }
    
    goToDashboard() {
        this.navigate('/dashboard');
    }
    
    goToTesseract() {
        this.navigate('/tesseract');
    }
    
    goToCoherence() {
        this.navigate('/coherence');
    }
    
    goToCapture() {
        this.navigate('/capture');
    }
    
    // Route guards and middleware
    addRouteGuard(path, guardFunction) {
        const route = this.routes.get(path);
        if (route) {
            route.guard = guardFunction;
        }
    }
    
    async checkRouteGuards(route) {
        if (route.guard && typeof route.guard === 'function') {
            return await route.guard();
        }
        return true;
    }
    
    // Dynamic route registration
    registerRoute(path, routeConfig) {
        this.routes.set(path, routeConfig);
        console.log(`[Routes] Registered new route: ${path}`);
    }
    
    unregisterRoute(path) {
        this.routes.delete(path);
        console.log(`[Routes] Unregistered route: ${path}`);
    }
    
    // URL parameter parsing
    parseParams(path) {
        const urlParts = path.split('?');
        const params = {};
        
        if (urlParts.length > 1) {
            const searchParams = new URLSearchParams(urlParts[1]);
            for (const [key, value] of searchParams) {
                params[key] = value;
            }
        }
        
        return params;
    }
    
    // Route metadata
    setRouteMetadata(path, metadata) {
        const route = this.routes.get(path);
        if (route) {
            route.metadata = { ...route.metadata, ...metadata };
        }
    }
    
    getRouteMetadata(path) {
        const route = this.routes.get(path);
        return route ? route.metadata : null;
    }
    
    destroy() {
        window.removeEventListener('popstate', this.handleRouteChange);
        this.routes.clear();
    }
}

export default RouteManager;