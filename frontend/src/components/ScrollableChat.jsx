import React, { useEffect } from 'react';
import ScrollableFeed from 'react-scrollable-feed';
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../config/ChatLogic';
import { ChatState } from '../context/ChatProvider';
import { Avatar } from '@chakra-ui/react';
import axios from 'axios';

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
  

  console.log('Messages:', messages); // Debugging line

  return (
    <ScrollableFeed>
      {messages && messages.map((m, i) => (
        <div className='hide-scrollbar' style={{ display: 'flex',  }} key={m._id}>
          {(isSameSender(messages, m, i, user._id) ||
            isLastMessage(messages, i, user._id)) && (
            <Avatar
              mt={'7px'}
              mr={1}
              size={'sm'}
              cursor={'pointer'}
              name={m.sender.name}
              src={m.sender.pic}
            />
          )}
          <span
            style={{
              backgroundColor: `${
                m.sender._id === user._id ? '#BEE3F8' : '#B9F5D0'
              }`,
              borderRadius: '20px',
              padding: '5px 15px',
              maxWidth: '75%',
              marginLeft: isSameSenderMargin(messages,m,i,user._id),
              marginTop: isSameUser(messages,m,i,user._id)? 3:10
            }}
          >
            {m.content}
          </span>
        </div>
      ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
