'use client'
import { useState } from 'react';
import { Users, UserPlus } from 'lucide-react';
import FriendSearch from './FriendSearch';
import FriendRequests from './FriendRequests';
// import GenericModal from '../custom/components/GenericModal'; // A simple wrapper

export default function SocialActions() {
    const [activeView, setActiveView] = useState(null); // 'list' or 'search'

    return (
        <div className="flex gap-3">
            {/* BUTTON 1: SEE FRIENDS / REQUESTS */}
            <button 
                onClick={() => setActiveView('list')}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm group"
            >
                <Users size={18} className="text-indigo-600 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-slate-700">Friends</span>
                {/* Optional: Add notification bubble here */}
            </button>

            {/* BUTTON 2: ADD NEW FRIENDS */}
            <button 
                onClick={() => setActiveView('search')}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 group"
            >
                <UserPlus size={18} className="group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">Find People</span>
            </button>

            {/* THE DYNAMIC MODAL */}
            {activeView && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative">
                        <button 
                            onClick={() => setActiveView(null)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                        >
                            ✕
                        </button>

                        {activeView === 'list' ? (
                            <div>
                                <h2 className="text-xl font-bold mb-4">Friend Requests</h2>
                                <FriendRequests />
                                {/* You can add your Accepted Friends List below here later */}
                            </div>
                        ) : (
                            <div>
                                <h2 className="text-xl font-bold mb-4">Search Users</h2>
                                <FriendSearch />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}