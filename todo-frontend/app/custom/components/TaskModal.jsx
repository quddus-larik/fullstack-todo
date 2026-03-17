'use client'
import { Plus, X } from 'lucide-react';

export default function TaskModal({ 
    isOpen, 
    onClose, 
    onAdd, 
    newTask, 
    setNewTask, 
    activeGroupId, 
    groupData 
}) {
    if (!isOpen) return null;
    

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200 relative">
                
                <button 
                    type="button"
                    onClick={onClose}
                    className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition"
                >
                    <X size={20} />
                </button>

                <h2 className="text-2xl font-bold mb-2 text-slate-900">Create Task</h2>
                <p className="text-slate-500 text-sm mb-6">
                    Details will be visible to {activeGroupId ? "the team" : "only you"}.
                </p>
                
                <form onSubmit={onAdd} className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase ml-1">Task Title</label>
                        <input 
                            required
                            className="w-full p-4 mt-1 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none" 
                            placeholder="E.g. Fix API Auth Bug"
                            value={newTask.title}
                            onChange={e => setNewTask({...newTask, title: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase ml-1">Deadline</label>
                        <input 
                            type="datetime-local" 
                            className="w-full p-4 mt-1 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none" 
                            value={newTask.deadline}
                            onChange={e => setNewTask({...newTask, deadline: e.target.value})}
                        />
                    </div>

                    {activeGroupId && (
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase ml-1">Assign To</label>
                            <select 
                                className="w-full p-4 mt-1 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
                                value={newTask.assigned_to || ""}
                                onChange={e => setNewTask({...newTask, assigned_to: e.target.value})}
                            >
                                <option value="">Unassigned (Me)</option>
                                {groupData?.members?.map(member => (
                                    <option key={member.id} value={member.id}>
                                        {member.username}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="flex gap-3 pt-4">
                        <button 
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 font-bold text-slate-500 hover:bg-slate-50 rounded-2xl transition"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            className="flex-1 py-4 font-bold bg-indigo-600 text-white rounded-2xl shadow-lg hover:bg-indigo-700 transition"
                        >
                            Save Task
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}