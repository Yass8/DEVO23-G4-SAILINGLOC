// pages/client/dashboard/MessagesContent.jsx
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

// Simulation des données
const reservations = [
  {
    id: 1,
    boat: "Sea Ray 240",
    locataire: "Jean Dupont",
    proprietaire: "Alice Martin",
    messages: [
      {
        id: 1,
        sender_id: 2,
        content: "Bonjour, est-ce que le bateau est disponible le 15 août ?",
        is_read: true,
        created_at: "2025-07-27T10:00:00Z",
      },
      {
        id: 2,
        sender_id: 1,
        content: "Oui, il est disponible. Je vous envoie le devis.",
        is_read: false,
        created_at: "2025-07-27T10:05:00Z",
      },
    ],
  },
 {
    id: 2,
    boat: "Bénéteau Oceanis 45",
    locataire: "Marie Curie",
    proprietaire: "Bob Dupont",
    messages: [
      {
        id: 1,
        sender_id: 2,
        content: "Bonjour, j'ai une question sur le bateau.",
        is_read: true,
        created_at: "2025-07-26T14:00:00Z",
      },
      {
        id: 2,
        sender_id: 1,
        content: "Bien sûr, quelle est votre question ?",
        is_read: false,
        created_at: "2025-07-26T14:05:00Z",
      },
      {
        id: 3,
        sender_id: 2,
        content: "Est-ce que le bateau est équipé d'un GPS ?",
        is_read: false,
        created_at: "2025-07-26T14:10:00Z",
      },
        {
            id: 4,
            sender_id: 1,
            content: "Oui, il est équipé d'un GPS.",
            is_read: false,
            created_at: "2025-07-26T14:15:00Z",
        },
        {
            id: 5,
            sender_id: 2,
            content: "Merci pour l'info !",
            is_read: false,
            created_at: "2025-07-26T14:20:00Z",
        }
    ],
    },
];

export default function Messages() {
  const [activeReservationId, setActiveReservationId] = useState(
    reservations[0]?.id ?? null
    );
  const userId = 1; // à récupérer via auth

  const activeReservation = reservations.find((r) => r.id === activeReservationId);

  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    if (!newMessage.trim()) return;
    // TODO : POST /api/messages
    // Ajout temporaire côté front
    activeReservation?.messages.push({
      id: Date.now(),
      sender_id: userId,
      content: newMessage,
      is_read: false,
      created_at: new Date().toISOString(),
    });
    setNewMessage("");
  };

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-7rem)] bg-gray-100 gap-4">
      {/* Liste des threads */}
      <div className="md:w-1/3 bg-white rounded-xl shadow p-4 overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">Conversations</h2>
        {reservations.map((r) => {
          const unread = r.messages.filter((m) => !m.is_read && m.sender_id !== userId).length;
          return (
            <button
              key={r.id}
              onClick={() => setActiveReservationId(r.id)}
              className={`w-full text-left p-3 rounded-lg mb-2 transition ${
                activeReservationId === r.id ? "bg-blue-100" : "hover:bg-gray-100"
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-sm">{r.boat}</p>
                  <p className="text-xs text-gray-500">Avec {r.locataire}</p>
                </div>
                {unread > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                    {unread}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Conversation active */}
      <div className="flex-1 flex flex-col bg-white rounded-xl shadow">
        {activeReservation ? (
          <>
            {/* Header */}
            <div className="border-b p-4">
              <p className="font-bold">{activeReservation.boat}</p>
              <p className="text-sm text-gray-600">
                {userId === 1 ? activeReservation.locataire : activeReservation.proprietaire}
              </p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {activeReservation.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender_id === userId ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-xl text-sm ${
                      msg.sender_id === userId
                        ? "bg-mocha text-sand"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    <p>{msg.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(msg.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="border-t p-4 flex items-center gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Écrire un message..."
                className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-mocha"
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                onClick={handleSend}
                className="bg-mocha text-white rounded-full p-2 hover:bg-mocha/90 transition"
              >
                <FontAwesomeIcon icon={faPaperPlane} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Sélectionnez une conversation
          </div>
        )}
      </div>
    </div>
  );
}