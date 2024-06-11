import React from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Signup from '../components/Auth/Signup'
import Login from '../components/Auth/Login'

import { 
  Container,Box, Text, Tabs, TabList, TabPanels, Tab, TabPanel
} from '@chakra-ui/react'

const Homepage = () => {
   const navigate = useNavigate();
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userinfo"));
    if (userInfo) {
      navigate("/chats");
    }
  }, [navigate]);
  //container help us to keep our div responsive
       
  return (
    <Container maxW='xl' centerContent>
      <Box d="flex"
        justifyContent="center"
        p={3}
        bg=" skyblue"
        color={"white"}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
        border={"1px solid #666777"}>
        <Text fontSize='4xl' fontFamily='Work sans' textAlign={'center'}>Chatter-Box</Text>
      </Box>
      <Box bg={"skyblue"}  w="100%" p={4} borderRadius={'lg'} borderWidth={'1px'}>
        <Tabs variant='soft-rounded' >
  <TabList mb='1em'>
    <Tab textColor={'white'} width={'50%'}>Login</Tab>
    <Tab textColor={'white'} width={'50%'}>Sign Up</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>
       <Login /> 
    </TabPanel>
    <TabPanel>
      <Signup /> 
    </TabPanel>
  </TabPanels>
</Tabs>

      </Box>
     

    </Container>
  )
}

export default Homepage
  