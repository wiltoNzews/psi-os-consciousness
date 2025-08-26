# Debug Fixes for WebSocket Issues and Performance Optimization

## Issue 1: Vite WebSocket Connection Errors

The WebSocket connection for Vite HMR is failing with the error:
```
Failed to construct 'WebSocket': The URL 'wss://localhost:undefined/?token=u1H4hyDjG9bM' is invalid.
```

This is happening because the WebSocket URL is being constructed with `undefined` as the port. This is likely occurring because:

1. The port is not being correctly stored in the global object
2. The server-info endpoint is returning `null` for the port in Replit environment (by design for proxied environments)
3. Vite is trying to create its own WebSocket URL using `localhost:undefined` 

## Issue 2: Slow Application Loading (2+ minutes)

The application takes an extremely long time to load (over 2 minutes). This is caused by:

1. Complex mathematical operations in the visualization components
2. Inefficient WebSocket connection handling
3. Redundant API calls
4. Excessive calculations in render cycles

## Solution Approach for WebSocket Issues

1. Optimized the WebSocketContext to handle connection errors more gracefully
2. Enhanced the server-info.js file to provide better fallbacks and reduce computation
3. Implemented URL caching to prevent redundant URL construction operations
4. Added proper error handling for WebSocket connection failures

## Performance Optimizations Implemented

### 1. Lemniscate Calculation Optimization
- Replaced `Math.pow(Math.sin(t), 2)` with `sinT * sinT` (direct multiplication)
- Pre-cached trigonometric values (sin/cos) to avoid repeated calculations
- Eliminated redundant calculations of `Math.cos(2 * t)`

### 2. Lemniscate Points Generation
- Pre-computed the scale factor (2 * Math.PI / numPoints) once instead of calculating in every loop iteration
- Simplified t-value calculation (i * tScale instead of (i / numPoints) * 2 * Math.PI)

### 3. Color Blending Optimization
- Implemented color caching to avoid repeated parsing and conversion of the same hex colors
- Used a lookup table approach to cache blended colors based on input parameters
- Optimized the blend ratio calculation (calculate 1-ratio once and reuse)

### 4. Secondary Lemniscate Optimization
- Added caching for secondary lemniscate points
- Changed from object-based data to array-based data in keyPositions to reduce object creation overhead
- Used traditional for-loops instead of more expensive forEach for iterating over arrays
- Batch-transformed points in memory instead of using map() in the datum call

### 5. Server Info and WebSocket URL Optimization
- Implemented first-level caching of WebSocket URLs
- Reduced computation by returning early if cached values are available
- Simplified WebSocket URL construction logic
- Improved error handling and fallbacks

## Results

The optimizations reduced redundant calculations, eliminated inefficient data structures, and leveraged caching to improve performance. With these changes, the application should load significantly faster than the previous 2+ minutes.

## Next Steps

1. Continue monitoring WebSocket connection stability
2. Consider implementing lazy loading for non-critical components
3. Further optimize visualization components by implementing web workers for heavy calculations
4. Explore using requestAnimationFrame more efficiently and implementing throttling for animations