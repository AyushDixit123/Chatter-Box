import { VStack, Input, InputGroup, InputRightElement, Button } from '@chakra-ui/react';
import { FormControl, FormLabel } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useToast } from '@chakra-ui/react';
import axios from 'axios'; // Import axios if not already done
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
//retryinghttps://lets-chat-ap7p.onrender.com
const Login = () => {
  // VStack vertically aligns our divs
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate(); // Initialize navigate

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !pass) {
      toast({
        title: "Fill all the fields",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        }
      };
      const { data } = await axios.post("https://lets-chat-ap7p.onrender.com/api/user/login", {  email, password: pass }, config);
      localStorage.setItem("userinfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chats");
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: error.response?.data?.message || error.message,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  }

  return (
    <VStack spacing={'5px'}>
      <FormControl id='email' isRequired>
        <FormLabel color={'white'}>Email</FormLabel>
        <Input
          placeholder='Enter your email'
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>

      <FormControl id='password' isRequired>
        <FormLabel color={'white'}>Password</FormLabel>
        <InputGroup size="md">
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter Password"
            onChange={(e) => setPass(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button
        colorScheme='purple'
        width='100%'
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading} // Disable button when loading
      >
        Login
      </Button>
    </VStack>
  );
};

export default Login;