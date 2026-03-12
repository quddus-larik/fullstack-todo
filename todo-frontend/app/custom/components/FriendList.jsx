import React, { useEffect, useState } from 'react'
import api from '@/app/lib/api' 

const FriendList = () => {
    const [friendlist,setfriendlist]=useState([])
    useEffect(() => {
      const ConfirmedFriends = async () => {
            try {
                const res = await api.get('friendships/accepted_friends/')
                console.log("Debug Response:", res.data)
                
                // Handle both paginated and non-paginated responses
                const data = res.data.results || res.data
                setfriendlist(Array.isArray(data) ? data : [])
            } catch (err) {
                console.error("Failed to fetch friends", err)
            }
        }
        ConfirmedFriends()
    }, [])

    
  return (
    <div>
        <div className="space-y-2">
            <h2 className="font-bold text-lg">My Friends</h2>
            {friendlist.length > 0 ? (
                friendlist.map((friendship) => (
                    <div key={friendship.id} className="p-2 bg-slate-100 rounded">
                        {/* Use the 'other_user' field we discussed for the Serializer */}
                        <p>{friendship.friend_info?.username || "Unknown User"}</p>
                    </div>
                ))
            ) : (
                <p className="text-gray-500">No friends found.</p>
            )}
        </div>
    </div>
  )
}

export default FriendList