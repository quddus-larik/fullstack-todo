'use client'
import React, { useState } from 'react'
// Fix 1: Correct Hook
import { useRouter } from 'next/navigation'
import { Lock, User, Loader2, Rocket } from 'lucide-react'

const LoginPage = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter() // Consistent naming
    
    const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";


    async function handleLogin(e) {
        e.preventDefault()
        setError('')
        setIsLoading(true)
        try {
            const res = await fetch(`${BACKEND_URL}/api/token/`, {
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
            setError(err.response?.data?.detail || "Invalid credentials. Please try again.")
        }finally{
            setIsLoading(false)
        }
    }

    return (
<div className="flex min-h-screen items-center justify-center bg-[#f8fafc]">
            {/* Background Decorative Blobs - Makes it look "High End" */}
            <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute bottom-0 -right-4 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

            <div className="relative w-full max-w-md p-8 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                {/* Branding Section */}
                <div className="flex flex-col items-center mb-8">
                    <div className="p-3 bg-blue-600 rounded-xl mb-4 shadow-lg shadow-blue-200">
                        <Rocket className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Elevate Your Peak</h1>
                    <p className="text-slate-500 text-sm mt-1">Sign in to your AI workspace</p>
                </div>

                <form className="space-y-5" onSubmit={handleLogin}>
                    {/* Username Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 ml-1">Username</label>
                        <div className="relative group">
                            <User className="absolute left-3 top-3 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                name="username"
                                type="text"
                                required
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900"
                                placeholder="Enter your username"
                                onChange={(e)=>setUsername(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 ml-1">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                name="password"
                                type="password"
                                required
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900"
                                placeholder="••••••••"
                                onChange={(e)=>setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100 animate-in fade-in zoom-in duration-200">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
                            {error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl shadow-lg shadow-slate-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            "Sign In"
                        )}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-slate-500">
                    Don't have an account? <span className="text-blue-600 font-semibold cursor-pointer hover:underline"><a href='signup'>Sign up</a></span>
                </p>
            </div>
        </div>
    )
}

export default LoginPage