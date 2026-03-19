'use client'
import { LoaderOne } from '@/components/ui/loader';
import { Calendar, Trash2, Clock, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

export default function TaskCard({ task, onDelete, onToggle ,istoggling,isDeleting}) {

    return (
        <div className="group bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-300 relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
                <button 
                    onClick={() => onToggle(task.id)}
                    className={`p-2 rounded-xl transition-colors ${task.completed ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600 hover:bg-amber-100'}`}
                >
                    {task.completed ? <CheckCircle2 size={20} /> : <Clock size={20} />}
                </button>
                <button 
                    onClick={() => onDelete(task.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                >
                    <Trash2 size={16} />
                </button>
            </div>
            
            <h4 className={`font-bold text-slate-800 text-lg mb-1 leading-tight ${task.completed ? 'line-through opacity-50' : ''}`}>
                {task.title}
            </h4>
            <p className="text-slate-400 text-sm mb-6 line-clamp-2">
                {task.description || "No additional context."}
            </p>
            
            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <div className="flex items-center gap-1.5 text-slate-400">
                    <Calendar size={14} />
                    <span className="text-[11px] font-bold">
                        {task.deadline ? new Date(task.deadline).toLocaleDateString() : "No Date"}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400">{task.creator_name}</span>
                    <Image
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${task.creator_name}`} 
                        className="rounded-full bg-slate-100"
                        alt="avatar"
                        width={24}
                        height={24}
                    />
                </div>
            </div>
        </div>
    );
}