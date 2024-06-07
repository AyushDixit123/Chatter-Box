import React, { useEffect, useState } from 'react';
import { AddIcon } from '@chakra-ui/icons';
import { ChatState } from '../../context/ChatProvider';
import { Box, useToast, Button, Stack, Text } from '@chakra-ui/react';
import axios from 'axios';
import { getSender } from '../../config/ChatLogic';
import ChatLoading from '../ChatLoading';

const MyChats = () => {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const toast = useToast();

  useEffect(() => {
    const fetchChats = async () => {
      if (!user) return;

      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.get("http://localhost:3000/api/chat", config);
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

    const storedUserInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (storedUserInfo) {
      setLoggedUser(storedUserInfo);
      fetchChats();
    }
  }, [user, setChats, toast]);

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
        <Button
          display="flex"
          fontSize={{ base: "17px", md: "10px", lg: "17px" }}
          rightIcon={<AddIcon />}
        >
          <span style={{ color: 'white' }}>New Group Chat</span>
        </Button>
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

export default MyChats;
