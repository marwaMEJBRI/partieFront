import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useSelector, useDispatch } from 'react-redux';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem } from '@mui/material';
import { addMessage, getMessages } from '../../../../actions/message.actions'

const socket = io('http://localhost:8080'); // Assurez-vous que l'URL correspond à celle de votre serveur

const ChatRoomDialog = ({ open, onClose, receiverId }) => {
  const dispatch = useDispatch();

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [selectedReceiver, setSelectedReceiver] = useState(receiverId);

  const user = useSelector(state => state.auth.user);
  const users = useSelector((state) => state.user.users);
  const loading = useSelector((state) => state.user.loading);

  const getListMessage = useSelector((state) => state.message?.messages);

  useEffect(() => {
    dispatch(getMessages());
  }, [dispatch]);

  useEffect(() => {
    socket.on('receiveMessage', (message) => {
      if (message.receiver === selectedReceiver || message.sender === selectedReceiver) {
        dispatch(addMessage(message));
      }
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [dispatch, selectedReceiver]);


  const sendMessage = async () => {
    if (message.trim() && selectedReceiver) {
      const messageData = {
        sender: user._id,
        receiver: selectedReceiver,
        content: message,
        timestamp: new Date(),
      };
      socket.emit('sendMessage', messageData);
      setMessage('');

      // Dispatch the addMessage action
      try {
        await dispatch(addMessage({
          receiver: selectedReceiver,
          content: message
        }));
        setMessages(prevMessages => [...prevMessages, messageData]);
      } catch (error) {
        console.error('Failed to add message:', error);
      }
    }
  };

  const filteredMessages = getListMessage.filter(msg =>
    (msg.sender === user._id && msg.receiver === selectedReceiver) ||
    (msg.sender === selectedReceiver && msg.receiver !== user._id)
  );

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Chat Room</DialogTitle>
      <DialogContent>
        <div className="chat-room">
          <div className="recipient-list">
            <Select
              value={selectedReceiver}
              onChange={(e) => setSelectedReceiver(e.target.value)}
              required
              fullWidth
              displayEmpty
            >
              <MenuItem value="" disabled>Sélectionner...</MenuItem>
              {!loading && users.map((user) => (
                <MenuItem key={user._id} value={user._id}>
                  {user.username}
                </MenuItem>
              ))}
            </Select>
          </div>
          <div className="messages-list">
            {messages.map((msg, index) => (
              <div key={index}>
                <strong>{msg.sender === user._id ? 'You' : users.find(u => u._id === msg.sender)?.username || 'Unknown'}</strong>: {msg.content} <em>{new Date(msg.timestamp).toLocaleTimeString()}</em>
              </div>
            ))}
          </div>

          <TextField
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type your message"
          />
        </div>

        <p>List of message : </p>
        {filteredMessages.map((msg) => (
          <div key={msg._id}>
            <strong>
              {msg.sender === user._id
                ? 'Me'
                : msg.receiver !== user._id
                  ? 'You'
                  : users.find(u => u._id === msg.sender)?.username || 'Unknown'}
            </strong>: {msg.content} <em>{new Date(msg.timestamp).toLocaleTimeString()}</em>
          </div>
        ))}

      </DialogContent>

      <DialogActions>
        <Button onClick={sendMessage} variant="contained" color="primary">Send</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChatRoomDialog;
