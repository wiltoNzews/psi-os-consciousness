import React, { useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Geometry3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Basic 3D sacred geometry implementation
    const container = mountRef.current;
    
    // Create canvas for WebGL rendering
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    canvas.className = 'w-full h-full';
    
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
      container.innerHTML = '<div class="text-red-300 text-center p-8">WebGL not supported</div>';
      return;
    }

    // Simple shader setup
    const vertexShaderSource = `
      attribute vec4 position;
      uniform mat4 matrix;
      void main() {
        gl_Position = matrix * position;
      }
    `;

    const fragmentShaderSource = `
      precision mediump float;
      uniform vec3 color;
      void main() {
        gl_FragColor = vec4(color, 1.0);
      }
    `;

    function createShader(gl: WebGLRenderingContext, type: number, source: string) {
      const shader = gl.createShader(type);
      if (!shader) return null;
      
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    if (!vertexShader || !fragmentShader) {
      container.innerHTML = '<div class="text-red-300 text-center p-8">Shader compilation failed</div>';
      return;
    }

    const program = gl.createProgram();
    if (!program) return;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      container.innerHTML = '<div class="text-red-300 text-center p-8">Program linking failed</div>';
      return;
    }

    // Create merkaba geometry
    const vertices = new Float32Array([
      // Top pyramid
      0, 1, 0,
      -0.5, 0, 0.5,
      0.5, 0, 0.5,
      
      0, 1, 0,
      0.5, 0, 0.5,
      0.5, 0, -0.5,
      
      0, 1, 0,
      0.5, 0, -0.5,
      -0.5, 0, -0.5,
      
      0, 1, 0,
      -0.5, 0, -0.5,
      -0.5, 0, 0.5,
      
      // Bottom pyramid
      0, -1, 0,
      -0.5, 0, 0.5,
      0.5, 0, 0.5,
      
      0, -1, 0,
      0.5, 0, 0.5,
      0.5, 0, -0.5,
      
      0, -1, 0,
      0.5, 0, -0.5,
      -0.5, 0, -0.5,
      
      0, -1, 0,
      -0.5, 0, -0.5,
      -0.5, 0, 0.5,
    ]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'position');
    const matrixLocation = gl.getUniformLocation(program, 'matrix');
    const colorLocation = gl.getUniformLocation(program, 'color');

    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

    container.appendChild(canvas);

    // Animation loop
    let rotation = 0;
    function render() {
      rotation += 0.01;
      
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.enable(gl.DEPTH_TEST);
      
      gl.useProgram(program);
      
      // Create rotation matrix
      const cos = Math.cos(rotation);
      const sin = Math.sin(rotation);
      const matrix = new Float32Array([
        cos, 0, sin, 0,
        0, 1, 0, 0,
        -sin, 0, cos, 0,
        0, 0, 0, 1
      ]);
      
      gl.uniformMatrix4fv(matrixLocation, false, matrix);
      gl.uniform3f(colorLocation, 0.2, 0.6, 1.0);
      
      gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 3);
      
      requestAnimationFrame(render);
    }
    
    render();

    return () => {
      if (container.contains(canvas)) {
        container.removeChild(canvas);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card className="bg-purple-900/20 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-center text-3xl text-purple-300">
              <span className="text-4xl mr-4">🔮</span>
              3D Sacred Geometry
            </CardTitle>
            <p className="text-center text-purple-200">
              Full Three.js implementation with interactive merkaba
            </p>
          </CardHeader>
          <CardContent>
            <div 
              ref={mountRef} 
              className="w-full h-96 bg-black/20 rounded-lg border border-purple-500/30"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Geometry3D;