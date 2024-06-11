import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage'
import ChatPage from './pages/ChatPage';
import './App.css'

const App = () => {
  return (
    <div className='App'>
      
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/chats" element={<ChatPage />} />
      
    </Routes></div>
  );
};

export default App;