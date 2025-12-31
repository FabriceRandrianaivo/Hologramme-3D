export const particleFragmentShader = `
  varying vec3 vColor;
  
  void main() {
    // Créer un point circulaire
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);
    
    if (dist > 0.5) discard;
    
    // Gradient radial
    float alpha = 1.0 - (dist * 2.0);
    
    gl_FragColor = vec4(vColor, alpha * 0.6);
  }
`;