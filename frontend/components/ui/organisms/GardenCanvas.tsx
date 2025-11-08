'use client'

import { useRef, useEffect } from 'react'
import * as THREE from 'three'

interface GardenCanvasProps {
  plantsCount?: number
}

export const GardenCanvas: React.FC<GardenCanvasProps> = ({ plantsCount = 0 }) => {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mountRef.current) return

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x2A3D45)
    scene.fog = new THREE.Fog(0x2A3D45, 10, 50)

    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    )

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight)
    mountRef.current.appendChild(renderer.domElement)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(5, 10, 7.5)
    scene.add(directionalLight)

    const pointLight = new THREE.PointLight(0xF4A261, 0.5, 50)
    pointLight.position.set(0, 5, 0)
    scene.add(pointLight)

    // Ground
    const groundGeometry = new THREE.CircleGeometry(8, 64)
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x7FB89A,
      roughness: 0.8,
    })
    const ground = new THREE.Mesh(groundGeometry, groundMaterial)
    ground.rotation.x = -Math.PI / 2
    scene.add(ground)

    // Create plants based on count
    const plants: THREE.Mesh[] = []
    const maxPlants = Math.min(plantsCount, 20)
    
    for (let i = 0; i < maxPlants; i++) {
      const angle = (i / maxPlants) * Math.PI * 2
      const radius = 3 + Math.random() * 2
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius

      // Create flower/plant
      const stemGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.5 + Math.random() * 0.5, 8)
      const stemMaterial = new THREE.MeshStandardMaterial({ color: 0x4A7C59 })
      const stem = new THREE.Mesh(stemGeometry, stemMaterial)
      stem.position.set(x, 0.25, z)

      // Flower head
      const flowerGeometry = new THREE.SphereGeometry(0.15, 8, 8)
      const colors = [0xF4A261, 0xFFB6D9, 0xA8D5BA, 0xF6B685]
      const flowerColor = colors[Math.floor(Math.random() * colors.length)]
      const flowerMaterial = new THREE.MeshStandardMaterial({ 
        color: flowerColor,
        emissive: flowerColor,
        emissiveIntensity: 0.2
      })
      const flower = new THREE.Mesh(flowerGeometry, flowerMaterial)
      flower.position.set(x, 0.6 + Math.random() * 0.3, z)

      scene.add(stem)
      scene.add(flower)
      plants.push(flower)

      // Add petals
      const petalGeometry = new THREE.SphereGeometry(0.08, 8, 8)
      for (let p = 0; p < 5; p++) {
        const petalAngle = (p / 5) * Math.PI * 2
        const petalX = flower.position.x + Math.cos(petalAngle) * 0.15
        const petalZ = flower.position.z + Math.sin(petalAngle) * 0.15
        const petal = new THREE.Mesh(petalGeometry, flowerMaterial)
        petal.position.set(petalX, flower.position.y, petalZ)
        scene.add(petal)
      }
    }

    // Add particle system for ambiance
    const particlesGeometry = new THREE.BufferGeometry()
    const particlesCount = 100
    const posArray = new Float32Array(particlesCount * 3)

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 20
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      color: 0xFFB6D9,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    })
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial)
    scene.add(particlesMesh)

    camera.position.set(0, 4, 8)
    camera.lookAt(0, 0, 0)

    let time = 0
    const animate = () => {
      requestAnimationFrame(animate)
      time += 0.01

      // Animate flowers - gentle swaying
      plants.forEach((plant, index) => {
        plant.position.y += Math.sin(time + index) * 0.002
        plant.rotation.z = Math.sin(time + index) * 0.1
      })

      // Animate particles
      particlesMesh.rotation.y += 0.001
      const positions = particlesMesh.geometry.attributes.position.array as Float32Array
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] += Math.sin(time + i) * 0.002
      }
      particlesMesh.geometry.attributes.position.needsUpdate = true

      // Camera gentle rotation
      camera.position.x = Math.sin(time * 0.1) * 8
      camera.position.z = Math.cos(time * 0.1) * 8
      camera.lookAt(0, 0, 0)

      renderer.render(scene, camera)
    }
    animate()

    const handleResize = () => {
      if (!mountRef.current) return
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      mountRef.current?.removeChild(renderer.domElement)
      renderer.dispose()
    }
  }, [plantsCount])

  return (
    <div ref={mountRef} className="w-full h-full rounded-2xl overflow-hidden" />
  )
}