'use client'

import React, { useState } from 'react'
import { Button } from '../atoms/Button'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const AuthForm: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isRegister, setIsRegister] = useState(false)

  const handleSubmit = async () => {
    const endpoint = isRegister ? '/api/register' : '/api/login'
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    const data = await res.json()
    if (data.access_token) {
      localStorage.setItem('token', data.access_token)
      alert('Logged in!')
    } else {
      alert(data.message || 'Error')
    }
  }

  return (
    <div className="space-y-4">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full p-2 border rounded"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full p-2 border rounded"
      />
      <Button onClick={handleSubmit}>{isRegister ? 'Register' : 'Login'}</Button>
      <button onClick={() => setIsRegister(!isRegister)} className="text-sm text-blue-500">
        {isRegister ? 'Already have an account? Login' : 'Need an account? Register'}
      </button>
    </div>
  )
}