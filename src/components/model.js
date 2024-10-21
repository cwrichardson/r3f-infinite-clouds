'use client';

import dynamic from 'next/dynamic';
import { Suspense, useMemo, useRef } from 'react';
import { PerspectiveCamera } from '@react-three/drei';

import { InstancedMesh } from './instancedMesh';

const View = dynamic(() => import('src/components/view')
    .then((mod) => mod.View), {
        ssr: false
    }
);

export function Model(props) {
    const meshRef = useRef();
    const number = 1000; // number of instances
    
    // where the instances each go
    // create a tunnel
    const translateArray = useMemo(() => {
        const positions = [];
        for (let i = 0; i < number; i++ ) {
            const theta = Math.random() * 2 * Math.PI;

            positions.push(
                Math.sin(theta),
                Math.cos(theta),
                Math.random() * 5
            )
        }

        return new Float32Array(positions);
    }, [])


    return (
        // <View orbit {...props}>
        <View {...props}>
            <Suspense fallback={null}>
                <InstancedMesh
                    instanceLocations={translateArray}
                    ref={meshRef}
                />
                <PerspectiveCamera
                    makeDefault
                    near={0.1}
                    far={1000}
                    position={[0, 0, 3]}
                />
            </Suspense>
        </View>
    )
}