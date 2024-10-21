export const vertex = /* glsl */ `
    uniform float uTime;
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

        vec4 mvPosition = modelViewMatrix * vec4( newpos, 1. );
        gl_Position = projectionMatrix * mvPosition;
    }
`;