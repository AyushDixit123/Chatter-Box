
import React, { useEffect, useState } from 'react';
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { ChatState } from '../context/ChatProvider';
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import getSender, { getSenderFull } from '../config/ChatLogic';
import ProfileModal from './miscellaneous/ProfileModal';
import axios from 'axios';
import ScrollableChat from './ScrollableChat';
import "../components/styles.css";
import io from 'socket.io-client'


const ENDPOINT = 'http://localhost:3000'
var socket, createdChatCompare
// Removed Redundant Map Function: Instead of mapping over the messages to render ScrollableChat multiple times, render ScrollableChat once and pass the entire messages array to it.

//Rendering Messages in ScrollableChat: The ScrollableChat component handles rendering each message from the messages array, ensuring no duplication.
const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const toast = useToast();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, selectedChat, setSelectedChat } = ChatState();
  const [socketConnected, setSocketConnected]=useState(false)
  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(`http://localhost:3000/api/message/${selectedChat._id}`, config);

      setMessages(data);
      setLoading(false);

      socket.emit('join chat', selectedChat._id)
    } catch (error) {
      toast({
        title: "Error occurred!",
        description: "Failed to fetch the messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [selectedChat]);

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      console.log("sending message");
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.post(
          "http://localhost:3000/api/message",
          {
            content: newMessage,
            chatId: selectedChat,
          },
          config
        );
        setNewMessage("");
        console.log("message sent", data);
        setMessages((prevMessages) => [...prevMessages, data]);
      } catch (error) {
        toast({
          title: "Error occurred!",
          description: "Failed to send the message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  useEffect(()=>{
    socket = io(ENDPOINT);

    socket.emit("setup",user);
    socket.on('connection',()=>setSocketConnected(true))
  },[])
  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    // Typing indicator logic
  };

  return (
    <div style={{ height: "100%", width: "100%" }}>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "xl", md: "2xl" }}
            pb={3}
            pt={2}
            px={3}
            m={0}
            color="white"
            fontFamily="Work sans"
            borderBottom={"1px solid #666777"}
            display={"flex"}
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: 'flex', md: 'none' }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat('')}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchMessages={fetchMessages} />
              </>
            )}
          </Text>
          <Box
            display={'flex'}
            flexDir={'column'}
            justifyContent={'flex-end'}
            p={3}
            bg={'skyblue'}
            w={'100%'}
            h={'90%'}
            borderRadius={'lg'}
             className="hide-scrollbar"  // Apply the CSS class here
          
    
          >
            {loading ? (
              <Spinner size={'xl'} w={'20'} h={'20'} alignSelf={'center'} margin={'auto'} />
            ) : (
              <ScrollableChat messages={messages} />
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              <Input
                variant={'filled'}
                bg={'#E0E0E0'}
                placeholder='Enter a message'
                onChange={typingHandler}
                value={newMessage}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display={'flex'}
          flexDir={'column'}
          alignItems={'center'}
          justifyContent={'center'}
          h={'100%'}
        >
          <Text fontSize={'3xl'} pb={3} fontFamily={'Work sans'}>
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </div>
  );
};

export default SingleChat;

