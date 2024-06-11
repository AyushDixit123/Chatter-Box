import React from 'react'
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { ChatState } from '../context/ChatProvider'
import { Box,IconButton,Text } from '@chakra-ui/react';
import getSender from "../config/ChatLogic";
import { getSenderFull}  from '../config/ChatLogic';
import ProfileModal from './miscellaneous/ProfileModal';
const SingleChat = ({fetchAgain, setFetchAgain}) => {
    const {user, selectedChat, setSelectedChat} = ChatState();
 return (
    <div style={{height:"100%", width: "100%"}}>
      {
        selectedChat?(
        <>
        <Text fontSize={{ base: "xl", md: "2xl" }}
            pb={3}
            pt={2}
            px={3}
            m={0}
            color="white"
            fontFamily="Work sans"
            borderBottom={"1px solid #666777"}
            display={"flex"}
            justifyContent={{ base: "space-between" }}
            alignItems="center">
            
            <IconButton display={{base:'flex', md:'none'}}
            icon={<ArrowBackIcon />}
            onClick={()=> setSelectedChat('')}/>
            {!selectedChat.isGroupChat ?(<>
            {getSender(user, selectedChat.users)}
            <ProfileModal user={getSenderFull(user, selectedChat.users)} />
             </>):(<>{selectedChat.chatName.toUpperCase()}
              <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/></>)}

        </Text>
         <Box display={'flex'}
         flexDir={'column'} justifyContent={'flex-end'}
         p={3} bg={'skyblue'} w={'100%'} h={'90%'} borderRadius={'lg'} ></Box>
        </>):
        (<Box display={'flex'} flexDir={'column'} alignItems={'center'} justifyContent={'center'} h={'100%'}>
            <Text fontSize={'3xl'} pb={3} fontFamily={'Work sans'}> Click on user to start chatting</Text>
        </Box>)
      }
    </div>
  )
}

export default SingleChat
