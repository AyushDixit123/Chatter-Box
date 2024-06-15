import React, { useEffect, useState } from 'react';
import { AddIcon } from '@chakra-ui/icons';
import { ChatState } from '../../context/ChatProvider';
import { Box, useToast, Button, Stack, Text } from '@chakra-ui/react';
import axios from 'axios';
import  getSender  from '../../config/ChatLogic';
import ChatLoading from '../ChatLoading';
import GroupChatModal from '../miscellaneous/GroupChatModal'


const MyChats = ({fetchAgain}) => {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const toast = useToast();
  
  const fetchChats = async () => {
      if (!user) return;

      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.get("https://lets-chat-ap7p.onrender.com/api/chat", config);
        console.log("Fetched chats:", data);
        setChats(data);
      } catch (error) {
        toast({
          title: "Error Occurred!",
          description: "Failed to Load the chats",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      }
    };
    useEffect(() => {
      const storedUserInfo = JSON.parse(localStorage.getItem("userinfo"));
      if (storedUserInfo) {
        setLoggedUser(storedUserInfo);
        fetchChats();
      }
    }, [user, setChats, toast,fetchAgain]);
    console.log(loggedUser)

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir={'column'}
      alignItems={'center'}
      p={3}
      w={{ base: "100%", md: "31%" }}
      borderRadius={'lg'}
      borderWidth={'1px'}
    >
      <Box
        pb={4}
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
        <GroupChatModal>
        <Button
          display="flex"
          fontSize={{ base: "17px", md: "10px", lg: "17px" }}
          rightIcon={<AddIcon />}
        >
          <span style={{ color: 'white' }}>New Group Chat</span>
        </Button></GroupChatModal>
      </Box>
      <Box
        display={'flex'}
        flexDir={'column'}
        p={3}
        bg={'#5AB2FF'}
        w='100%'
        h='100%'
        borderRadius={'lg'}
        overflowY={'hidden'}
      >
        {chats ? (
          <Stack overflowY={'scroll'}>
            {chats.map((chat) => (
              
              <Box
              
                onClick={() => setSelectedChat(chat)}
                
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                  {console.log("selected chat", selectedChat)}
                  {console.log("chat.users:",chat.users)}
                  {!chat.isGroupChat ? (
                    
                    getSender(loggedUser, chat.users)
                  ) : (
                    chat.chatName
                  )}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

/*const MyChats = () => {
  const [loggedUser, setLoggedUser] = useState();

  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

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

   useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userinfo")));
    fetchChats();
    // eslint-disable-next-line
  }, []);
  return (
    <Box
      d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        d="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        
          <Button
            d="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        
      </Box>
       <Box
        d="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
                 </Box>
            ))}
             </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};*/
    
  

export default MyChats;