export const fragment = /* glsl */ `
    uniform sampler2D uTexture;

    varying float vAlpha;
    varying vec2 vUv;

    void main() {
        vec4 map = texture2D(uTexture, vUv);
        // gl_FragColor = vec4(vUv, 0., vAlpha);
        gl_FragColor = map;
    }
`;