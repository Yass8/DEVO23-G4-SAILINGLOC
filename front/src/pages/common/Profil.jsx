import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '../../services/authService';
import ProfileInfo from '../../components/client/ProfileInfo';
import PasswordChange from '../../components/client/PasswordChange';
import { changePassword } from '../../services/authService';
import { updateUser, uploadUserPhoto } from '../../services/userServices';

const Profil = () => {
  const [userData, setUserData] = useState(getCurrentUser());
  const [showEditForm, setShowEditForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [serverErrors, setServerErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const api_base_url = import.meta.env.VITE_API_BASE_URL
  
  const buildImageUrl = (path) => `${api_base_url}${path}`;

  useEffect(() => {
    setUserData(getCurrentUser());
  }, []);

  const handleSaveProfile = async (updatedData) => {
    setLoading(true);
    try {
      // Vérifier si une nouvelle photo a été uploadée
      let photoUrl = userData.photo;
      
      if (updatedData.photo instanceof File) {
        // Upload de la photo séparément
        const formData = new FormData();
        formData.append('photo', updatedData.photo);
        const uploadResponse = await uploadUserPhoto(userData.id, formData);
        photoUrl = uploadResponse.photo; // Adaptez selon la réponse de votre API
      }

      // Préparer les données pour la mise à jour (sans la photo qui est déjà uploadée)
      const { photo, ...dataToUpdate } = updatedData;
      const finalData = {
        ...dataToUpdate,
        photo: photoUrl
      };

      // Mettre à jour les autres informations utilisateur
      const updatedUser = await updateUser(userData.id, finalData);
      
      // Mettre à jour le localStorage avec les nouvelles données
      const currentUser = getCurrentUser();
      const newUserData = { ...currentUser, ...updatedUser };
      localStorage.setItem('user', JSON.stringify(newUserData));
      
      setUserData(newUserData);
      setShowEditForm(false);
      setMessage({ type: 'success', text: 'Profil mis à jour avec succès' });
      
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      console.error('Erreur mise à jour profil:', err);
      
      if (err.response?.data?.errors) {
        setServerErrors(err.response.data.errors);
        setMessage({ 
          type: 'error', 
          text: 'Veuillez corriger les erreurs ci-dessous' 
        });
      } else {
        setMessage({ 
          type: 'error', 
          text: err.message || 'Erreur lors de la mise à jour du profil' 
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSavePassword = async (passwordData) => {
    try {
      setServerErrors([]);
      await changePassword(passwordData);
      setMessage({ type: 'success', text: 'Mot de passe modifié avec succès' });
      setShowPasswordForm(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      console.error('Erreur changement mot de passe:', err);
      
      if (err.response?.data?.errors) {
        setServerErrors(err.response.data.errors);
        setMessage({ 
          type: 'error', 
          text: 'Veuillez corriger les erreurs ci-dessous' 
        });
      } else if (err.response?.data) {
        setServerErrors([{ message: err.response.data.message || 'Erreur de validation' }]);
        setMessage({ 
          type: 'error', 
          text: 'Erreur de validation' 
        });
      } else {
        setMessage({ 
          type: 'error', 
          text: err.message || 'Erreur lors du changement de mot de passe' 
        });
      }
    }
  };

  const renderAvatar = () => {
    if (userData.photo) {
      return (
        <img
          src={buildImageUrl(userData.photo)}
          alt="Avatar"
          className="w-24 h-24 rounded-full object-cover border-2 border-mocha"
        />
      );
    }
    return (
      <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-white text-xl">
        {userData.firstname?.[0]}
        {userData.lastname?.[0]}
      </div>
    );
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Mon Profil</h2>

      {/* Messages de succès/erreur généraux */}
      {message.text && (
        <div className={`mb-4 p-3 rounded ${
          message.type === 'success' 
            ? 'bg-green-100 text-green-700 border border-green-300' 
            : 'bg-red-100 text-red-700 border border-red-300'
        }`}>
          {message.text}
        </div>
      )}

      {showEditForm ? (
        <ProfileInfo 
          userData={userData} 
          onSave={handleSaveProfile} 
          onCancel={() => {
            setShowEditForm(false);
            setServerErrors([]);
            setMessage({ type: '', text: '' });
          }}
          loading={loading}
          serverErrors={serverErrors}
        />
      ) : (
        <div>
          <div className="flex items-center gap-4 mb-6">
            {renderAvatar()}
            <div>
              <h3 className="text-xl font-semibold">
                {userData.firstname} {userData.lastname}
              </h3>
              <p className="text-gray-600">{userData.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500">Téléphone</p>
              <p>{userData.phone || 'Non renseigné'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Adresse</p>
              <p>{userData.address || 'Non renseignée'}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowEditForm(true)}
              className="bg-mocha text-white px-4 py-2 rounded hover:bg-mocha-dark transition"
            >
              Modifier mon profil
            </button>
            <button
              onClick={() => {
                setShowPasswordForm(!showPasswordForm);
                setMessage({ type: '', text: '' });
                setServerErrors([]);
              }}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition"
            >
              {showPasswordForm ? 'Annuler' : 'Modifier mon mot de passe'}
            </button>
          </div>
        </div>
      )}

      {showPasswordForm && (
        <div className="mt-6 border-t pt-4">
          <h3 className="text-lg font-semibold mb-4">Modifier le mot de passe</h3>
          
          {serverErrors.length > 0 && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
              <h4 className="text-red-800 font-semibold mb-2">Erreurs de validation :</h4>
              <ul className="list-disc list-inside space-y-1">
                {serverErrors.map((error, index) => (
                  <li key={index} className="text-red-600 text-sm">
                    {error.message}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <PasswordChange 
            onSave={handleSavePassword} 
            onCancel={() => {
              setShowPasswordForm(false);
              setMessage({ type: '', text: '' });
              setServerErrors([]);
            }}
            serverErrors={serverErrors}
            email={userData.email}
          />
        </div>
      )}
    </div>
  );
};

export default Profil;