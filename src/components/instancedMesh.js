'use client';

import { forwardRef, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { DoubleSide, PlaneGeometry } from 'three';

import { vertex } from '@/glsl/vertex';
import { fragment } from '@/glsl/fragment';
import { useTexture } from '@react-three/drei';

export const InstancedMesh = forwardRef((props, ref) => {
    const { instanceLocations, instanceRotations } = props;
    const shaderRef = useRef();

    /*
     * Playing around with different textures for the clouds. In the
     * tutorial, Yuri had actually grabbed the sprite from the site, but
     * the site is no longer live, so we don't have access to that.
     * 
     * cumulus2 looks best to my eye for a single cloude, but we'll see
     * if we end up using more than one texture.
     */
    const brush = useTexture('/images/brush.png');
    const cumulusRound = useTexture('/images/cloud-5992791_640.png')
    const cumulus = useTexture('/images/cloud-2421760_640.png')
    const cumulus2 = useTexture('/images/clouds-7081496_640.png')
    const stratus = useTexture('/images/cloud-159388_640.png')

    useFrame((state, delta, xrFrame) => {
        // do animation
        shaderRef.current.uniforms.uTime.value += delta;
    })

    // Yuri just uses PlaneBufferGeometry, but in the current version,
    // PlaneGeommetry is an extension of BufferGeometry.
    const instanceGeometry = new PlaneGeometry(.3, .3);

    // extract the args to pass to the instanced geometry
    const instGeoAttrs = Object.entries(instanceGeometry.attributes).map(([key, value]) => ({
        name: `attributes-${key}`,
        arg: value?.array,
        size: value?.itemSize
    }));

    // they PlaneGeometry uses indexed vertices, but index isn't stored in
    // attributes ... but it's an attribute &shrug;
    instGeoAttrs.push({
        name: 'index',
        arg: instanceGeometry.index.array,
        size: instanceGeometry.index.itemSize
    })

    return (
        <>
            <mesh ref={ref}>
                <instancedBufferGeometry instanceCount={instanceLocations.length} geometry={instanceGeometry}>
                    {/* attach instance attributes */}
                    {instGeoAttrs.map((attr, i) => (
                        <bufferAttribute
                            key={i}
                            attach={attr.name}
                            args={[attr.arg, attr.size]}
                        />
                    ))}
                    <instancedBufferAttribute attach={'attributes-aTranslate'} args={[instanceLocations, 3]} />
                    <instancedBufferAttribute attach={'attributes-aRotate'} args={[instanceRotations, 1]} />
                </instancedBufferGeometry>
                
                <shaderMaterial
                ref={shaderRef}
                extensions={{ derivatives: "#extension GL_OES_standard_derivatives : enable"}}
                uniforms={{
                    uTexture: { value: cumulus2 },
                    uTime: { value: 0 }
                }}
                side={DoubleSide}
                vertexShader={vertex}
                fragmentShader={fragment}
                depthTest={false}
                depthWrite={false}
                transparent
                />
            </mesh>
        </>
    )
})

InstancedMesh.displayName = 'Points';