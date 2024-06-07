import React, { useEffect,useState  } from 'react'

import { ChatState } from '../../context/ChatProvider'
import { Box, useToast,Button } from '@chakra-ui/react';
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
      useEffect(()=>{
        setLoggedUser(JSON.parse(localStorage.getItem("userinfo")));
        fetchChats();
      },[])

      const { data } = await axios.get("http://localhost:3000/api/chat", config);
      console.log(data)
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
    <Box display={{base: selectedChat ? "none": "flex" , md: "flex"}}
    flexDir={'column'}
    alignItems={'center'}
    p={3}
    w={{base: "100%",md:"31%"}}
    borderRadius={'lg'}
    borderWidth={'1px'}>
       <Box pb={4}
        pt={2}
        px={3}
        fontSize={{ base: "xl", md: "2xl" }}
        fontFamily={"Work sans"}
        display="flex"
        fontWeight={500}
        w={{ base: "100%", md: "100%" }}
        justifyContent="space-between"
        alignItems="center"
        bg={"#5AB2FF"}
        
        borderBottom={"1px solid white"}
        >
          My Chats
          <Button display="flex"
          fontSize={{ base: "17px", md:"10px", lg:"17px" }}>New Group Chat </Button>

       </Box>
    </Box>
  )
}

export default MyChats
