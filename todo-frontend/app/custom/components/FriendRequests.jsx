'use client'
import React, { useEffect, useState } from 'react'
import api from '@/app/lib/api' // Don't forget to import your api instance!
import { Check, X } from 'lucide-react'

const FriendRequests = () => {
    const [requests, setRequests] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getRequests = async () => {
            try {
                // Correct endpoint for INCOMING requests
                const res = await api.get('/friendships/requests/')
                // If using pagination, remember res.data.results
                setRequests(res.data.results || res.data)
                console.log(res)
            } catch (err) {
                console.error("Fetch error:", err)
            } finally {
                setLoading(false)
            }
        }
        
        getRequests() // 🚀 YOU MUST CALL THE FUNCTION
    }, [])

    const handleAccept = async (id) => {
        try {
            await api.post(`/friendships/${id}/accept/`)
            // Remove the request from the list after accepting
            setRequests(prev => prev.filter(req => req.id !== id))
        } catch (err) {
            alert("Failed to accept")
        }
    }

    if (loading) return <p className="text-sm text-slate-400">Loading requests...</p>

    return (
        <div className="space-y-3">
            {requests.length > 0 ? (
                requests.map((req) => (
                    <div key={req.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex flex-col">
                            <span className="font-bold text-slate-800 text-sm">
                                {req.creator_details?.username}
                            </span>
                            <span className="text-xs text-slate-500">Sent you a request</span>
                        </div>
                        
                        <div className="flex gap-2">
                            <button 
                                onClick={() => handleAccept(req.id)}
                                className="p-2 bg-green-400 text-white rounded-lg hover:bg-indigo-700 transition"
                            >
                                <Check size={16} />
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-sm text-slate-500 text-center py-4">No pending requests.</p>
            )}
        </div>
    )
}

export default FriendRequests