export const particleVertexShader = `
  uniform float time;
  uniform float size;
  
  varying vec3 vColor;
  
  void main() {
    vColor = color;
    
    vec3 pos = position;
    
    // Animation des particules
    pos.y += sin(time + position.x * 10.0) * 0.1;
    pos.x += cos(time + position.y * 10.0) * 0.1;
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = size * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;