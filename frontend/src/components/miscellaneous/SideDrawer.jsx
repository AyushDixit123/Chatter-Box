import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tooltip,
  Button,
  Text,
  Box
} from '@chakra-ui/react';
import ProfileModal from './ProfileModal';
import React, { useState } from 'react';
import { ChatState } from '../../context/ChatProvider';
import { useNavigate } from 'react-router-dom';
const SideDrawer = () => {
  const navigate = useNavigate();
  const { user } = ChatState(); // Accessing user from context
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const logoutHandler =() =>{
    localStorage.removeItem("userinfo");
    navigate('/')
  }
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
          <Button variant="ghost">
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
    </div>
  );
}

export default SideDrawer;
