'use client'
import React from 'react'
import { useTasks } from '@/hooks/useData' 

import { LoaderOne } from '@/components/ui/loader';

const Tasks = () => {
    // SWR handles the token, the base URL, the loading state, and the error state.
    const { tasks, isLoading, isError } = useTasks();

    if (isLoading) return <LoaderOne/>;
    
    // Note: isError is usually an object. We check for its existence.
    if (isError) return <div className="p-4 text-red-500">Error syncing tasks. Check your connection.</div>;

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold text-slate-800">Your Tasks</h1>
            <ul className="mt-4 space-y-2">
                {tasks && tasks.length > 0 ? (
                    tasks.map((task) => (
                        <li key={task.id} className="border p-3 rounded-xl shadow-sm bg-white">
                            <h3 className="font-semibold text-slate-700">{task.title}</h3>
                            <p className="text-gray-600 text-sm">{task.description}</p>
                        </li>
                    ))
                ) : (
                    <p className="text-slate-400">No tasks found.</p>
                )}
            </ul>
        </div>
    )
}

export default Tasks