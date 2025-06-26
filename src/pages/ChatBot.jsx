import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Send, Mic, MicOff, Bot, User, ArrowDown, Trash2 } from 'lucide-react';
import { useSelector } from "react-redux";

const Chatbot = () => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [page, setPage] = useState(1);
  const [fetchedPages, setFetchedPages] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const chatWindowRef = useRef(null);
  const recognitionRef = useRef(null);
  const { userInfo } = useSelector((state) => state.auth);
  const [userId, setUserId] = useState(userInfo?._id || "");
  const [username, setUserName] = useState(userInfo?.username || "");

  // Check if user is logged in
  useEffect(() => {
    if (!userInfo || !userInfo._id) {
      alert("Please log in first.");
      window.location.href = "/login"; // redirect to login
    } else {
      setUserId(userInfo._id);
      setUserName(userInfo.username);
      fetchMessages(1);
    }
  }, [userInfo]);

  // Fetch user messages
  const fetchMessages = async (pageNum) => {
    if (fetchedPages.has(pageNum)) return; // Prevent re-fetching same page
    
    try {
      setIsLoading(true);
      const res = await axios.get("http://127.0.0.1:5000/api/user-messages", {
        params: {
          user_id: userId,
        },
        withCredentials: true
      });
      
      // API now returns messages with the correct structure
      const newMsgs = res.data.map(item => ({
        role: item.role,
        content: item.content,
        timestamp: item.timestamp,
        _id: item._id
      }));

      if (newMsgs.length === 0) {
        const welcomeMessage = {
          role: "bot",
          content: "Hello! I'm your Nutrition & Fitness Assistant. You can ask me about calories in food, remaining calories, exercise recommendations, or recipe suggestions.",
          timestamp: new Date().toISOString()
        };
        setMessages([welcomeMessage]);
      } else {
        setMessages(newMsgs);
      }

      setFetchedPages(prev => new Set(prev).add(pageNum));
    } catch (err) {
      console.error("Failed to fetch user messages:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async () => {
    if (!userInput.trim()) return;

    const newMessage = {
      role: "user",
      content: userInput,
      timestamp: new Date().toISOString()
    };
    
    setMessages((prev) => [...prev, newMessage]);
    const currentInput = userInput;
    setUserInput("");

    try {
      setIsLoading(true);
      const response = await axios.post("http://127.0.0.1:5000/Postmessage", {
        msg: currentInput,
        user_id: userId,
        username: username
      }, {
        withCredentials: true
      });

      const botMessage = {
        role: "bot",
        content: response.data.message || response.data.error,
        timestamp: new Date().toISOString()
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("Error sending message:", err);
      setMessages((prev) => [...prev, {
        role: "bot",
        content: "Error connecting to server. Please try again later.",
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const startListening = () => {
    if (!window.webkitSpeechRecognition && !window.SpeechRecognition) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "en-US";
    recognition.start();
    setIsListening(true);
    recognitionRef.current = recognition;

    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;
      setUserInput(prevInput => prevInput + ' ' + speechResult);
    };

    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event);
      setIsListening(false);
    };
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleDelete = async (index) => {
    const messageToDelete = messages[index];
    
    // Only proceed if it has an _id (was saved to database)
    if (messageToDelete._id) {
      try {
        await axios.delete(`http://127.0.0.1:5000/api/chat-history/${messageToDelete._id}`);
      } catch (err) {
        console.error("Failed to delete message:", err);
        return; // Don't proceed if delete failed
      }
    }
    
    const updated = messages.filter((_, i) => i !== index);
    setMessages(updated);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8" style={{ background: "linear-gradient(to right, #bfdbfe, #e9d5ff)" }}>
      <motion.div
        className="w-full max-w-3xl bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden flex flex-col"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ height: "80vh" }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white flex items-center">
          <Bot className="h-6 w-6 mr-3" />
          <div>
            <h2 className="font-bold text-lg">Nutrition & Fitness Assistant</h2>
            <p className="text-xs text-white/80">Ask me about calories, exercise, or recipes</p>
          </div>
        </div>

        {/* Load More */}
        <div className="text-center bg-gray-100 py-2 text-sm">
          <button
            onClick={() => { setPage(p => p + 1); fetchMessages(page + 1); }}
            className="text-blue-600 hover:underline flex mx-auto items-center"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Load earlier messages"}
            {!isLoading && <ArrowDown className="h-4 w-4 ml-1" />}
          </button>
        </div>

        {/* Chat Body */}
        <div ref={chatWindowRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              className={`group flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              initial={{ opacity: 0, y: 10, x: msg.role === "user" ? 20 : -20 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col max-w-[80%]">
                <div className={`rounded-lg p-3 text-sm ${msg.role === "user" ? "bg-purple-600 text-white" : "bg-gray-300 text-gray-900"}`}>
                  <div className="font-semibold mb-1 flex items-center gap-2">
                    {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    {msg.role === "user" ? "You" : "Bot"}
                    <span className="ml-auto text-xs opacity-75">{formatTime(msg.timestamp)}</span>
                  </div>
                  <div>{msg.content}</div>
                </div>

                {/* Only Delete for user messages */}
                {msg.role === "user" && (
                  <div className="flex gap-2 text-xs mt-1 opacity-0 group-hover:opacity-100 transition">
                    <button onClick={() => handleDelete(index)} className="text-red-500 hover:underline flex items-center gap-1">
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Section */}
        <div className="flex items-center p-4 space-x-4">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none"
            placeholder="Type your message..."
            disabled={isLoading}
          />
          <button 
            onClick={handleSend} 
            className={`p-3 ${isLoading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded-full`}
            disabled={isLoading}
          >
            <Send className="h-5 w-5" />
          </button>
          <button
            onClick={isListening ? stopListening : startListening}
            className={`p-3 rounded-lg ${isListening ? "bg-red-500 text-white animate-pulse" : "bg-gray-100 text-purple-600 hover:bg-gray-200"}`}
            disabled={isLoading}
          >
            {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Chatbot;