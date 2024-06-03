import { VStack, Input, InputGroup, InputRightElement, Button } from '@chakra-ui/react';
import {
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import React from 'react';
import { useState } from 'react';

const Login = () => {
  // VStack vertically aligns our divs
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  const submitHandler = () => {};

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
      >
        Login
      </Button>
    </VStack>
  );
};

export default Login;
