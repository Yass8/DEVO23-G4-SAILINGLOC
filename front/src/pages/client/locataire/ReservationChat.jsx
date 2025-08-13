import { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

// 💬 Messages mockés par réservation
const mockMessages = {
  1: [
    { id: 1, sender: "owner", text: "Bonjour, bienvenue à bord ! Des questions avant le départ ?", time: "10:00" },
    { id: 2, sender: "tenant", text: "Merci ! Est-ce qu’il y a un réfrigérateur à bord ?", time: "10:02" },
    { id: 3, sender: "owner", text: "Oui, il y a un petit frigo. N’hésitez pas si vous avez besoin de glaçons aussi.", time: "10:03" },
  ],
  2: [
    { id: 1, sender: "owner", text: "Bonjour, merci pour votre réservation. À bientôt !", time: "15:00" },
  ],
};

export default function ReservationChat() {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    // Simule un chargement
    setTimeout(() => {
      setMessages(mockMessages[id] || []);
    }, 300);
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    const msg = {
      id: Date.now(),
      sender: "tenant",
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, msg]);
    setNewMessage("");
  };

  return (
    <>
    <div className="p-4 max-w-2xl mx-auto bg-white flex flex-col h-[calc(100vh-98px)]">
      <h2 className="font-bold mb-1">RES1XF56SQT, Bavaria Cruiser 45</h2>
      <h3 className="mb-4">Conversation avec le propriétaire - John Doe</h3>
      <br />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === "tenant" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-xs px-3 py-2 rounded text-sm ${
                msg.sender === "tenant"
                  ? "bg-mocha text-sand"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              <p className="">{msg.text}</p>
              <p className="text-sm opacity-70 mt-1 float-end">{msg.time}</p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Écrire un message..."
          className="flex-1 border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-mocha"
        />
        <button
          onClick={handleSend}
          className="bg-mocha text-white rounded p-2 px-3 hover:bg-mocha/90 transition"
        >
          <FontAwesomeIcon icon={faPaperPlane} className="" />
        </button>
      </div>
      <div className="mt-6">
        <Link to="/my-space/reservations/1" className="text-slate-blue hover:underline">
          ← Retour au détail de la réservation
        </Link>
      </div>
    </div>
    
      </>
  );
}