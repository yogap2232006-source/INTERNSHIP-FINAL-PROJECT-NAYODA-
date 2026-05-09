import { useState, useEffect, useContext } from 'react';
import io from 'socket.io-client';
import { Send, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const socket = io('http://localhost:5000'); 

export default function Chat() {
  const { user } = useContext(AuthContext);
  const [currentMessage, setCurrentMessage] = useState('');
  const [messageList, setMessageList] = useState([]);
  const [room] = useState('project-123');

  useEffect(() => {
    socket.emit('join_room', room);

    const receiveMessageHandler = (data) => {
      setMessageList((list) => [...list, data]);
    };

    socket.on('receive_message', receiveMessageHandler);

    return () => {
      socket.off('receive_message', receiveMessageHandler);
    };
  }, [room]);

  const sendMessage = async () => {
    if (currentMessage !== '') {
      const messageData = {
        room: room,
        author: user?.name || 'User',
        message: currentMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      await socket.emit('send_message', messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link to="/dashboard" className="text-gray-500 hover:text-gray-900 flex items-center transition">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex">
        <div className="flex-1 bg-white shadow-sm rounded-2xl border border-gray-200 flex flex-col overflow-hidden h-[700px]">
          {/* Chat Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-white flex items-center">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold mr-4">
              TV
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">TechVision Inc</h2>
              <p className="text-xs text-green-500 font-medium">Online</p>
            </div>
          </div>

          {/* Chat Body */}
          <div className="flex-1 p-6 overflow-y-auto bg-gray-50/50 space-y-4">
            <div className="text-center">
              <span className="text-xs text-gray-400 font-medium bg-gray-100 px-3 py-1 rounded-full">Today</span>
            </div>
            
            {/* Hardcoded initial message */}
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-5 py-3 max-w-[70%] shadow-sm">
                <p className="text-gray-800 text-sm">Hi! We reviewed your proposal for the E-commerce platform and we're interested. Are you available for a quick call?</p>
                <p className="text-[10px] text-gray-400 mt-1 text-right">10:30 AM</p>
              </div>
            </div>

            {/* Dynamic ephemeral messages */}
            {messageList.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.author === (user?.name || 'User') ? 'justify-end' : 'justify-start'}`}>
                <div className={`${msg.author === (user?.name || 'User') ? 'bg-brand-600 text-white rounded-tr-sm' : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm'} rounded-2xl px-5 py-3 max-w-[70%] shadow-sm`}>
                  <p className="text-sm">{msg.message}</p>
                  <p className={`text-[10px] mt-1 text-right ${msg.author === (user?.name || 'User') ? 'text-brand-200' : 'text-gray-400'}`}>{msg.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Footer */}
          <div className="px-4 py-4 bg-white border-t border-gray-200 flex items-center gap-3">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 border border-gray-300 rounded-full px-5 py-2.5 focus:ring-brand-500 focus:border-brand-500 text-sm"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={(e) => { e.key === 'Enter' && sendMessage(); }}
            />
            <button 
              onClick={sendMessage}
              className="h-10 w-10 bg-brand-600 rounded-full flex items-center justify-center text-white hover:bg-brand-700 transition shadow-sm flex-shrink-0"
            >
              <Send className="h-4 w-4 ml-1" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
