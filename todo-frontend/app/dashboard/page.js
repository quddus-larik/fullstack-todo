'use client'
import { useState, useEffect } from 'react';
import api from '../lib/api';
import { useSearchParams } from 'next/navigation';
import { Plus } from 'lucide-react';

// Import our new components
import TaskModal from '../custom/components/TaskModal.jsx';
import TaskCard from '../custom/components/TaskCards';
import DashboardHeader from '../custom/components/WorkspaceHeader';
import FriendList from '../custom/components/FriendList';

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [groupData, setGroupData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const searchParams = useSearchParams();
    const activeGroupId = searchParams.get('group');
    const [newTask, setNewTask] = useState({ title: '', description: '', deadline: '' });
    const [isDeleting, setisDeleting] = useState(false)
    const [istoggling,setistoggling] = useState(false)

    useEffect(() => {
        console.log(process.env.NEXT_PUBLIC_API_URL)
        const fetchData = async () => {
            setLoading(true);
            try {
                const taskUrl = activeGroupId ? `tasks/?group=${activeGroupId}` : `tasks/`;
                const [userRes, taskRes] = await Promise.all([
                    api.get('me/'),
                    api.get(taskUrl)
                ]);

                if (activeGroupId) {
                    const groupRes = await api.get(`groups/${activeGroupId}/`);
                    setGroupData(groupRes.data);
                } else {
                    setGroupData(null);
                }

                setUser(userRes.data);
                setTasks(taskRes.data.results || taskRes.data);
            } catch (err) {
                console.error("Dashboard Load Error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [activeGroupId]);

    const handleAddTask = async (e) => {
        e.preventDefault();
        let finalDeadline = newTask.deadline ? new Date(newTask.deadline).toISOString() : null;
        
        const payload = {
            title: newTask.title,
            description: newTask.description,
            deadline: finalDeadline,
            group: activeGroupId ? parseInt(activeGroupId) : null,
        };

        try {
            const res = await api.post('tasks/', payload);
            setTasks([res.data, ...tasks]);
            setNewTask({ title: '', description: '', deadline: '' });
            setIsModalOpen(false);
        } catch (err) {
            alert("Error adding task");
        }
    };

    const handleToggle = async (taskId) => {
        setistoggling(true)
        try {
            const res = await api.post(`tasks/${taskId}/toggle/`);
            setTasks(prev => prev.map(t => 
                t.id === taskId ? { ...t, completed: res.data.completed } : t
            ));
        } catch (err) {
            alert("Permission denied!");
        }
        setistoggling(false)
    };

    const handleDeleteTask = async (taskId) => {
        if (!window.confirm("Delete this task?")) return;
        setisDeleting(true)
        const previousTasks = [...tasks];
        setTasks(tasks.filter(t => t.id !== taskId));

        try {
            await api.delete(`tasks/${taskId}/`);
        } catch (err) {
            setTasks(previousTasks);
            alert("Delete failed.");
        }
        setisDeleting(false)
    };

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-slate-50">
            <div className="animate-pulse text-slate-500 font-medium">Syncing Workspace...</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                
                <DashboardHeader 
                    activeGroupId={activeGroupId} 
                    groupData={groupData} 
                    onOpenModal={() => setIsModalOpen(true)} 
                />

                <TaskModal 
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onAdd={handleAddTask}
                    newTask={newTask}
                    setNewTask={setNewTask}
                    activeGroupId={activeGroupId}
                    groupData={groupData}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FriendList/>
                    {tasks.length > 0 ? tasks.map(task => (
                        <TaskCard 
                            key={task.id} 
                            task={task} 
                            onDelete={handleDeleteTask} 
                            onToggle={handleToggle}
                            isDeleting
                            istoggling 
                        />
                    )) : (
                        <div className="col-span-full py-20 flex flex-col items-center justify-center bg-white rounded-3xl border-2 border-dashed border-slate-200">
                            <p className="text-slate-400 font-medium">No tasks found in this workspace.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}