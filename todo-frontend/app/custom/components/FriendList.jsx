import React, { useEffect, useState } from 'react'
import api from '@/app/lib/api' 
import { useFriends } from '@/hooks/useData'
import { LoaderOne } from '@/components/ui/loader'

const FriendList = () => {
    const {friends,isLoading}=useFriends()
    
    
    
    if (isLoading){
        return(
            <LoaderOne/>
        )
    };
    console.log(friends)
  return (
    <div>
        <div className="space-y-2">
            <h2 className="font-bold text-lg">My Friends</h2>
            {friends.length > 0 ? (
                friends.map((friendship) => (
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