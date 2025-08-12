import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faEnvelope, faSearch, faTrash, faEdit, faEye, faTimes, 
  faCheck, faBan, faClock, faUser, faShip, faReply,
  faCalendar, faFilter, faSort, faDownload, faExclamationTriangle,
  faCheckCircle, faTimesCircle, faHourglassHalf, faFlag,
  faChartLine, faChartBar, faChartPie, faTable, faList,
  faLightbulb, faHistory, faBell, faPhone, faFileAlt,
  faClipboardCheck, faClipboard, faReceipt, faCalculator, faPercent,
  faTag, faGift, faHandshake, faShieldAlt, faEyeSlash,
  faComment,
  faPaperPlane, faInbox, faArchive, faStar,
  faThumbsUp, faThumbsDown, faExclamationCircle, faQuestionCircle,
  faInfoCircle, faWarning, faLock, faUnlock
} from "@fortawesome/free-solid-svg-icons";

// Service pour récupérer les messages (simulé)
const fetchMessages = async () => {
  // Données simulées
  return [
    { id: 1, sender: 'Jean Dupont', subject: 'Question sur la réservation', content: 'Bonjour, j\'ai une question...', status: 'unread', date: '2024-01-15' },
    { id: 2, sender: 'Marie Martin', subject: 'Demande d\'information', content: 'Pouvez-vous me renseigner...', status: 'read', date: '2024-01-16' },
    { id: 3, sender: 'Pierre Durand', subject: 'Problème technique', content: 'J\'ai rencontré un problème...', status: 'archived', date: '2024-01-17' }
  ];
};

const updateMessage = async (id, data) => {
  console.log('Mise à jour du message:', id, data);
  return { success: true, message: 'Message mis à jour avec succès' };
};

const deleteMessage = async (id) => {
  console.log('Suppression du message:', id);
  return true;
};

const markAsRead = async (id) => {
  console.log('Marquage comme lu du message:', id);
  return { success: true, message: 'Message marqué comme lu' };
};

const markAsUnread = async (id) => {
  console.log('Marquage comme non lu du message:', id);
  return { success: true, message: 'Message marqué comme non lu' };
};

const archiveMessage = async (id) => {
  console.log('Archivage du message:', id);
  return { success: true, message: 'Message archivé' };
};

const unarchiveMessage = async (id) => {
  console.log('Désarchivage du message:', id);
  return { success: true, message: 'Message désarchivé' };
};

const flagMessage = async (id, reason) => {
  console.log('Signalement du message:', id, reason);
  return { success: true, message: 'Message signalé' };
};

const markAsSpam = async (id) => {
  console.log('Marquage comme spam du message:', id);
  return { success: true, message: 'Message marqué comme spam' };
};

const sendReply = async (id, replyData) => {
  console.log('Envoi de réponse au message:', id, replyData);
  return { success: true, message: 'Réponse envoyée' };
};

const forwardMessage = async (id, forwardData) => {
  console.log('Transfert du message:', id, forwardData);
  return { success: true, message: 'Message transféré' };
};

const exportToCSV = (messages) => {
  const csv = [
    ['ID', 'Expéditeur', 'Destinataire', 'Sujet', 'Statut', 'Priorité', 'Date création', 'Lu'],
    ...messages.map(m => [
      m.id,
      m.sender?.name || 'N/A',
      m.recipient?.name || 'N/A',
      m.subject || 'N/A',
      m.status,
      m.priority,
      formatDate(m.createdAt),
      m.isRead ? 'Oui' : 'Non'
    ])
  ].map(row => row.join(';')).join('\n');
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'messages.csv';
  a.click();
  URL.revokeObjectURL(url);
};

export default function MessagesAdminPage() {
  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [editMessage, setEditMessage] = useState(null);
  const [editForm, setEditForm] = useState({ 
    subject: '',
    content: '',
    status: 'pending',
    priority: 'medium',
    notes: ''
  });
  const [editLoading, setEditLoading] = useState(false);
  const [detailMessage, setDetailMessage] = useState(null);
  const [flagModal, setFlagModal] = useState(null);
  const [flagReason, setFlagReason] = useState('');
  const [replyModal, setReplyModal] = useState(null);
  const [replyForm, setReplyForm] = useState({
    subject: '',
    content: '',
    priority: 'medium'
  });
  const [forwardModal, setForwardModal] = useState(null);
  const [forwardForm, setForwardForm] = useState({
    recipient: '',
    subject: '',
    content: '',
    priority: 'medium'
  });
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterSender, setFilterSender] = useState('all');
  const [filterRead, setFilterRead] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [bulkAction, setBulkAction] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    setLoading(true);
    const data = await fetchMessages();
    setMessages(data);
    setLoading(false);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce message ? Cette action est irréversible.")) return;
    setActionLoading((prev) => ({ ...prev, [id]: true }));
    await deleteMessage(id);
    await loadMessages();
    setActionLoading((prev) => ({ ...prev, [id]: false }));
  };

  const handleEdit = (message) => {
    setEditMessage(message);
    setEditForm({
      subject: message.subject || '',
      content: message.content || '',
      status: message.status || 'pending',
      priority: message.priority || 'medium',
      notes: message.notes || ''
    });
  };

  const closeEditModal = () => {
    setEditMessage(null);
    setEditForm({ 
      subject: '',
      content: '',
      status: 'pending',
      priority: 'medium',
      notes: ''
    });
    setEditLoading(false);
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    await updateMessage(editMessage.id, editForm);
    await loadMessages();
    closeEditModal();
  };

  const handleDetail = (message) => setDetailMessage(message);
  const closeDetail = () => setDetailMessage(null);

  const handleMarkAsRead = async (id) => {
    setActionLoading((prev) => ({ ...prev, [id]: true }));
    await markAsRead(id);
    await loadMessages();
    setActionLoading((prev) => ({ ...prev, [id]: false }));
  };

  const handleMarkAsUnread = async (id) => {
    setActionLoading((prev) => ({ ...prev, [id]: true }));
    await markAsUnread(id);
    await loadMessages();
    setActionLoading((prev) => ({ ...prev, [id]: false }));
  };

  const handleArchive = async (id) => {
    setActionLoading((prev) => ({ ...prev, [id]: true }));
    await archiveMessage(id);
    await loadMessages();
    setActionLoading((prev) => ({ ...prev, [id]: false }));
  };

  const handleUnarchive = async (id) => {
    setActionLoading((prev) => ({ ...prev, [id]: true }));
    await unarchiveMessage(id);
    await loadMessages();
    setActionLoading((prev) => ({ ...prev, [id]: false }));
  };

  const handleFlag = (message) => {
    setFlagModal(message);
    setFlagReason('');
  };

  const closeFlagModal = () => {
    setFlagModal(null);
    setFlagReason('');
  };

  const submitFlag = async (e) => {
    e.preventDefault();
    if (!flagReason.trim()) {
      alert('Veuillez indiquer une raison de signalement');
      return;
    }
    setActionLoading((prev) => ({ ...prev, [flagModal.id]: true }));
    await flagMessage(flagModal.id, flagReason);
    await loadMessages();
    closeFlagModal();
    setActionLoading((prev) => ({ ...prev, [flagModal.id]: false }));
  };

  const handleMarkAsSpam = async (id) => {
    setActionLoading((prev) => ({ ...prev, [id]: true }));
    await markAsSpam(id);
    await loadMessages();
    setActionLoading((prev) => ({ ...prev, [id]: false }));
  };

  const handleReply = (message) => {
    setReplyModal(message);
    setReplyForm({
      subject: `Re: ${message.subject || ''}`,
      content: '',
      priority: message.priority || 'medium'
    });
  };

  const closeReplyModal = () => {
    setReplyModal(null);
    setReplyForm({
      subject: '',
      content: '',
      priority: 'medium'
    });
  };

  const submitReply = async (e) => {
    e.preventDefault();
    if (!replyForm.content.trim()) {
      alert('Veuillez saisir le contenu de la réponse');
      return;
    }
    setActionLoading((prev) => ({ ...prev, [replyModal.id]: true }));
    await sendReply(replyModal.id, replyForm);
    await loadMessages();
    closeReplyModal();
    setActionLoading((prev) => ({ ...prev, [replyModal.id]: false }));
  };

  const handleForward = (message) => {
    setForwardModal(message);
    setForwardForm({
      recipient: '',
      subject: `Fwd: ${message.subject || ''}`,
      content: `\n\n--- Message original ---\n${message.content || ''}`,
      priority: message.priority || 'medium'
    });
  };

  const closeForwardModal = () => {
    setForwardModal(null);
    setForwardForm({
      recipient: '',
      subject: '',
      content: '',
      priority: 'medium'
    });
  };

  const submitForward = async (e) => {
    e.preventDefault();
    if (!forwardForm.recipient.trim() || !forwardForm.content.trim()) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }
    setActionLoading((prev) => ({ ...prev, [forwardModal.id]: true }));
    await forwardMessage(forwardModal.id, forwardForm);
    await loadMessages();
    closeForwardModal();
    setActionLoading((prev) => ({ ...prev, [forwardModal.id]: false }));
  };

  const handleBulkAction = async () => {
    if (selectedMessages.length === 0 || !bulkAction) return;
    
    const action = window.confirm(`Voulez-vous vraiment ${bulkAction} ${selectedMessages.length} message(s) ?`);
    if (!action) return;

    setActionLoading((prev) => ({ ...prev, bulk: true }));
    
    try {
      for (const messageId of selectedMessages) {
        switch (bulkAction) {
          case 'read':
            await markAsRead(messageId);
            break;
          case 'unread':
            await markAsUnread(messageId);
            break;
          case 'archive':
            await archiveMessage(messageId);
            break;
          case 'spam':
            await markAsSpam(messageId);
            break;
          case 'delete':
            await deleteMessage(messageId);
            break;
        }
      }
      await loadMessages();
      setSelectedMessages([]);
      setBulkAction('');
    } catch (error) {
      alert('Erreur lors de l\'action en masse');
    } finally {
      setActionLoading((prev) => ({ ...prev, bulk: false }));
    }
  };

  const toggleMessageSelection = (messageId) => {
    setSelectedMessages(prev => 
      prev.includes(messageId) 
        ? prev.filter(id => id !== messageId)
        : [...prev, messageId]
    );
  };

  const selectAllMessages = () => {
    if (selectedMessages.length === filteredAndSortedMessages.length) {
      setSelectedMessages([]);
    } else {
      setSelectedMessages(filteredAndSortedMessages.map(m => m.id));
    }
  };

  // Filtrage et tri
  const filteredAndSortedMessages = messages
    .filter((message) => {
      const matchesSearch = message.subject?.toLowerCase().includes(search.toLowerCase()) ||
                           message.content?.toLowerCase().includes(search.toLowerCase()) ||
                           message.sender?.name?.toLowerCase().includes(search.toLowerCase()) ||
                           message.recipient?.name?.toLowerCase().includes(search.toLowerCase()) ||
                           message.id?.toString().includes(search);
      const matchesStatus = filterStatus === 'all' || message.status === filterStatus;
      const matchesPriority = filterPriority === 'all' || message.priority === filterPriority;
      const matchesType = filterType === 'all' || message.type === filterType;
      const matchesSender = filterSender === 'all' || message.sender?.id === filterSender;
      const matchesRead = filterRead === 'all' || 
        (filterRead === 'read' && message.isRead) ||
        (filterRead === 'unread' && !message.isRead);
      
      return matchesSearch && matchesStatus && matchesPriority && matchesType && matchesSender && matchesRead;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case 'priority':
          const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
          aValue = priorityOrder[a.priority] || 2;
          bValue = priorityOrder[b.priority] || 2;
          break;
        case 'sender':
          aValue = a.sender?.name?.toLowerCase();
          bValue = b.sender?.name?.toLowerCase();
          break;
        case 'subject':
          aValue = a.subject?.toLowerCase();
          bValue = b.subject?.toLowerCase();
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending': { text: 'En attente', class: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      'sent': { text: 'Envoyé', class: 'bg-green-100 text-green-800 border-green-200' },
      'delivered': { text: 'Livré', class: 'bg-blue-100 text-blue-800 border-blue-200' },
      'read': { text: 'Lu', class: 'bg-purple-100 text-purple-800 border-purple-200' },
      'failed': { text: 'Échec', class: 'bg-red-100 text-red-800 border-red-200' },
      'archived': { text: 'Archivé', class: 'bg-gray-100 text-gray-800 border-gray-200' },
      'spam': { text: 'Spam', class: 'bg-red-100 text-red-800 border-red-200' }
    };
    const config = statusConfig[status] || statusConfig['pending'];
    return (
      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${config.class}`}>
        {config.text}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      'low': { text: 'Faible', class: 'bg-green-100 text-green-800 border-green-200' },
      'medium': { text: 'Moyenne', class: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      'high': { text: 'Élevée', class: 'bg-red-100 text-red-800 border-red-200' },
      'urgent': { text: 'Urgente', class: 'bg-red-100 text-red-800 border-red-200' }
    };
    const config = priorityConfig[priority] || priorityConfig['medium'];
    return (
      <span className={`inline-block px-2 py-1 rounded-full text-xs border ${config.class}`}>
        {config.text}
      </span>
    );
  };

  const getTypeBadge = (type) => {
    const typeConfig = {
      'support': { text: 'Support', class: 'bg-blue-100 text-blue-800 border-blue-200' },
      'inquiry': { text: 'Demande', class: 'bg-green-100 text-green-800 border-green-200' },
      'complaint': { text: 'Réclamation', class: 'bg-red-100 text-red-800 border-red-200' },
      'feedback': { text: 'Retour', class: 'bg-purple-100 text-purple-800 border-purple-200' },
      'general': { text: 'Général', class: 'bg-gray-100 text-gray-800 border-gray-200' }
    };
    const config = typeConfig[type] || typeConfig['general'];
    return (
      <span className={`inline-block px-2 py-1 rounded-full text-xs border ${config.class}`}>
        {config.text}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('fr-FR');
  };

  const getStats = () => {
    const total = messages.length;
    const unread = messages.filter(m => !m.isRead).length;
    const pending = messages.filter(m => m.status === 'pending').length;
    const archived = messages.filter(m => m.status === 'archived').length;
    const spam = messages.filter(m => m.status === 'spam').length;
    const highPriority = messages.filter(m => m.priority === 'high' || m.priority === 'urgent').length;
    const today = messages.filter(m => {
      const today = new Date();
      const messageDate = new Date(m.createdAt);
      return messageDate.toDateString() === today.toDateString();
    }).length;
    
    return { 
      total, 
      unread, 
      pending, 
      archived, 
      spam, 
      highPriority, 
      today 
    };
  };

  const stats = getStats();

  return (
    <div className="bg-white p-6 rounded-xl shadow text-gray-900">
      {/* En-tête avec statistiques */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#AD7C59] flex items-center gap-2">
          <FontAwesomeIcon icon={faEnvelope} className="text-[#AD7C59]" /> Gestion des Messages
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => exportToCSV(filteredAndSortedMessages)}
            className="flex items-center gap-2 px-4 py-2 rounded border border-[#AD7C59] text-[#AD7C59] hover:bg-[#AD7C59] hover:text-white transition"
          >
            <FontAwesomeIcon icon={faDownload} /> Exporter CSV
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
          <div className="flex items-center gap-3">
            <FontAwesomeIcon icon={faInbox} className="text-2xl text-blue-600" />
            <div>
              <p className="text-sm text-blue-600 font-medium">Total messages</p>
              <p className="text-2xl font-bold text-blue-800">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
          <div className="flex items-center gap-3">
            <FontAwesomeIcon icon={faClock} className="text-2xl text-yellow-600" />
            <div>
              <p className="text-sm text-yellow-600 font-medium">Non lus</p>
              <p className="text-2xl font-bold text-yellow-800">{stats.unread}</p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-xl border border-green-200">
          <div className="flex items-center gap-3">
            <FontAwesomeIcon icon={faCheck} className="text-2xl text-green-600" />
            <div>
              <p className="text-sm text-green-600 font-medium">Aujourd'hui</p>
              <p className="text-2xl font-bold text-green-800">{stats.today}</p>
            </div>
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
          <div className="flex items-center gap-3">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-2xl text-purple-600" />
            <div>
              <p className="text-sm text-purple-600 font-medium">Haute priorité</p>
              <p className="text-2xl font-bold text-purple-800">{stats.highPriority}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions en masse */}
      {selectedMessages.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-blue-800 font-medium">
                {selectedMessages.length} message(s) sélectionné(s)
              </span>
              <select
                value={bulkAction}
                onChange={(e) => setBulkAction(e.target.value)}
                className="px-3 py-2 border border-blue-300 rounded-lg text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choisir une action</option>
                <option value="read">Marquer comme lu</option>
                <option value="unread">Marquer comme non lu</option>
                <option value="archive">Archiver</option>
                <option value="spam">Marquer comme spam</option>
                <option value="delete">Supprimer</option>
              </select>
              <button
                onClick={handleBulkAction}
                disabled={!bulkAction || actionLoading.bulk}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {actionLoading.bulk ? 'Exécution...' : 'Exécuter'}
              </button>
            </div>
            <button
              onClick={() => setSelectedMessages([])}
              className="text-blue-600 hover:text-blue-800"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
        </div>
      )}

      {/* Filtres et recherche */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={handleSearch}
            className="w-full border border-[#AD7C59] rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[#AD7C59]"
            style={{ color: '#AD7C59' }}
          />
          <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-3 text-[#AD7C59]" />
        </div>
        
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-[#AD7C59] rounded-lg text-[#AD7C59] focus:outline-none focus:ring-2 focus:ring-[#AD7C59]"
        >
          <option value="all">Tous les statuts</option>
          <option value="pending">En attente</option>
          <option value="sent">Envoyés</option>
          <option value="delivered">Livrés</option>
          <option value="read">Lus</option>
          <option value="failed">Échecs</option>
          <option value="archived">Archivés</option>
          <option value="spam">Spam</option>
        </select>

        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="px-3 py-2 border border-[#AD7C59] rounded-lg text-[#AD7C59] focus:outline-none focus:ring-2 focus:ring-[#AD7C59]"
        >
          <option value="all">Toutes priorités</option>
          <option value="low">Faible</option>
          <option value="medium">Moyenne</option>
          <option value="high">Élevée</option>
          <option value="urgent">Urgente</option>
        </select>

        <select
          value={filterRead}
          onChange={(e) => setFilterRead(e.target.value)}
          className="px-3 py-2 border border-[#AD7C59] rounded-lg text-[#AD7C59] focus:outline-none focus:ring-2 focus:ring-[#AD7C59]"
        >
          <option value="all">Tous</option>
          <option value="read">Lus</option>
          <option value="unread">Non lus</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 border border-[#AD7C59] rounded-lg text-[#AD7C59] focus:outline-none focus:ring-2 focus:ring-[#AD7C59]"
        >
          <option value="date">Trier par date</option>
          <option value="priority">Trier par priorité</option>
          <option value="sender">Trier par expéditeur</option>
          <option value="subject">Trier par sujet</option>
          <option value="status">Trier par statut</option>
        </select>

        <button
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          className="flex items-center justify-center gap-2 px-3 py-2 border border-[#AD7C59] rounded-lg text-[#AD7C59] hover:bg-[#AD7C59] hover:text-white transition"
        >
          <FontAwesomeIcon icon={faSort} />
          {sortOrder === 'asc' ? 'Croissant' : 'Décroissant'}
        </button>
      </div>

      {/* Tableau des messages */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl">
          <thead>
            <tr className="text-left text-[#AD7C59]">
              <th className="py-2 px-4">
                <input
                  type="checkbox"
                  checked={selectedMessages.length === filteredAndSortedMessages.length && filteredAndSortedMessages.length > 0}
                  onChange={selectAllMessages}
                  className="rounded border-[#AD7C59] text-[#AD7C59] focus:ring-[#AD7C59]"
                />
              </th>
              <th className="py-2 px-4">Statut</th>
              <th className="py-2 px-4">Expéditeur</th>
              <th className="py-2 px-4">Destinataire</th>
              <th className="py-2 px-4">Sujet</th>
              <th className="py-2 px-4">Priorité</th>
              <th className="py-2 px-4">Type</th>
              <th className="py-2 px-4">Date</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="text-center py-8 text-[#AD7C59]">Chargement...</td>
              </tr>
            ) : filteredAndSortedMessages.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-8 text-[#AD7C59]">Aucun message trouvé.</td>
              </tr>
            ) : (
              filteredAndSortedMessages.map((message) => (
                <tr key={message.id} className={`border-b last:border-b-0 ${!message.isRead ? 'bg-blue-50' : ''}`}>
                  <td className="py-2 px-4">
                    <input
                      type="checkbox"
                      checked={selectedMessages.includes(message.id)}
                      onChange={() => toggleMessageSelection(message.id)}
                      className="rounded border-[#AD7C59] text-[#AD7C59] focus:ring-[#AD7C59]"
                    />
                  </td>
                  <td className="py-2 px-4">
                    <div className="flex flex-col gap-1">
                      {getStatusBadge(message.status)}
                      {!message.isRead && (
                        <span className="inline-block px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 border border-blue-200">
                          Non lu
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                        <FontAwesomeIcon icon={faUser} className="text-[#AD7C59]" />
                      </div>
                      <div>
                        <div className="font-semibold text-[#AD7C59]">{message.sender?.name}</div>
                        <div className="text-sm text-gray-500">{message.sender?.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                        <FontAwesomeIcon icon={faUser} className="text-[#AD7C59]" />
                      </div>
                      <div>
                        <div className="font-semibold text-[#AD7C59]">{message.recipient?.name}</div>
                        <div className="text-sm text-gray-500">{message.recipient?.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    <div className="max-w-xs">
                      <p className="font-medium text-gray-800 line-clamp-2">
                        {message.subject || 'Sans sujet'}
                      </p>
                      {message.content && message.content.length > 100 && (
                        <button
                          onClick={() => handleDetail(message)}
                          className="text-xs text-[#AD7C59] hover:underline mt-1"
                        >
                          Voir plus...
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    {getPriorityBadge(message.priority)}
                  </td>
                  <td className="py-2 px-4">
                    {getTypeBadge(message.type)}
                  </td>
                  <td className="py-2 px-4">
                    <div className="text-sm">
                      <div className="font-medium">{formatDate(message.createdAt)}</div>
                      <div className="text-xs text-gray-500">{formatDateTime(message.createdAt)}</div>
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    <div className="flex flex-wrap gap-1">
                      <button
                        className="px-2 py-1 rounded border border-[#AD7C59] text-[#AD7C59] hover:bg-[#AD7C59] hover:text-white transition text-xs"
                        onClick={() => handleDetail(message)}
                        title="Voir le détail"
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      <button
                        className="px-2 py-1 rounded border border-[#AD7C59] text-[#AD7C59] hover:bg-[#AD7C59] hover:text-white transition text-xs"
                        onClick={() => handleEdit(message)}
                        title="Modifier"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      
                      {/* Actions selon le statut */}
                      {!message.isRead ? (
                        <button
                          className="px-2 py-1 rounded border border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition text-xs"
                          onClick={() => handleMarkAsRead(message.id)}
                          disabled={actionLoading[message.id]}
                          title="Marquer comme lu"
                        >
                          <FontAwesomeIcon icon={faCheck} />
                        </button>
                      ) : (
                        <button
                          className="px-2 py-1 rounded border border-yellow-600 text-yellow-600 hover:bg-yellow-600 hover:text-white transition text-xs"
                          onClick={() => handleMarkAsUnread(message.id)}
                          disabled={actionLoading[message.id]}
                          title="Marquer comme non lu"
                        >
                          <FontAwesomeIcon icon={faClock} />
                        </button>
                      )}

                      {message.status !== 'archived' ? (
                        <button
                          className="px-2 py-1 rounded border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition text-xs"
                          onClick={() => handleArchive(message.id)}
                          disabled={actionLoading[message.id]}
                          title="Archiver"
                        >
                          <FontAwesomeIcon icon={faArchive} />
                        </button>
                      ) : (
                        <button
                          className="px-2 py-1 rounded border border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition text-xs"
                          onClick={() => handleUnarchive(message.id)}
                          disabled={actionLoading[message.id]}
                          title="Désarchiver"
                        >
                          <FontAwesomeIcon icon={faInbox} />
                        </button>
                      )}

                      <button
                        className="px-2 py-1 rounded border border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white transition text-xs"
                        onClick={() => handleReply(message)}
                        title="Répondre"
                      >
                        <FontAwesomeIcon icon={faReply} />
                      </button>

                      <button
                        className="px-2 py-1 rounded border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white transition text-xs"
                        onClick={() => handleForward(message)}
                        title="Transférer"
                      >
                        <FontAwesomeIcon icon={faPaperPlane} />
                      </button>

                      <button
                        className="px-2 py-1 rounded border border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white transition text-xs"
                        onClick={() => handleFlag(message)}
                        title="Signaler"
                      >
                        <FontAwesomeIcon icon={faFlag} />
                      </button>

                      <button
                        className="px-2 py-1 rounded border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition text-xs"
                        onClick={() => handleMarkAsSpam(message.id)}
                        disabled={actionLoading[message.id]}
                        title="Marquer comme spam"
                      >
                        <FontAwesomeIcon icon={faExclamationTriangle} />
                      </button>

                      <button
                        className="px-2 py-1 rounded border border-[#AD7C59] text-[#AD7C59] hover:bg-[#AD7C59] hover:text-white transition text-xs"
                        onClick={() => handleDelete(message.id)}
                        disabled={actionLoading[message.id]}
                        title="Supprimer"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modals - Je vais les créer dans la suite */}
    </div>
  );
} 