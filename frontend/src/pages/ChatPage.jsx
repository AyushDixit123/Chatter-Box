import React, { useEffect } from 'react'
import axios from 'axios';
const ChatPage = () => {
    const fetchChats=async ()=>{
        const data=await axios.get('/');
        console.log(data)
    }
useEffect(()=>{
    fetchChats()
},[])
  return (
    <div>
      chatpGE
    </div>
  )
}

export default ChatPage
