export const fragment = /* glsl */ `
    uniform sampler2D uTexture;

    varying float vAlpha;
    varying vec3 vPosition;
    varying vec2 vUv;

    void main() {
        // hardcoded color from the maisel website
        vec3 color = vec3(0.835, 0.000, 0.564);

        vec4 map = texture2D(uTexture, vUv);

        // colorize based on map's red channel (any channel should work)
        // vec3 final = color * map.r;

        // in the video he does a mix, instead of the multiplication I 
        // do above. If we do from 0:
        // vec3 final = mix(vec3(0.), color, map.r);
        // I can't see any difference in what's rendered vs. the multiplication
        // above. But using 1:
        vec3 final = mix(vec3(1.), color, map.r);
        // produces a very interesting effect. I don't much like it with
        // this particular cloud, but it's pretty cool, and I definitely
        // could see some applications. Try it out.
        // Depending on the shading of the cloud, and whether the canvas
        // is light or dark, there's a huge difference.


        // gl_FragColor = map;
        gl_FragColor = vec4(final, map.a);
        // instead of applying alpha to our vUvs, we use it as a step
        // multiple against the map's alpha channel:
        // gl_FragColor = vec4(vUv, 0., vAlpha);
        gl_FragColor.a *= vAlpha;

        // creation of opacity and mapping is not done, because our
        // images already have transparency, and he had to deal with
        // a black background in the sprite:
        // if (map.r > 0.99) discard;
        // float opacity = smoothstep(0.5, 1., length(vPosition.xy));
        // gl_FragColor = vec4(vUv, 0., vAlpha);
        // gl_FragColor = vec4(opacity);
        // gl_FragColor.a = vAlpha * opacity;
    }
`;