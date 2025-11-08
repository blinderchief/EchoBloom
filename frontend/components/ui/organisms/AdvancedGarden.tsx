'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars, Environment, PerspectiveCamera, Float } from '@react-three/drei'
import { useRef, useMemo, useEffect, useState } from 'react'
import { Vector3, MathUtils } from 'three'
import * as THREE from 'three'

interface Echo {
  id: number
  mood_score: number
  emotion_tags: string[]
  seed_type: string
  growth_stage: number
  created_at: string
}

interface AdvancedGardenProps {
  echoes: Echo[]
  wellness_score: number
}

// Procedural flower component with physics
function ProceduralFlower({ position, moodScore, emotionTags, growthStage, seedType }: {
  position: [number, number, number]
  moodScore: number
  emotionTags: string[]
  growthStage: number
  seedType: string
}) {
  const flowerRef = useRef<THREE.Group>(null)
  
  // Enhanced color mapping based on specific emotions and scenarios
  const emotionColorMap: Record<string, { color: string, glow: string, description: string }> = {
    // Positive Emotions
    joy: { color: '#FFD700', glow: '#FFA500', description: 'Radiant golden sunshine' },
    gratitude: { color: '#FF69B4', glow: '#FF1493', description: 'Warm pink appreciation' },
    hope: { color: '#98FB98', glow: '#00FF00', description: 'Fresh green optimism' },
    calm: { color: '#87CEEB', glow: '#4682B4', description: 'Peaceful sky blue' },
    excited: { color: '#FF6347', glow: '#FF4500', description: 'Vibrant coral energy' },
    proud: { color: '#9370DB', glow: '#8A2BE2', description: 'Royal purple confidence' },
    love: { color: '#FF1493', glow: '#C71585', description: 'Deep magenta affection' },
    
    // Growth & Learning
    growth: { color: '#32CD32', glow: '#228B22', description: 'Lush green progress' },
    inspired: { color: '#FFB6C1', glow: '#FF69B4', description: 'Light pink creativity' },
    motivated: { color: '#FFA500', glow: '#FF8C00', description: 'Bright orange drive' },
    
    // Challenging Emotions
    anxiety: { color: '#9370DB', glow: '#6A5ACD', description: 'Soft purple worry' },
    sadness: { color: '#4682B4', glow: '#1E90FF', description: 'Deep blue melancholy' },
    anger: { color: '#DC143C', glow: '#B22222', description: 'Intense red fire' },
    fear: { color: '#8B4789', glow: '#663399', description: 'Dark purple concern' },
    overwhelmed: { color: '#708090', glow: '#2F4F4F', description: 'Heavy slate gray' },
    lonely: { color: '#6495ED', glow: '#4169E1', description: 'Distant cornflower blue' },
    frustrated: { color: '#CD5C5C', glow: '#8B0000', description: 'Burnt coral tension' },
    
    // Neutral & Reflective
    neutral: { color: '#F0E68C', glow: '#DAA520', description: 'Gentle khaki balance' },
    reflective: { color: '#B0C4DE', glow: '#778899', description: 'Thoughtful steel blue' },
    curious: { color: '#20B2AA', glow: '#008B8B', description: 'Teal exploration' },
    peaceful: { color: '#AFEEEE', glow: '#48D1CC', description: 'Tranquil turquoise' }
  }
  
  const primaryEmotion = emotionTags[0]?.toLowerCase() || 'neutral'
  const emotionData = emotionColorMap[primaryEmotion] || emotionColorMap.neutral
  const flowerColor = emotionData.color
  const glowColor = emotionData.glow
  
  // Unique positioning based on emotion intensity
  const heightVariation = moodScore > 0 ? 0.2 : -0.1 // Positive emotions grow taller
  const adjustedPosition: [number, number, number] = [
    position[0], 
    position[1] + heightVariation, 
    position[2]
  ]
  
  // Scale based on growth stage, mood, and seed type
  const baseScale = growthStage * (0.3 + Math.abs(moodScore) * 0.2)
  const scale = seedType === 'gratitude' ? baseScale * 1.2 : baseScale
  
  // Petal count varies by seed type and emotion
  const petalCount = 
    seedType === 'gratitude' ? 8 : 
    seedType === 'joy' ? 12 : 
    primaryEmotion === 'love' ? 10 :
    primaryEmotion === 'hope' ? 7 : 6
  
  // Animate flower swaying
  useEffect(() => {
    if (!flowerRef.current) return
    
    const animate = () => {
      if (flowerRef.current) {
        const time = Date.now() * 0.001
        flowerRef.current.rotation.z = Math.sin(time) * 0.1
        flowerRef.current.position.y = adjustedPosition[1] + Math.sin(time * 2) * 0.05
      }
    }
    
    const interval = setInterval(animate, 16)
    return () => clearInterval(interval)
  }, [adjustedPosition])
  
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group ref={flowerRef} position={adjustedPosition} scale={scale}>
        {/* Stem */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.03, 0.8, 8]} />
          <meshStandardMaterial color="#2d5016" roughness={0.8} />
        </mesh>
        
        {/* Leaves */}
        {[...Array(3)].map((_, i) => (
          <mesh 
            key={`leaf-${i}`} 
            position={[
              Math.cos(i * 2) * 0.15,
              -0.2 + i * 0.1,
              Math.sin(i * 2) * 0.15
            ]}
            rotation={[0, i * 2, Math.PI / 4]}
          >
            <sphereGeometry args={[0.08, 8, 8, 0, Math.PI]} />
            <meshStandardMaterial color="#4a7c1c" roughness={0.6} />
          </mesh>
        ))}
        
        {/* Flower head */}
        <group position={[0, 0.4, 0]}>
          {/* Center with emotion-based glow */}
          <mesh>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial 
              color={glowColor} 
              emissive={glowColor} 
              emissiveIntensity={0.6} 
            />
          </mesh>
          
          {/* Petals */}
          {[...Array(petalCount)].map((_, i) => {
            const angle = (i / petalCount) * Math.PI * 2
            const x = Math.cos(angle) * 0.15
            const z = Math.sin(angle) * 0.15
            
            return (
              <mesh
                key={i}
                position={[x, 0, z]}
                rotation={[Math.PI / 3, 0, angle]}
              >
                <sphereGeometry args={[0.1, 8, 8, 0, Math.PI, 0, Math.PI]} />
                <meshStandardMaterial 
                  color={flowerColor} 
                  emissive={flowerColor}
                  emissiveIntensity={moodScore > 0 ? 0.4 : 0.1}
                  roughness={0.4}
                  metalness={0.2}
                />
              </mesh>
            )
          })}
          
          {/* Glow effect for positive emotions */}
          {moodScore > 0.3 && (
            <pointLight 
              color={flowerColor} 
              intensity={moodScore * 2} 
              distance={1} 
            />
          )}
        </group>
        
        {/* Particle system for blooming flowers */}
        {growthStage >= 3 && (
          <ParticleSystem color={flowerColor} count={5} spread={0.3} />
        )}
      </group>
    </Float>
  )
}

// Magical particle system
function ParticleSystem({ color, count, spread }: { color: string, count: number, spread: number }) {
  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      temp.push({
        position: new Vector3(
          MathUtils.randFloatSpread(spread),
          MathUtils.randFloat(0.5, 1.5),
          MathUtils.randFloatSpread(spread)
        ),
        scale: MathUtils.randFloat(0.01, 0.03)
      })
    }
    return temp
  }, [count, spread])
  
  return (
    <>
      {particles.map((particle, i) => (
        <Float key={i} speed={MathUtils.randFloat(1, 3)} floatIntensity={2}>
          <mesh position={particle.position} scale={particle.scale}>
            <sphereGeometry args={[1, 8, 8]} />
            <meshBasicMaterial color={color} transparent opacity={0.6} />
          </mesh>
        </Float>
      ))}
    </>
  )
}

// Ground with grass
function Garden({ size }: { size: number }) {
  return (
    <group>
      {/* Main ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <circleGeometry args={[size, 64]} />
        <meshStandardMaterial 
          color="#3a5a2a" 
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>
      
      {/* Grass blades - Reduced for performance */}
      {[...Array(50)].map((_, i) => {
        const angle = Math.random() * Math.PI * 2
        const radius = Math.random() * size * 0.9
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        
        return (
          <mesh
            key={i}
            position={[x, -0.48, z]}
            rotation={[0, Math.random() * Math.PI, 0]}
            scale={[0.02, Math.random() * 0.2 + 0.1, 0.02]}
          >
            <coneGeometry args={[0.5, 1, 4]} />
            <meshStandardMaterial color="#4a7c2a" />
          </mesh>
        )
      })}
    </group>
  )
}

// Wellness score display
// Wellness score display - simplified without Text3D
function WellnessDisplay({ score }: { score: number }) {
  const color = score > 70 ? '#00ff00' : score > 40 ? '#ffff00' : '#ff6b6b'
  
  return (
    <Float speed={1} floatIntensity={0.3}>
      <group position={[0, 3, 0]}>
        <mesh>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial 
            color={color} 
            emissive={color}
            emissiveIntensity={0.8}
          />
        </mesh>
      </group>
    </Float>
  )
}

export function AdvancedGarden({ echoes, wellness_score }: AdvancedGardenProps) {
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  // Position flowers in spiral pattern
  const flowerPositions = useMemo(() => {
    return echoes.map((echo, index) => {
      const angle = index * 0.618 * Math.PI * 2 // Golden angle
      const radius = Math.sqrt(index) * 0.8
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius
      return { x, z, echo }
    })
  }, [echoes])
  
  if (!isClient) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-navy to-navy-light rounded-2xl">
        <p className="text-white font-quicksand">Loading your garden...</p>
      </div>
    )
  }
  
  return (
    <div className="w-full h-full rounded-2xl overflow-hidden">
      <Canvas shadows camera={{ position: [5, 5, 5], fov: 60 }}>
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1.5} 
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[0, 5, 0]} intensity={0.5} color="#FFE4B5" />
        
        {/* Environment - Simplified */}
        <Stars radius={50} depth={20} count={200} factor={2} saturation={0} fade speed={1} />
        <fog attach="fog" args={['#2A3D45', 10, 50]} />
        
        {/* Garden ground */}
        <Garden size={8} />
        
        {/* Flowers from echoes */}
        {flowerPositions.map(({ x, z, echo }) => (
          <ProceduralFlower
            key={echo.id}
            position={[x, 0, z]}
            moodScore={echo.mood_score}
            emotionTags={echo.emotion_tags}
            growthStage={echo.growth_stage}
            seedType={echo.seed_type}
          />
        ))}
        
        {/* Wellness score display */}
        <WellnessDisplay score={wellness_score} />
        
        {/* Controls */}
        <OrbitControls 
          enablePan={false} 
          minDistance={3} 
          maxDistance={15}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  )
}
