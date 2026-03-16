'use client'
import api from '@/app/lib/api'
import React, { useState, useEffect } from 'react'
import { Search, UserPlus, Clock } from 'lucide-react' // Use icons for a pro look

const FriendSearch = () => {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [sending,setsending] = useState(false)

    // THE SEARCH LOGIC
    const handleSearch = async (e) => {
        e.preventDefault()
        if (!query) return
        
        setLoading(true)
        try {
            // This hits the UserSearchView we discussed earlier
            const res = await api.get(`users/search/?search=${query}`)
            // Check if DRF sent a paginated object or a plain array
        const data = res.data.results || res.data; 
        
        // Force it to be an array if the API returns something weird
        setResults(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Search failed", err)
        } finally {
            setLoading(false)
        }
    }

    // THE ADD LOGIC
    const sendFriendRequest = async (userId) => {
        setsending(true)
        try {
            await api.post('/friendships/', { friend: userId })
            alert("Request Sent!")
            // Remove user from results so they can't click twice
            setResults(results.filter(u => u.id !== userId))
        } catch (err) {
            alert("Already friends or request pending.")
        }
        setsending(false)
    }

    return (
        <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-200">
            <form onSubmit={handleSearch} className="flex gap-2 mb-4">
                <input 
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by username..."
                    className="flex-1 px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
                    {loading ? '...' : <Search size={20} />}
                </button>
            </form>

            <div className="space-y-3">
                {results.map(user => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <span className="font-medium text-slate-700">{user.username}</span>
                        <button 
                            onClick={() => sendFriendRequest(user.id)}
                            className="flex items-center gap-1 text-sm bg-white border border-indigo-200 text-indigo-600 px-3 py-1 rounded-md hover:bg-indigo-50"
                        >
                    {sending ? (
                            <span className="animate-pulse">Sending...</span>
                        ) : (
                            <>
                                <UserPlus size={16} /> Add
                            </>
                        )}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default FriendSearch