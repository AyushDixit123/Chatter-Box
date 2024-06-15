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
import io from 'socket.io-client';
import Lottie from 'react-lottie';
import animationData from '../components/animation/Animation - 1718350754094.json'

const ENDPOINT = 'https://lets-chat-ap7p.onrender.com';
let socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const toast = useToast();
  const defaultOptions={
    loop:true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAscpectRatio: "xMidYMid slice"
    }
  }
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, selectedChat, setSelectedChat, notifications,setNotifications } = ChatState();
  const [typing,setTyping]=useState(false)
  const [isTyping,setIsTyping] = useState(false)
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on('connected', () => setSocketConnected(true));

    socket.on('typing', ()=>setIsTyping(true))
    socket.on('stop typing', ()=>setIsTyping(false))

    socket.on("message received", (newMessageReceived) => {
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) { //if chat is not selected or new message received does not belong to selected chat
        // Notification logic can be added here
        if(!notifications.includes(newMessageReceived)){
          setNotifications([newMessageReceived, ...notifications]);
          setFetchAgain(!fetchAgain);
         
        }



      } else {
        setMessages((prevMessages) => [...prevMessages, newMessageReceived]);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);
      const { data } = await axios.get(`https://lets-chat-ap7p.onrender.com/api/message/${selectedChat._id}`, config);
      setMessages(data);
      setLoading(false);

      socket.emit('join chat', selectedChat._id);
      selectedChatCompare = selectedChat;
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
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.post(
          "https://lets-chat-ap7p.onrender.com/api/message",
          {
            content: newMessage,
            chatId: selectedChat,
          },
          config
        );

        socket.emit('new message', data);
        setNewMessage("");
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

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    // Typing indicator logic can be added here
    if (!socketConnected) return;

    if (!typing){
      setTyping(true);
      socket.emit("typing",selectedChat._id)
    }

    let lastTypingtime= new Date().getTime()

    var timerLength = 2000;
    
    setTimeout(()=>{

      var timeNow= new Date().getTime();
      var timediff= timeNow- lastTypingtime;

      if(timediff>= timerLength &&  typing){
        socket.emit('stop typing',selectedChat._id);
        setTyping(false)
      }




    },timerLength);
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
            className="hide-scrollbar" // Apply the CSS class here
          >
            {loading ? (
              <Spinner size={'xl'} w={'20'} h={'20'} alignSelf={'center'} margin={'auto'} />
            ) : (
              <ScrollableChat messages={messages} />
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
            {isTyping? <div style={{ marginRight: '90%' }}><Lottie options={defaultOptions} height={'35.7px'}/></div>: <></>}
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
