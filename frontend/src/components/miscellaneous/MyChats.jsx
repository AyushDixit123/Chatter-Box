import React from 'react'

import { ChatState } from '../../context/ChatProvider'
import { useToast } from '@chakra-ui/react';
import axios from 'axios';
const MyChats = () => {
  const [loggedUser,setLoggedUser] = useState();
  const {selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const toast = useToast();
   const fetchChats = async () => {
    // console.log(user._id);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <div>
      Mychats
    </div>
  )
}

export default MyChats
