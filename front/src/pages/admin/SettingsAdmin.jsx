import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCog,
  faSave,
  faUndo,
  faCheck,
  faTimes,
  faExclamationTriangle,
  faUser,
  faShieldAlt,
  faCreditCard,
  faEnvelope,
  faServer,
  faSpinner,
  faRefresh
} from '@fortawesome/free-solid-svg-icons';

const SettingsAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    general: {
      siteName: 'SailingLoc',
      siteDescription: 'Location de bateaux entre particuliers',
      siteUrl: 'https://sailingloc.com',
      contactEmail: 'contact@sailingloc.com',
      contactPhone: '+33 1 23 45 67 89',
      address: '123 Rue de la Mer, 75001 Paris, France',
      timezone: 'Europe/Paris',
      language: 'fr',
      currency: 'EUR'
    },
    security: {
      passwordMinLength: 8,
      requireSpecialChars: true,
      requireNumbers: true,
      requireUppercase: true,
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      twoFactorAuth: false,
      sslRequired: true
    },
    email: {
      smtpHost: 'smtp.gmail.com',
      smtpPort: 587,
      smtpUser: 'noreply@sailingloc.com',
      smtpPassword: '********',
      smtpSecure: true,
      fromName: 'SailingLoc',
      fromEmail: 'noreply@sailingloc.com'
    },
    payment: {
      stripeEnabled: true,
      stripePublicKey: 'pk_test_...',
      stripeSecretKey: 'sk_test_...',
      paypalEnabled: false,
      commissionRate: 15,
      minReservationAmount: 50,
      maxReservationAmount: 10000
    },
    system: {
      maintenanceMode: false,
      debugMode: false,
      backupFrequency: 'daily',
      backupRetention: 30,
      maxUploadSize: 10,
      imageCompression: true,
      cacheEnabled: true
    }
  });

  const [originalSettings, setOriginalSettings] = useState({});

  useEffect(() => {
    // Simuler le chargement des paramètres
    setLoading(true);
    setTimeout(() => {
      setOriginalSettings(JSON.parse(JSON.stringify(settings)));
      setLoading(false);
    }, 1000);
  }, []);

  const handleSettingChange = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const handleSave = async (section) => {
    setSaving(true);
    try {
      // Simuler la sauvegarde
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOriginalSettings(prev => ({
        ...prev,
        [section]: { ...settings[section] }
      }));
      alert(`${section} sauvegardé avec succès !`);
    } catch (error) {
      alert('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = (section) => {
    if (window.confirm(`Êtes-vous sûr de vouloir réinitialiser les paramètres ${section} ?`)) {
      setSettings(prev => ({
        ...prev,
        [section]: { ...originalSettings[section] }
      }));
    }
  };

  const hasChanges = (section) => {
    return JSON.stringify(settings[section]) !== JSON.stringify(originalSettings[section]);
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nom du site
          </label>
          <input
            type="text"
            value={settings.general.siteName}
            onChange={(e) => handleSettingChange('general', 'siteName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#AD7C59] focus:border-[#AD7C59]"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description du site
          </label>
          <input
            type="text"
            value={settings.general.siteDescription}
            onChange={(e) => handleSettingChange('general', 'siteDescription', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#AD7C59] focus:border-[#AD7C59]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL du site
          </label>
          <input
            type="url"
            value={settings.general.siteUrl}
            onChange={(e) => handleSettingChange('general', 'siteUrl', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#AD7C59] focus:border-[#AD7C59]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email de contact
          </label>
          <input
            type="email"
            value={settings.general.contactEmail}
            onChange={(e) => handleSettingChange('general', 'contactEmail', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#AD7C59] focus:border-[#AD7C59]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Téléphone de contact
          </label>
          <input
            type="tel"
            value={settings.general.contactPhone}
            onChange={(e) => handleSettingChange('general', 'contactPhone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#AD7C59] focus:border-[#AD7C59]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Adresse
          </label>
          <input
            type="text"
            value={settings.general.address}
            onChange={(e) => handleSettingChange('general', 'address', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#AD7C59] focus:border-[#AD7C59]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fuseau horaire
          </label>
          <select
            value={settings.general.timezone}
            onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#AD7C59] focus:border-[#AD7C59]"
          >
            <option value="Europe/Paris">Europe/Paris</option>
            <option value="Europe/London">Europe/London</option>
            <option value="America/New_York">America/New_York</option>
            <option value="Asia/Tokyo">Asia/Tokyo</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Langue
          </label>
          <select
            value={settings.general.language}
            onChange={(e) => handleSettingChange('general', 'language', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#AD7C59] focus:border-[#AD7C59]"
          >
            <option value="fr">Français</option>
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="de">Deutsch</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Longueur minimale du mot de passe
          </label>
          <input
            type="number"
            min="6"
            max="20"
            value={settings.security.passwordMinLength}
            onChange={(e) => handleSettingChange('security', 'passwordMinLength', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#AD7C59] focus:border-[#AD7C59]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Timeout de session (minutes)
          </label>
          <input
            type="number"
            min="5"
            max="1440"
            value={settings.security.sessionTimeout}
            onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#AD7C59] focus:border-[#AD7C59]"
          />
        </div>

        <div className="col-span-2">
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={settings.security.requireSpecialChars}
                onChange={(e) => handleSettingChange('security', 'requireSpecialChars', e.target.checked)}
                className="rounded border-gray-300 text-[#AD7C59] focus:ring-[#AD7C59]"
              />
              <label className="ml-2 text-sm text-gray-700">
                Exiger des caractères spéciaux
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={settings.security.requireNumbers}
                onChange={(e) => handleSettingChange('security', 'requireNumbers', e.target.checked)}
                className="rounded border-gray-300 text-[#AD7C59] focus:ring-[#AD7C59]"
              />
              <label className="ml-2 text-sm text-gray-700">
                Exiger des chiffres
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={settings.security.requireUppercase}
                onChange={(e) => handleSettingChange('security', 'requireUppercase', e.target.checked)}
                className="rounded border-gray-300 text-[#AD7C59] focus:ring-[#AD7C59]"
              />
              <label className="ml-2 text-sm text-gray-700">
                Exiger des majuscules
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={settings.security.twoFactorAuth}
                onChange={(e) => handleSettingChange('security', 'twoFactorAuth', e.target.checked)}
                className="rounded border-gray-300 text-[#AD7C59] focus:ring-[#AD7C59]"
              />
              <label className="ml-2 text-sm text-gray-700">
                Authentification à deux facteurs
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={settings.security.sslRequired}
                onChange={(e) => handleSettingChange('security', 'sslRequired', e.target.checked)}
                className="rounded border-gray-300 text-[#AD7C59] focus:ring-[#AD7C59]"
              />
              <label className="ml-2 text-sm text-gray-700">
                SSL requis
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEmailSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Serveur SMTP
          </label>
          <input
            type="text"
            value={settings.email.smtpHost}
            onChange={(e) => handleSettingChange('email', 'smtpHost', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#AD7C59] focus:border-[#AD7C59]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Port SMTP
          </label>
          <input
            type="number"
            value={settings.email.smtpPort}
            onChange={(e) => handleSettingChange('email', 'smtpPort', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#AD7C59] focus:border-[#AD7C59]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Utilisateur SMTP
          </label>
          <input
            type="text"
            value={settings.email.smtpUser}
            onChange={(e) => handleSettingChange('email', 'smtpUser', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#AD7C59] focus:border-[#AD7C59]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mot de passe SMTP
          </label>
          <input
            type="password"
            value={settings.email.smtpPassword}
            onChange={(e) => handleSettingChange('email', 'smtpPassword', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#AD7C59] focus:border-[#AD7C59]"
          />
        </div>

        <div className="col-span-2">
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={settings.email.smtpSecure}
                onChange={(e) => handleSettingChange('email', 'smtpSecure', e.target.checked)}
                className="rounded border-gray-300 text-[#AD7C59] focus:ring-[#AD7C59]"
              />
              <label className="ml-2 text-sm text-gray-700">
                Connexion sécurisée (TLS/SSL)
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPaymentSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Taux de commission (%)
          </label>
          <input
            type="number"
            min="0"
            max="50"
            step="0.1"
            value={settings.payment.commissionRate}
            onChange={(e) => handleSettingChange('payment', 'commissionRate', parseFloat(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#AD7C59] focus:border-[#AD7C59]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Montant minimum de réservation (€)
          </label>
          <input
            type="number"
            min="0"
            value={settings.payment.minReservationAmount}
            onChange={(e) => handleSettingChange('payment', 'minReservationAmount', parseFloat(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#AD7C59] focus:border-[#AD7C59]"
          />
        </div>

        <div className="col-span-2">
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={settings.payment.stripeEnabled}
                onChange={(e) => handleSettingChange('payment', 'stripeEnabled', e.target.checked)}
                className="rounded border-gray-300 text-[#AD7C59] focus:ring-[#AD7C59]"
              />
              <label className="ml-2 text-sm text-gray-700">
                Activer Stripe
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={settings.payment.paypalEnabled}
                onChange={(e) => handleSettingChange('payment', 'paypalEnabled', e.target.checked)}
                className="rounded border-gray-300 text-[#AD7C59] focus:ring-[#AD7C59]"
              />
              <label className="ml-2 text-sm text-gray-700">
                Activer PayPal
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fréquence de sauvegarde
          </label>
          <select
            value={settings.system.backupFrequency}
            onChange={(e) => handleSettingChange('system', 'backupFrequency', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#AD7C59] focus:border-[#AD7C59]"
          >
            <option value="hourly">Toutes les heures</option>
            <option value="daily">Quotidienne</option>
            <option value="weekly">Hebdomadaire</option>
            <option value="monthly">Mensuelle</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rétention des sauvegardes (jours)
          </label>
          <input
            type="number"
            min="1"
            max="365"
            value={settings.system.backupRetention}
            onChange={(e) => handleSettingChange('system', 'backupRetention', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#AD7C59] focus:border-[#AD7C59]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Taille maximale d'upload (MB)
          </label>
          <input
            type="number"
            min="1"
            max="100"
            value={settings.system.maxUploadSize}
            onChange={(e) => handleSettingChange('system', 'maxUploadSize', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#AD7C59] focus:border-[#AD7C59]"
          />
        </div>

        <div className="col-span-2">
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={settings.system.maintenanceMode}
                onChange={(e) => handleSettingChange('system', 'maintenanceMode', e.target.checked)}
                className="rounded border-gray-300 text-[#AD7C59] focus:ring-[#AD7C59]"
              />
              <label className="ml-2 text-sm text-gray-700">
                Mode maintenance
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={settings.system.debugMode}
                onChange={(e) => handleSettingChange('system', 'debugMode', e.target.checked)}
                className="rounded border-gray-300 text-[#AD7C59] focus:ring-[#AD7C59]"
              />
              <label className="ml-2 text-sm text-gray-700">
                Mode debug
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={settings.system.cacheEnabled}
                onChange={(e) => handleSettingChange('system', 'cacheEnabled', e.target.checked)}
                className="rounded border-gray-300 text-[#AD7C59] focus:ring-[#AD7C59]"
              />
              <label className="ml-2 text-sm text-gray-700">
                Cache activé
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={settings.system.imageCompression}
                onChange={(e) => handleSettingChange('system', 'imageCompression', e.target.checked)}
                className="rounded border-gray-300 text-[#AD7C59] focus:ring-[#AD7C59]"
              />
              <label className="ml-2 text-sm text-gray-700">
                Compression d'images
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'general', name: 'Général', icon: faCog, component: renderGeneralSettings },
    { id: 'security', name: 'Sécurité', icon: faShieldAlt, component: renderSecuritySettings },
    { id: 'email', name: 'Email', icon: faEnvelope, component: renderEmailSettings },
    { id: 'payment', name: 'Paiement', icon: faCreditCard, component: renderPaymentSettings },
    { id: 'system', name: 'Système', icon: faServer, component: renderSystemSettings }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FontAwesomeIcon icon={faSpinner} className="animate-spin text-4xl text-[#AD7C59]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configuration</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gérez les paramètres de votre application SailingLoc
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#AD7C59]"
          >
            <FontAwesomeIcon icon={faRefresh} className="w-4 h-4 mr-2" />
            Actualiser
          </button>
        </div>
      </div>

      {/* Navigation des onglets */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-[#AD7C59] text-[#AD7C59]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FontAwesomeIcon icon={tab.icon} className="w-4 h-4 mr-2" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Contenu des onglets */}
      <div className="bg-white p-6 rounded-lg shadow">
        {tabs.find(tab => tab.id === activeTab)?.component()}
        
        {/* Actions */}
        <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between">
          <button
            onClick={() => handleReset(activeTab)}
            disabled={!hasChanges(activeTab)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#AD7C59] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FontAwesomeIcon icon={faUndo} className="w-4 h-4 mr-2" />
            Réinitialiser
          </button>
          
          <button
            onClick={() => handleSave(activeTab)}
            disabled={!hasChanges(activeTab) || saving}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#AD7C59] hover:bg-[#9B6B47] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#AD7C59] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <FontAwesomeIcon icon={faSpinner} className="animate-spin w-4 h-4 mr-2" />
            ) : (
              <FontAwesomeIcon icon={faSave} className="w-4 h-4 mr-2" />
            )}
            {saving ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </div>
      </div>

      {/* Indicateur de modifications */}
      {Object.keys(settings).some(sectionId => hasChanges(sectionId)) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <FontAwesomeIcon icon={faExclamationTriangle} className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Modifications non sauvegardées
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  Vous avez des modifications non sauvegardées. N'oubliez pas de sauvegarder vos changements.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsAdmin; 