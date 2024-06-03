import { VStack,Input,InputGroup,InputRightElement,Button } from '@chakra-ui/react'
import {
  FormControl,
  FormLabel,
  
} from '@chakra-ui/react'
import React from 'react'
import { useState } from 'react'
const Signup = () => {
    //Vstack vertically align our divs
    const[show,setshow]=useState(false)
    const [name,setName]=useState('');
    const [email,setemail]=useState('')
    const [confirmpass,setconfirmpass]=useState('')
    const [pass,setpass]=useState('')
    const [pic,setpic]=useState('')
    const postDetails=()=>{}
    const submitHandler=()=>{}
    
  return (
    <VStack spacing={'5px'}>
            <FormControl id='firstname' isRequired>
                <FormLabel color={'white'}>Name</FormLabel>
                    
                    <Input placeholder='Enter your name'
                  onChange={(e)=>{
                    setName(e.target.value)}} />

                                <FormControl id='email' isRequired></FormControl>
                    <FormLabel color={'white'}>Email</FormLabel>
                    <Input placeholder='Enter your email'
                  onChange={(e)=>{
                    setemail(e.target.value)}} />
                     <FormLabel color={'white'}>Password</FormLabel>
                   <InputGroup size="md">
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter Password"
            onChange={(e) => setpass(e.target.value) }
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={()=>{return setshow(!show)}}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
         <FormLabel color={'white'}>Confirm Password</FormLabel>


                    <InputGroup size="md">
          <Input
            type={show ? "text" : "password"}
            placeholder="confirm Password"
            onChange={(e) => setconfirmpass(e.target.value) }
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={()=>{return setshow(!show)}}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>


                  

                
            </FormControl>

    <FormControl id='pic'>
        <FormLabel>upload your profilr picture</FormLabel> 
        <Input type='file' p={1.5} accept='image/*'
        onChange={(e)=> postDetails(e.target.files[0])}/></FormControl>
    <Button colorScheme='purple' width='100%' style={{marginTop: 15}} onClick={submitHandler}>Sign Up</Button>
    </VStack>
  )
}

export default Signup
