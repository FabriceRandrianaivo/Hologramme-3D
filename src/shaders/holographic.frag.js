export const holographicFragmentShader = `
  uniform float time;
  uniform vec3 color;
  uniform float opacity;
  uniform float scanlineSpeed;
  uniform float fresnelPower;
  
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;
  
  void main() {
    // Effet Fresnel
    vec3 viewDirection = normalize(cameraPosition - vPosition);
    float fresnel = pow(1.0 - abs(dot(vNormal, viewDirection)), fresnelPower);
    
    // Scanlines
    float scanline = sin(vPosition.y * 10.0 + time * scanlineSpeed) * 0.5 + 0.5;
    
    // Pulse
    float pulse = sin(time * 1.5) * 0.3 + 0.7;
    
    // Grille holographique
    float grid = step(0.95, fract(vUv.x * 20.0)) + step(0.95, fract(vUv.y * 20.0));
    grid = clamp(grid, 0.0, 1.0);
    
    // Bruit (noise simple)
    float noise = fract(sin(dot(vUv, vec2(12.9898, 78.233)) + time) * 43758.5453);
    
    // Combinaison des effets
    vec3 finalColor = color * (fresnel + 0.3) * (scanline * 0.3 + 0.7) * pulse;
    finalColor += color * grid * 0.2;
    finalColor += vec3(noise) * 0.05;
    
    // Alpha avec fresnel
    float alpha = (fresnel * 0.7 + 0.3) * opacity;
    
    gl_FragColor = vec4(finalColor, alpha);
  }
`;