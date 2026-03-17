'use client'
import api from '@/app/lib/api'
import React, { useState, useEffect } from 'react'
import { useSWRConfig } from 'swr'
import { Search, UserPlus, Clock, Users, X, Loader2, Check, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const FriendSearch = () => {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [sendingId, setSendingId] = useState(null)
    const [searchPerformed, setSearchPerformed] = useState(false)
    const [error, setError] = useState(null)

    const { mutate } = useSWRConfig()

    const handleSearch = async (e) => {
        e.preventDefault()
        if (!query.trim()) return
        
        setLoading(true)
        setError(null)
        setSearchPerformed(true)
        
        try {
            const res = await api.get(`users/search/?q=${query}`)
            const data = res.data.results || res.data
            const resultsArray = Array.isArray(data) ? data : []
            setResults(resultsArray)
            
            if (resultsArray.length === 0) {
                setError('No users found')
            }
        } catch (err) {
            console.error("Search failed", err)
            setError('Search failed. Please try again.')
            setResults([])
        } finally {
            setLoading(false)
        }
    }

    const clearSearch = () => {
        setQuery('')
        setResults([])
        setSearchPerformed(false)
        setError(null)
    }

    const sendFriendRequest = async (userId) => {
        setSendingId(userId)
        try {
            await api.post('friendships/', { friend: userId })
            mutate('friendships/requests/')
            
            // Show success feedback
            setTimeout(() => {
                setResults(results.filter(u => u.id !== userId))
                setSendingId(null)
            }, 500)
            
        } catch (err) {
            setError('Request failed - already friends or pending')
            setSendingId(null)
        }
    }

    return (
        <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-gray-100 bg-gradient-to-br from-gray-50 to-white">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-indigo-100 rounded-xl">
                        <Users className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                        <h2 className="font-bold text-lg sm:text-xl text-gray-800">Find Friends</h2>
                        <p className="text-xs sm:text-sm text-gray-500">
                            Search and connect with other users
                        </p>
                    </div>
                </div>
            </div>

            {/* Search Section */}
            <div className="p-4 sm:p-6">
                <form onSubmit={handleSearch} className="space-y-3">
                    <div className="relative group">
                        <Search className={cn(
                            "absolute left-3 top-1/2 -translate-y-1/2",
                            "w-4 h-4 transition-colors duration-200",
                            query ? "text-indigo-500" : "text-gray-400 group-focus-within:text-indigo-500"
                        )} />
                        <input 
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search by username..."
                            className={cn(
                                "w-full pl-9 pr-10 py-3",
                                "bg-white border border-gray-200",
                                "rounded-xl text-sm",
                                "focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500",
                                "placeholder:text-gray-400",
                                "transition-all duration-200",
                                "shadow-sm"
                            )}
                        />
                        {query && (
                            <button
                                type="button"
                                onClick={clearSearch}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={14} className="text-gray-400" />
                            </button>
                        )}
                    </div>
                    
                    <div className="flex gap-2">
                        <button 
                            type="submit" 
                            disabled={!query.trim() || loading}
                            className={cn(
                                "flex-1 flex items-center justify-center gap-2",
                                "px-4 py-2.5 rounded-xl",
                                "text-sm font-medium",
                                "transition-all duration-200 active:scale-[0.98]",
                                "shadow-lg shadow-indigo-200/50",
                                query.trim() && !loading
                                    ? "bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white"
                                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                            )}
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    <span>Searching...</span>
                                </>
                            ) : (
                                <>
                                    <Search size={16} />
                                    <span>Search</span>
                                </>
                            )}
                        </button>
                        
                        {searchPerformed && (
                            <button
                                type="button"
                                onClick={clearSearch}
                                className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all duration-200 text-sm font-medium"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </form>

                {/* Error Message */}
                {error && (
                    <div className={cn(
                        "mt-4 p-3 rounded-xl",
                        "bg-red-50 border border-red-100",
                        "flex items-center gap-2 text-sm text-red-600"
                    )}>
                        <AlertCircle size={16} className="flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Results Section */}
                <div className="mt-6">
                    {/* Results Header */}
                    {searchPerformed && !loading && (
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                Search Results
                            </h3>
                            <span className="text-xs text-gray-400">
                                {results.length} {results.length === 1 ? 'user' : 'users'} found
                            </span>
                        </div>
                    )}

                    {/* Loading State */}
                    {loading && (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="relative">
                                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                                <div className="absolute inset-0 blur-xl bg-indigo-200/50 animate-pulse" />
                            </div>
                            <p className="text-sm text-gray-500 mt-4">Searching for users...</p>
                        </div>
                    )}

                    {/* Results Grid */}
                    {!loading && (
                        <div className="space-y-2">
                            {results.length > 0 ? (
                                results.map((user, index) => (
                                    <div
                                        key={user.id}
                                        className={cn(
                                            "group relative",
                                            "bg-white border border-gray-100",
                                            "rounded-xl p-3 sm:p-4",
                                            "hover:shadow-md hover:border-indigo-100",
                                            "transition-all duration-200",
                                            "animate-in fade-in slide-in-from-bottom-2"
                                        )}
                                        style={{ animationDelay: `${index * 50}ms` }}
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            {/* User Info */}
                                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                                {/* Avatar */}
                                                <div className={cn(
                                                    "flex-shrink-0 w-10 h-10 rounded-xl",
                                                    "bg-gradient-to-br from-indigo-100 to-purple-100",
                                                    "flex items-center justify-center",
                                                    "border-2 border-white shadow-sm"
                                                )}>
                                                    <span className="text-base font-semibold text-indigo-600">
                                                        {user.username?.charAt(0).toUpperCase() || '?'}
                                                    </span>
                                                </div>
                                                
                                                {/* User Details */}
                                                <div className="min-w-0 flex-1">
                                                    <h4 className="font-medium text-gray-800 truncate">
                                                        {user.username}
                                                    </h4>
                                                    <div className="flex items-center gap-1 mt-0.5">
                                                        <Clock size={12} className="text-gray-400" />
                                                        <p className="text-xs text-gray-400">
                                                            Active recently
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Add Button */}
                                            <button 
                                                onClick={() => sendFriendRequest(user.id)}
                                                disabled={sendingId === user.id}
                                                className={cn(
                                                    "flex items-center gap-1.5",
                                                    "px-3 sm:px-4 py-2 rounded-lg",
                                                    "text-xs sm:text-sm font-medium",
                                                    "transition-all duration-200",
                                                    "active:scale-95",
                                                    sendingId === user.id
                                                        ? "bg-indigo-100 text-indigo-400 cursor-wait"
                                                        : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700"
                                                )}
                                            >
                                                {sendingId === user.id ? (
                                                    <>
                                                        <Loader2 size={14} className="animate-spin" />
                                                        <span className="hidden sm:inline">Sending...</span>
                                                        <span className="sm:hidden">...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <UserPlus size={14} />
                                                        <span className="hidden sm:inline">Add Friend</span>
                                                        <span className="sm:hidden">Add</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : searchPerformed && !error ? (
                                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                                    <div className="p-4 bg-gray-100 rounded-2xl mb-4">
                                        <Users className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <h3 className="text-base font-semibold text-gray-700 mb-1">
                                        No users found
                                    </h3>
                                    <p className="text-sm text-gray-500 max-w-[200px]">
                                        Try searching with a different username
                                    </p>
                                </div>
                            ) : null}
                        </div>
                    )}

                    {/* Initial State */}
                    {!searchPerformed && !loading && (
                        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                            <div className="p-4 bg-indigo-50 rounded-2xl mb-4">
                                <Search className="w-8 h-8 text-indigo-400" />
                            </div>
                            <h3 className="text-base font-semibold text-gray-700 mb-1">
                                Find new friends
                            </h3>
                            <p className="text-sm text-gray-500 max-w-[200px]">
                                Search by username to connect with other users
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Tips Footer */}
            <div className="px-4 sm:px-6 py-3 bg-gray-50 border-t border-gray-100">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                    <span>Search by exact username for best results</span>
                </div>
            </div>
        </div>
    )
}

export default FriendSearch