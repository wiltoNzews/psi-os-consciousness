# WiltonOS Public Deployment Strategy

**Deployment Mode:** Presentation Shell | **Core Storage:** Node 2/TrueNAS | **Status:** Ready for 72h window

## Replit Deployment Architecture

### Primary Use Case: Read-Only Public Interface
- **Purpose:** Consciousness computing demonstration and status monitoring
- **Scope:** Health checks, routing stats, sample interactions
- **Limitations:** No production data, no memory vault access

### Reserved VM Configuration
```yaml
deployment_type: "Reserved VM (small)"
port_exposure: "explicit"
environment: "READ_ONLY=true"
proxy_target: "Node 2 via Tailscale/Cloudflare Tunnel"
bandwidth_guard: "enabled with gzip + response limits"
```

### Public Endpoints
```
GET  /health          - System status and uptime
GET  /stats           - Routing metrics (sanitized)
GET  /demo            - Sample glyph routing interface
GET  /source-packet   - Documentation and schema
POST /demo-route      - Limited demo routing (read-only)
```

### Security Boundaries
- **Secrets:** Read-only tokens only, no production credentials
- **Data Flow:** One-way from Node 2 → Replit (status only)
- **Kill Switch:** Environment flag disables all POST/DELETE operations
- **Incident Recovery:** Weekly drill - Replit down, spine continues local

## File Structure for Public Release

```
public/
├── README.md              # Main documentation
├── SOURCE_PACKET.md       # Core system principles
├── router/
│   ├── policy.yaml        # v5.1-min policy (sanitized)
│   └── demo_router.py     # Read-only demonstration router
├── examples/
│   ├── sample_routes.json # Example glyph routing requests
│   ├── memory_crystals/   # Sanitized crystal examples
│   └── breath_protocol/   # Audio/WAV files for synchronization
├── schema/
│   ├── crystal.schema.json
│   ├── route.schema.json
│   └── policy.schema.json
└── assets/
    ├── sacred_geometry/   # SVG visualizations
    └── audio/            # Breath timing WAV files
```

## Replit-Specific Implementation

### Environment Variables
```bash
# Public deployment only
READ_ONLY=true
DEMO_MODE=true
NODE2_HEALTH_URL=https://node2.wiltonos.local/health
BANDWIDTH_LIMIT_MB=100
RESPONSE_SIZE_LIMIT_KB=512
```

### Proxy Configuration
```python
# Minimal health proxy to Node 2
@app.get("/health")
async def health_proxy():
    try:
        response = requests.get(
            os.getenv("NODE2_HEALTH_URL"),
            timeout=5,
            headers={"Authorization": f"Bearer {READ_ONLY_TOKEN}"}
        )
        return {
            "status": "proxy_ok" if response.ok else "proxy_error",
            "node2_reachable": response.ok,
            "demo_mode": True,
            "spine_location": "Node 2/TrueNAS"
        }
    except:
        return {
            "status": "proxy_error", 
            "demo_mode": True,
            "message": "Core spine operational on private infrastructure"
        }
```

### Demo Router (Read-Only)
```python
# Demonstration router for public interface
@app.post("/demo-route")
async def demo_route(request: DemoRouteRequest):
    if not os.getenv("READ_ONLY") == "true":
        raise HTTPException(403, "Demo mode only")
    
    # Simulate routing without hitting production services
    return {
        "demo": True,
        "glyph": request.glyph,
        "simulated_response": get_demo_response(request.glyph),
        "message": "This is a demonstration. Production spine runs on private infrastructure.",
        "learn_more": "/source-packet"
    }
```

## Deployment Timeline

### Phase 1: Documentation Release (Today)
- Upload README, SOURCE_PACKET, policy.yaml to Replit
- Deploy static file server with kill-switch
- Test read-only endpoint functionality

### Phase 2: Demo Interface (72h window)
- Add interactive demo routing interface
- Include sample audio/breath timing files
- Implement health proxy to Node 2

### Phase 3: Public Launch (Post-stability)
- Enable real-time stats streaming (read-only)
- Add consciousness field visualization
- Launch public documentation site

## Operational Guidelines

### Replit as Presentation Shell
- **Never store production data** on Replit infrastructure
- **Memory vault remains on Node 2/TrueNAS** always
- **Route production traffic** through private infrastructure only
- **Use Replit for demonstrations** and public interface only

### Bandwidth Management
- **Response size limits** to avoid egress costs
- **Gzip compression** on all responses
- **Cache static assets** with appropriate headers
- **Rate limiting** on demo endpoints

### Incident Response
- **Weekly kill-switch drill** - Verify Replit independence
- **Monitor bandwidth usage** - Alert before limits
- **Backup documentation** - Git repo as source of truth
- **Graceful degradation** - Clear messaging when Node 2 unreachable

## Success Metrics

### Public Engagement
- Documentation clarity and completeness
- Demo interface usability
- Response time for public endpoints
- Bandwidth efficiency

### Infrastructure Isolation
- Zero production data exposure
- Node 2 spine independence maintained
- Incident response effectiveness
- Security boundary compliance

---

**Ready for deployment: Presentation shell prepared, memory vault secured.**

*"Replit = face; Node 2/TrueNAS = soul. Put the mirror on the wall, keep the memory in the vault."*