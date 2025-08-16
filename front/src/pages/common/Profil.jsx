import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '../../services/authService';
import ProfileInfo from '../../components/client/ProfileInfo';
import PasswordChange from '../../components/client/PasswordChange';
import { changePassword } from '../../services/authService';

const Profil = () => {
  const [userData, setUserData] = useState(getCurrentUser());
  const [showEditForm, setShowEditForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    setUserData(getCurrentUser());
  }, []);

  const handleSaveProfile = (updatedData) => {
    // Ici, ajoutez l'appel API pour sauvegarder les modifications
    setUserData(updatedData);
    setShowEditForm(false);
  };

  const handleSavePassword = async (passwordData) => {
    // Ici, ajoutez l'appel API pour changer le mot de passe
    try{
      await changePassword(passwordData);
    }catch(err){
      console.error(err);
    }
    console.log('Nouveau mot de passe:', passwordData);
    setShowPasswordForm(false);
  };

  const renderAvatar = () => {
    if (userData.photo) {
      return (
        <img
          src={userData.photo}
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

      {showEditForm ? (
        <ProfileInfo 
          userData={userData} 
          onSave={handleSaveProfile} 
          onCancel={() => setShowEditForm(false)} 
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
              onClick={() => setShowPasswordForm(!showPasswordForm)}
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
          <PasswordChange 
            onSave={handleSavePassword} 
            onCancel={() => setShowPasswordForm(false)} 
          />
        </div>
      )}
    </div>
  );
};

export default Profil;