'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, User, Mail, Loader2, Sparkles, LucideVolumeOff } from 'lucide-react'
import api from '../lib/api'

const SignupPage = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }
const handleSignup = async (e) => {
        e.preventDefault()
        setError("")

        if (formData.password !== formData.confirmPassword) {
            return setError("Passwords do not match")
        }

        setIsLoading(true)
        try {
            const res = await api.post("register/", {
                username: formData.username,
                email: formData.email,
                password: formData.password
            })
            console.log(res.data)
            // 🚨 PEAK LOGIC: If backend returns tokens, save them and GO
            if (res.data.access) {
                localStorage.clear()
                localStorage.setItem("accessToken", res.data.access)
                localStorage.setItem("refreshToken", res.data.refresh)
                
                window.location.href='/dashboard'
                
                router.refresh() // Forces Next.js to re-check the layout
            } else {
                router.push("/login?message=Account created! Please sign in.")
            }
        } catch (err) {
            const detail = err.response?.data
            setError(typeof detail === 'object' ? Object.values(detail)[0] : "Signup failed")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#f8fafc]">
            {/* Design Consistency with Login */}
            <div className="relative w-full max-w-md p-8 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                
                <div className="flex flex-col items-center mb-8">
                    <div className="p-3 bg-indigo-600 rounded-xl mb-4 shadow-lg shadow-indigo-200">
                        <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Create Account</h1>
                    <p className="text-slate-500 text-sm mt-1">Join the elite workspace</p>
                </div>

                <form className="space-y-4" onSubmit={handleSignup}>
                    {/* Username */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500 uppercase ml-1">Username</label>
                        <div className="relative group">
                            <User className="absolute left-3 top-3 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                name="username"
                                type="text"
                                required
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                placeholder="coder_peak"
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500 uppercase ml-1">Email</label>
                        <div className="relative group">
                            <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                name="email"
                                type="email"
                                required
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                placeholder="you@example.com"
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500 uppercase ml-1">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                name="password"
                                type="password"
                                required
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                placeholder="••••••••"
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500 uppercase ml-1">Confirm Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                name="confirmPassword"
                                type="password"
                                required
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                placeholder="••••••••"
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 text-xs text-red-600 bg-red-50 rounded-lg border border-red-100 italic">
                            ⚠️ {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Peak Account"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-500">
                    Already have an account? <span onClick={() => router.push('/login')} className="text-indigo-600 font-bold cursor-pointer hover:underline">Sign In</span>
                </p>
            </div>
        </div>
    )
}

export default SignupPage