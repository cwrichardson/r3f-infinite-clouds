'use client';

import { forwardRef, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { DoubleSide, PlaneGeometry } from 'three';

import { vertex } from '@/glsl/vertex';
import { fragment } from '@/glsl/fragment';

export const InstancedMesh = forwardRef((props, ref) => {
    const { instanceLocations } = props;
    const shaderRef = useRef();

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
                    <instancedBufferAttribute attach={'attributes-aTranslate'} args={[instanceLocations, 3, false]} />
                </instancedBufferGeometry>
                
                <shaderMaterial
                ref={shaderRef}
                extensions={{ derivatives: "#extension GL_OES_standard_derivatives : enable"}}
                uniforms={{
                    uTime: { value: 0 }
                }}
                side={DoubleSide}
                vertexShader={vertex}
                fragmentShader={fragment}
                depthTest={false}
                transparent
                />
            </mesh>
        </>
    )
})

InstancedMesh.displayName = 'Points';