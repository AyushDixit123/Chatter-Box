import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tooltip,
  Button,
  Text,
  Box,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Input,
  position,
  Spinner,
  
} from '@chakra-ui/react';
import ProfileModal from './ProfileModal';
import React, { useState } from 'react';
import { ChatState } from '../../context/ChatProvider';
import { useNavigate } from 'react-router-dom';
import { useDisclosure } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import ChatLoading from '../ChatLoading';
import UserListItem from '../UserAvatar/UserListItem';
import axios from 'axios'
const SideDrawer = () => {
  const toast = useToast();
  const navigate = useNavigate();
   const { isOpen, onOpen, onClose } = useDisclosure();
  
  const { setSelectedChat,
    user,
    notification,
    setNotification,
    chats,
    setChats, } = ChatState(); // Accessing user from context
  
   const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [searchAttempt, setSearchAttempt]= useState(false)
   const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const handleSearch = async () => {
    console.log('hey')
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);
      setSearchAttempt(true)

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`http://localhost:3000/api/user?search=${search}`, config);

      if (!chats.find((c)=> c._id === data._id)){setChats([data, ...chats])}
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const accessChat = async (userId) => {
    console.log(userId);

    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`http://localhost:3000/api/chat`, { userId }, config);

      
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };


        
  return (
    <div style={{
      margin: "9px 9px 0 9px",
      backgroundColor: "#5AB2FF",
    }}>
      <Box display={'flex'} justifyContent={'space-between'}
        alignItems={'center'}
        w='100%'
        p='5px 10px 5px 10px'
        borderWidth={'1px'}
        borderColor={'rgba(255, 255, 255, 0.4)'}>
        <Tooltip label="Search Users to chat" aria-label='A tooltip' placement='bottom-end'>
          <Button variant="ghost" onClick={onOpen}>
            <i className="fas fa-search"></i>
            <Text display={{ base: "none", md: "flex" }} px='4' color={'white'}>Search User</Text>
          </Button>
        </Tooltip>
        <Text fontSize={'2xl'} fontFamily={'Work sans'}>Chatter Box</Text>
        <Menu>
          <MenuButton p="1" as={Button} minHeight="auto" colorScheme="transparent">
            <i className="fa-solid fa-bell"></i>
            <i className="fa-solid fa-chevron-down" style={{ marginLeft: "10px" }}></i>
          </MenuButton>
          <MenuList sx={{
            bg: 'purple.600',
            '& .chakra-menu__menuitem': {
              bg: 'purple.600',
              _hover: {
                bg: 'blue.500',
              },
            },
          }}>
            <ProfileModal user={user}>
              <MenuItem
                transition="background-color 0.8s ease-in-out"
              >
                My Profile
              </MenuItem>
            </ProfileModal>
            <MenuItem onClick={logoutHandler}> Logout</MenuItem>
          </MenuList>
        </Menu>
      </Box>
      <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
         <DrawerOverlay />
        <DrawerContent bg="#5AB2FF" color="white">
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth={'1px'}>Search Users</DrawerHeader>
             <DrawerBody >
              <Box  display={'flex'} paddingBottom={'2'}>
                <Input placeholder='Search by name or email' mr={2} value = {search} onChange={(e) => setSearch(e.target.value)} borderColor={'white'}/>
                 <Button onClick={handleSearch}>Go</Button> 
              </Box>
               {loading ?(
                <ChatLoading/>

              ):
              Array.isArray(searchResult) && searchResult.length > 0?searchResult.map(user => (
                <UserListItem key={user._id} user={user} handleFunction={()=>accessChat(user._id)} />
              ) ):searchAttempt && search !== "" ? ( // Add condition to check if search is not empty
    // If no search results and search attempt was made, display "No users found" message
    <Box
      bg="rgba(0, 3, 124, 0.25)"
      _hover={{ bg: "rgba(0, 4, 4, 0.6)" }}
      w={{ base: "100%", md: "100%" }}
      display={{ base: "flex", md: "flex" }}
      alignItems="center"
      color="gray.400"
      px={3}
      py={3}
      mb={3}
      mt={5}
      borderRadius="lg"
    >
      <Text>No users found</Text>
    </Box>
  ) : null
                } 
                {loadingChat && <Spinner ml='auto' display='flex'/>}
            </DrawerBody>
            </DrawerContent>
           
      </Drawer>
    </div>
  );
}

export default SideDrawer;
