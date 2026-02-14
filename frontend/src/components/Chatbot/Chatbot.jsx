import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import Ekart from "../../../public/Ekart.png";

import { useSelector } from "react-redux";
import userLogo from "../../../public/userLogo.png";


/**
 * Mature UI Styles & Theme Constants
 */
const THEME = {
  primary: "#e91e63", // The pink from the screenshots
  bgSidebar: "#fff",
  bgMain: "#f8f9fa",
  border: "#dee2e6",
  textMain: "#212529",
  textMuted: "#6c757d",
};

const EKART_LOGO = "https://i.ibb.co/LhbV4bT/ekart-logo.png"; // Placeholder for the logo from your screenshots

/**
 * EKART MAIN APPLICATION
 */
const Chatbot = () => {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState(() =>
    JSON.parse(localStorage.getItem("ekart_v2_history") || "[]"),
  );
  const [currentChatId, setCurrentChatId] = useState(null);
  const [assets, setAssets] = useState([]);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const fileRef = useRef(null);
  const scrollRef = useRef(null);
  const { user } = useSelector((store) => store.user);
  const profilePic = user?.profilePic || userLogo;
  const firstname = user?.firstname || " "

  useEffect(() => {
    localStorage.setItem("ekart_v2_history", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [history, loading]);

  const currentChat = history.find((c) => c.id === currentChatId) || {
    messages: [],
  };

  const startNewChat = () => {
    const newId = Date.now().toString();
    setHistory((prev) => [
      { id: newId, title: "New Inquiry", messages: [] },
      ...prev,
    ]);
    setCurrentChatId(newId);
    setAssets([]);
  };

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files).map((f) => ({
      id: Math.random().toString(36).substr(2, 9),
      file: f,
      preview: URL.createObjectURL(f),
      type: f.type.split("/")[0],
    }));
    setAssets((prev) => [...prev, ...selected]);
    e.target.value = null;
  };

  const handleSubmit = async (e, forcedText = null) => {
    if (e) e.preventDefault();
    const query = forcedText || question;
    if (!query && assets.length === 0) return;

    if (!currentChatId) {
      const newId = Date.now().toString();
      const firstChat = {
        id: newId,
        title: query.slice(0, 25) + "...",
        messages: [],
      };
      setHistory((prev) => [firstChat, ...prev]);
      setCurrentChatId(newId);
    }

    const newUserMsg = { role: "user", content: query, assets: [...assets] };
    setHistory((prev) =>
      prev.map((c) =>
        c.id === (currentChatId || prev[0].id)
          ? { ...c, messages: [...c.messages, newUserMsg] }
          : c,
      ),
    );

    setQuestion("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("question", query);
      assets.forEach((asset) => formData.append("files", asset.file));

      const res = await axios.post(
        "http://localhost:5000/api/v1/chatbot",
        formData,
      );
      const aiMsg = { role: "assistant", content: res.data.finalData };

      setHistory((prev) =>
        prev.map((c) =>
          c.id === (currentChatId || prev[0].id)
            ? { ...c, messages: [...c.messages, aiMsg] }
            : c,
        ),
      );
    } catch (err) {
      const errorMsg = {
        role: "assistant",
        content:
          "_System: Connection timed out. Please check your local server._",
      };

      setHistory((prev) =>
        prev.map((c) =>
          c.id === (currentChatId || prev[0].id)
            ? { ...c, messages: [...c.messages, errorMsg] }
            : c,
        ),
      );
      console.log(err);
    } finally {
      setLoading(false);
      setAssets([]);
    }
  };

  return (
    <div className="flex h-screen bg-[#f1f3f5] text-[#333] font-sans">
      {/* Mature Sidebar (White) */}
      <aside
        className={`${isSidebarOpen ? "w-64" : "w-0"} transition-all duration-300 bg-white border-r border-gray-200 flex flex-col shadow-sm`}
      >
        <div className="p-4 border-b border-gray-100 flex items-center justify-center">
          <img
            src={Ekart}
            alt="Ekart Logo"
            className="h-10 object-contain"
            onError={(e) => (e.target.style.display = "none")}
          />
          <span className="font-bold text-lg text-gray-800 ml-2">ekart</span>
        </div>

        <div className="p-4">
          <button
            onClick={startNewChat}
            className="w-full py-2.5 bg-white hover:bg-gray-50 text-[#e91e63] border border-[#e91e63] rounded-md text-sm font-semibold transition-all flex items-center justify-center gap-2"
          >
            <span className="text-lg">+</span> New Chat
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 space-y-1">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-2">
            Recent Enquiries
          </p>
          {history.map((chat) => (
            <div
              key={chat.id}
              className={`group flex items-center p-3 rounded-lg cursor-pointer transition-all ${currentChatId === chat.id ? "bg-[#fff0f5] text-[#e91e63]" : "hover:bg-gray-50 text-gray-600"}`}
              onClick={() => setCurrentChatId(chat.id)}
            >
              <span className="text-xs truncate flex-1 font-medium">
                {chat.title}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setHistory((h) => h.filter((x) => x.id !== chat.id));
                }}
                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 text-[10px]"
              >
                ✕
              </button>
            </div>
          ))}
        </nav>

        <div className="p-4 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-[#e91e63] font-bold text-xs">
              {
                <img
                  src={profilePic}
                  alt="Profile"
                  className="w-10 h-10 rounded-full"
                />
              } 
            </div>
             Hello, {firstname}
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="text-gray-500 hover:text-[#e91e63]"
            >
              ☰
            </button>
            <h2 className="text-sm font-bold text-gray-700">Concierge AI</h2>
          </div>
        </header>

        {/* Chat Feed */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 md:p-12 space-y-6"
        >
          {currentChat.messages.length === 0 && !loading && (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
              <img
                src={Ekart}
                alt="Ekart Logo"
                className="h-20 grayscale opacity-20 mb-6"
              />
              <h3 className="text-xl font-light text-gray-500 italic">
                "Treat yourself, you've earned it."
              </h3>
              <p className="text-sm text-gray-400 mt-2">
                Start a conversation for personalized shopping insights.
              </p>
            </div>
          )}

          {currentChat.messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-5 ${msg.role === "user" ? "bg-[#e91e63] text-white shadow-md" : "bg-white border border-gray-200 text-gray-800 shadow-sm"}`}
              >
                {msg.assets?.length > 0 && (
                  <div className="flex gap-2 mb-3 overflow-x-auto">
                    {msg.assets.map((a) => (
                      <img
                        key={a.id}
                        src={a.preview}
                        className="w-16 h-16 object-cover rounded border border-white/20"
                      />
                    ))}
                  </div>
                )}
                <div
                  className={`prose prose-sm ${msg.role === "user" ? "prose-invert" : "prose-pink"} max-w-none`}
                >
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-100 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
                <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                  Ekart is checking stock...
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Mature Input Controls */}
        <div className="p-6 bg-white border-t border-gray-200">
          <div className="max-w-4xl mx-auto">
            {assets.length > 0 && (
              <div className="flex gap-2 p-3 bg-gray-50 border border-gray-100 rounded-t-xl animate-in slide-in-from-bottom-2">
                {assets.map((a) => (
                  <div key={a.id} className="relative group">
                    <img
                      src={a.preview}
                      className="w-14 h-14 rounded object-cover shadow-sm border border-gray-200"
                    />
                    <button
                      onClick={() =>
                        setAssets((p) => p.filter((x) => x.id !== a.id))
                      }
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-[8px] flex items-center justify-center shadow-lg"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div
              className={`relative flex items-center bg-gray-50 border ${assets.length > 0 ? "border-t-0 rounded-b-xl" : "rounded-xl"} border-gray-200 px-4 py-3 focus-within:ring-2 focus-within:ring-[#e91e63]/20 focus-within:border-[#e91e63] transition-all`}
            >
              <button
                onClick={() => fileRef.current.click()}
                className="text-gray-400 hover:text-[#e91e63] p-2 transition-colors mr-2"
                title="Attach Files/Images"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                  />
                </svg>
              </button>

              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && !e.shiftKey && handleSubmit(e)
                }
                className="flex-1 bg-transparent border-none outline-none text-sm text-gray-800 placeholder:text-gray-400"
                placeholder="Ask your concierge anything about products, prices, or trends..."
              />

              <button
                onClick={handleSubmit}
                disabled={loading || (!question && assets.length === 0)}
                className="ml-3 bg-[#e91e63] text-white px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider shadow-md hover:opacity-90 disabled:opacity-30 disabled:grayscale transition-all"
              >
                Send
              </button>
            </div>

            <div className="mt-3 flex gap-3 justify-center">
              <button
                onClick={() =>
                  handleSubmit(null, "Compare the latest iPhone vs Samsung")
                }
                className="text-[10px] font-bold text-gray-400 hover:text-[#e91e63] uppercase tracking-tighter"
              >
                Compare Models
              </button>
              <span className="text-gray-200">|</span>
              <button
                onClick={() =>
                  handleSubmit(null, "Find similar products to my upload")
                }
                className="text-[10px] font-bold text-gray-400 hover:text-[#e91e63] uppercase tracking-tighter"
              >
                Vision Search
              </button>
              <span className="text-gray-200">|</span>
              <button
                onClick={() =>
                  handleSubmit(null, "Check price drops in Mumbai")
                }
                className="text-[10px] font-bold text-gray-400 hover:text-[#e91e63] uppercase tracking-tighter"
              >
                Price Watch
              </button>
            </div>
          </div>
        </div>
      </main>

      <input
        type="file"
        multiple
        ref={fileRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*,video/*,.pdf,.doc,.docx,.txt"
      />
    </div>
  );
};

export default Chatbot;
