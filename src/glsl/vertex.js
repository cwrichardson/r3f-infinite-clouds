import { rotationMatrix } from './rotation-matrix';

export const vertex = rotationMatrix + /* glsl */ `
    uniform float uTime;
    varying float vAlpha;
    varying vec2 vUv;
    attribute float aRotate;
    attribute vec3 aTranslate;

    vec3 rotate(vec3 v, vec3 axis, float angle) {
        mat4 m = rotationMatrix(axis, angle);
        return (m * vec4(v, 1.0)).xyz;
    }

    void main() {
        // same as z-multiple at creation
        float depth = 5.;
        vUv = uv;
        vec3 newpos = position;

        // rotate around z-axis
        newpos = rotate(newpos, vec3(0., 0., 1.), aRotate);

        // move each instance to the translated position
        newpos += aTranslate;

        // make them move towards us
        newpos.z = mod(newpos.z + uTime * 0.05, 5.);

        // fade in when they get recreated
        vAlpha = smoothstep(0., 1., newpos.z);

        vec4 mvPosition = modelViewMatrix * vec4( newpos, 1. );
        gl_Position = projectionMatrix * mvPosition;
    }
`;