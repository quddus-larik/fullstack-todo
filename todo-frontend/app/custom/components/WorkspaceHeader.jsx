'use client'
import { Plus } from 'lucide-react';
import FriendSearch from './FriendSearch';

export default function DashboardHeader({ activeGroupId, groupData, onOpenModal }) {
    return (
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-bold rounded-full uppercase tracking-wider">
                        {activeGroupId ? "Team Workspace" : "Personal"}
                    </span>
                </div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                    {activeGroupId ? groupData?.name : "My Inbox"}
                    <FriendSearch/>
                </h1>
            </div>

            <div className="flex items-center gap-6">
                {activeGroupId && groupData?.members && (
                    <div className="flex -space-x-3 items-center">
                        {groupData.members.slice(0, 5).map((m) => (
                            <div key={m.id} className="relative group">
                                <img 
                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${m.username}`}
                                    className="h-10 w-10 rounded-full border-2 border-white bg-slate-200 hover:z-10 transition-transform hover:scale-110 cursor-help"
                                    alt={m.username}
                                />
                                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                    {m.username}
                                </span>
                            </div>
                        ))}
                        {groupData.members.length > 5 && (
                            <div className="h-10 w-10 rounded-full border-2 border-white bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                                +{groupData.members.length - 5}
                            </div>
                        )}
                    </div>
                )}
                <button 
                    onClick={onOpenModal}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95"
                >
                    <Plus size={18} /> New Task
                </button>
            </div>
        </header>
    );
}