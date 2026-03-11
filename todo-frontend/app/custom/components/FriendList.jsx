import React, { useEffect, useState } from 'react'
import api from '@/app/lib/api' 

const FriendList = () => {
    const [friendlist,setfriendlist]=useState([])
    useEffect(() => {
      const ConfirmedFriends = async () => {
        const res = await api.get('friendships/accepted_friends/')
        console.log(res)
        setfriendlist(res.data.result)
      }
    ConfirmedFriends()
      
    }, [])
    
  return (
    <div>
        {friendlist}
    </div>
  )
}

export default FriendList