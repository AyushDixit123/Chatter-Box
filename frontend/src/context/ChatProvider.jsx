import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userinfo"));
    console.log("userinfo",userInfo)
    setUser(userInfo);
    if (!userInfo) {
      navigate("/");
    } else {
      navigate("/chats");
    }
  }, [navigate]);

  return (
    <ChatContext.Provider value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats, notifications, setNotifications }}>
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
