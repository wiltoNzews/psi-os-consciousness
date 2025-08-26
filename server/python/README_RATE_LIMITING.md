# Rate Limit Middleware - Technical Guide

## Overview
This README provides technical guidance on the Rate Limit Middleware implementation in the WiltonOS AI Agent. This middleware is a critical security component that maintains the quantum balance ratio of 3:1 (75% coherence, 25% exploration) while protecting the system from overuse.

## Implementation Notes

### Core Components
1. **slowapi Integration**: We use the `slowapi` library, which is compatible with FastAPI and provides asynchronous rate limiting.
2. **Environment Configuration**: Rate limits are configurable via environment variables for flexibility.
3. **Endpoint-Specific Limits**: Different rate limits are applied to different endpoints based on their quantum balance profile.

### Code Structure

```python
# Environment variables for rate limits
RATE_LIMIT_DEFAULT = os.getenv("RATE_LIMIT_DEFAULT", "30/minute")  # Default (stability-focused)
RATE_LIMIT_CHAT = os.getenv("RATE_LIMIT_CHAT", "15/minute")        # Chat (exploration-focused)

# Limiter configuration
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=[RATE_LIMIT_DEFAULT],
    headers_enabled=True,
    strategy="fixed-window",
)

# Application setup
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Endpoint-specific rate limits
@app.post("/chat", response_model=ChatResponse)
@limiter.limit(RATE_LIMIT_CHAT)  # More restrictive for exploration endpoints
async def chat(...):
    ...

@app.get("/metrics")
@limiter.limit(RATE_LIMIT_DEFAULT)  # Less restrictive for stability endpoints
async def metrics(...):
    ...
```

## Quantum Balance Preservation

### The 3:1 Ratio
The rate limits are configured to maintain the 3:1 quantum balance ratio (75% coherence, 25% exploration) at the API level:

1. **Stability/Coherence Endpoints** (75%): 
   - Endpoints like `/metrics` and `/health`
   - Higher rate limit: 30 requests/minute
   - These endpoints are critical for system monitoring and stability

2. **Exploration Endpoints** (25%):
   - Endpoints like `/chat`
   - Lower rate limit: 15 requests/minute
   - These endpoints involve more resource-intensive, exploratory operations

The ratio between these limits (2:1) contributes to the overall 3:1 system balance when combined with other components.

### Mathematical Balance
The rate limits mathematically reflect the quantum balance:

- Stability endpoints: 30 requests/minute
- Exploration endpoints: 15 requests/minute
- Ratio: 30:15 = 2:1

This 2:1 ratio at the API level combines with internal processing ratios to maintain the overall system's 3:1 quantum balance.

## Integration with Auto-Recalibration

The rate limit middleware works in conjunction with the Auto-Recalibration Service to maintain system balance. When the system detects a deviation from the 3:1 ratio:

1. The Auto-Recalibration Service can be triggered
2. Rate limits may be dynamically adjusted through environment variable updates
3. System coherence is restored through a combination of rate limiting and internal rebalancing

## Testing

The implementation includes tests to verify:
1. Rate limit headers are properly applied
2. Different endpoints have appropriate rate limits
3. Exceeding the rate limit returns a 429 Too Many Requests response
4. The 3:1 quantum balance is maintained across the system

Run tests with:
```
pytest server/tests/test_rate_limiting.py -v
```

## Security Considerations

1. **IP Spoofing Prevention**: The system uses `get_remote_address()` to accurately identify client IPs
2. **Headers**: All responses include rate limit headers for client transparency
3. **Retry-After**: When rate limited, responses include a `Retry-After` header
4. **Custom 429 Response**: A JSON response with detailed error information is provided

## Monitoring

All rate limit events are logged with:
- Client IP
- Endpoint accessed
- Current rate limit
- Remaining requests
- Reset time

These logs can be monitored to detect abuse patterns and fine-tune the rate limits.

## Configuration Recommendations

For production environments:
- Adjust rate limits based on expected traffic
- Consider implementing a distributed rate limiter with Redis
- Implement additional rate limiting at the edge (load balancer/API gateway)
- Reduce the default limits initially and gradually increase based on usage patterns

## Debugging

If rate limiting issues occur:
1. Check logs for `[QUANTUM_STATE: WARNING_FLOW]` entries
2. Verify environment variables are correctly set
3. Check that the `X-RateLimit-*` headers are present in responses
4. Verify the `X-Quantum-Balance` header shows "3:1"

## Conclusion

The rate limit middleware is a critical component of the WiltonOS security architecture that not only protects the system from abuse but also maintains the essential quantum balance ratio of 3:1, ensuring optimal system performance.