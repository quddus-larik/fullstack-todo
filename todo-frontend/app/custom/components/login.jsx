'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation' // Fix 1: Correct Hook

const LoginPage = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const router = useRouter() // Consistent naming
    const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";

    async function handleLogin(e) {
        e.preventDefault()
        try {
            const res = await fetch(`${BACKEND_URL}/api/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            })
            
            const data = await res.json()
            if (res.ok) {
                localStorage.setItem("access", data.access)
                router.push("/dashboard")
            } else {
                alert("Login failed")
            }
        } catch (error) {
            console.error("Network error:", error)
        }
    }

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                {/* Fix 2: Self-closing inputs */}
                <input type="text" onChange={(e) => setUsername(e.target.value)} placeholder='username' />
                <input type='password' onChange={(e) => setPassword(e.target.value)} placeholder='password' />
                <button type='submit'>Login</button>
            </form>
        </div>
    )
}

export default LoginPage