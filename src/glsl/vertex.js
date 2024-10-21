export const vertex = /* glsl */ `
    uniform float uTime;
    varying float vAlpha;
    varying vec2 vUv;
    attribute vec3 aTranslate;

    void main() {
        // same as z-multiple at creation
        float depth = 5.;
        vUv = uv;

        // move each instance to the translated position
        vec3 newpos = position + aTranslate;

        // make them move towards us
        newpos.z = mod(newpos.z + uTime, 5.);

        // fade in when they get recreated
        vAlpha = smoothstep(0., 1., newpos.z);

        vec4 mvPosition = modelViewMatrix * vec4( newpos, 1. );
        gl_Position = projectionMatrix * mvPosition;
    }
`;