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
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Input,
  Spinner,
} from '@chakra-ui/react';
import getSender from '../../config/ChatLogic';
import ProfileModal from './ProfileModal';
import React, { useState } from 'react';
import { ChatState } from '../../context/ChatProvider';
import { useNavigate } from 'react-router-dom';
import { useDisclosure } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import ChatLoading from '../ChatLoading';
import UserListItem from '../UserAvatar/UserListItem';
import axios from 'axios';

const SideDrawer = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  


  const {
    setSelectedChat,
    user,
    notifications,
    setNotifications,
    chats,
    setChats,
  } = ChatState();
  
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [searchAttempt, setSearchAttempt] = useState(false);

  const logoutHandler = () => {
    localStorage.removeItem("userinfo");
    navigate("/");
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);
      setSearchAttempt(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`https://lets-chat-ap7p.onrender.com/api/user?search=${search}`, config);

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error occurred!",
        description: "Failed to load the search results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const accessChat = async (userId) => {
    console.log("accessChat called with userId:", userId);

    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`https://lets-chat-ap7p.onrender.com/api/chat`, { userId }, config);

      if (data && data._id) {
        console.log("Chat data received:", data);
        if (!chats.find((chat) => chat._id === data._id)) {
          setChats([...chats, data]);
        }
        setSelectedChat(data);
        onClose();
        navigate(`/chats/${data._id}`);
      } else {
        toast({
          title: "An error occurred. Please try again",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "bottom-left",
        });
      }
    } catch (error) {
      console.error("Error accessing chat:", error);
      toast({
        title: "An error occurred. Please try again",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
    } finally {
      setLoadingChat(false);
    }
  };

  return (
    <div style={{ margin: "9px 9px 0 9px", backgroundColor: "#5AB2FF" }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" w="100%" p="5px 10px" borderWidth="1px" borderColor="rgba(255, 255, 255, 0.4)">
        <Tooltip label="Search Users to chat" aria-label="A tooltip" placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i className="fas fa-search"></i>
            <Text display={{ base: "none", md: "flex" }} px="4" color="white">Search User</Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="Work sans">Chatter Box</Text>
        <Menu>
          <MenuButton p="1" as={Button} minHeight="auto" colorScheme="transparent">
            <i className="fa-solid fa-bell"></i>
         <MenuList pl={2}>
              {!notifications.length && "No new messages"}
              {notifications.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotifications(notifications.filter((n) => n !== notif));
                  }}
                  bg="rgba(0, 4, 4, 0.6)"
                  _hover={{
                    bg: "rgba(50, 3, 255, 0.15)",
                    transition: "background-color 0.1s ease-in-out",
                  }}
                  transition="background-color 0.8s ease-in-out"
                >
                  {notif.chat.isGroupChat
                    ? `${notif.chat.chatName}`
                    : `${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList> 
            <i className="fa-solid fa-chevron-down" style={{ marginLeft: "10px" }}></i>
          </MenuButton>
          <MenuList sx={{ bg: 'purple.600', '& .chakra-menu__menuitem': { bg: 'purple.600', _hover: { bg: 'blue.500' } } }}>
            <ProfileModal user={user}>
              <MenuItem transition="background-color 0.8s ease-in-out">My Profile</MenuItem>
            </ProfileModal>
            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
          </MenuList>
        </Menu>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent bg="#5AB2FF" color="white">
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" paddingBottom="2">
              <Input placeholder="Search by name or email" mr={2} value={search} onChange={(e) => setSearch(e.target.value)} borderColor="white" />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : Array.isArray(searchResult) && searchResult.length > 0 ? (
              searchResult.map(user => (
                <UserListItem key={user._id} user={user} handleFunction={() => accessChat(user._id)} />
              ))
            ) : searchAttempt && search !== "" ? (
              <Box bg="rgba(0, 3, 124, 0.25)" _hover={{ bg: "rgba(0, 4, 4, 0.6)" }} w="100%" display="flex" alignItems="center" color="gray.400" px={3} py={3} mb={3} mt={5} borderRadius="lg">
                <Text>No users found</Text>
              </Box>
            ) : null}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default SideDrawer;
