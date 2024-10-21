export const fragment = /* glsl */ `
    varying float vAlpha;
    varying vec2 vUv;

    void main() {
        gl_FragColor = vec4(vUv, 0., vAlpha);
    }
`;