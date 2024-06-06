import React from 'react';
import profile from '../../profile.png'
import { IconButton, useDisclosure } from '@chakra-ui/react';
import { ViewIcon } from '@chakra-ui/icons'; // Corrected import
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Image,
  Text
} from '@chakra-ui/react'
const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton display={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
      )}
      
      <Modal size='lg' isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent h='310px'>
          <ModalHeader fontSize={'40px'} fontFamily={'Work sans'} display={'flex'} justifyContent={'center'}>{user.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody display={'flex'} flexDir={'column'} alignSelf={'center'} justifyContent={'space-between'}>
           
          
          <Image 
          borderRadius={'full'}
          boxSize={'100px'}
          src={profile}/>
          <Text fontSize={{ bse: "28px", md:"30px"}} fontFamily="Work sans">email:{user.email}</Text>
</ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
           
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ProfileModal;
 