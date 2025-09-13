import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generateContractPDF = async (contract) => {
  try {
    // Créer un élément temporaire pour le contenu du PDF
    const pdfContent = document.createElement('div');
    pdfContent.style.position = 'absolute';
    pdfContent.style.left = '-9999px';
    pdfContent.style.top = '0';
    pdfContent.style.width = '800px';
    pdfContent.style.padding = '40px';
    pdfContent.style.backgroundColor = 'white';
    pdfContent.style.fontFamily = 'Arial, sans-serif';
    pdfContent.style.fontSize = '12px';
    pdfContent.style.lineHeight = '1.4';
    
    // Générer le contenu HTML du PDF
    pdfContent.innerHTML = `
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #AD7C59; padding-bottom: 20px;">
        <h1 style="color: #AD7C59; font-size: 28px; margin: 0;">SAILINGLOC</h1>
        <h2 style="color: #4B6A88; font-size: 20px; margin: 10px 0;">CONTRAT DE LOCATION</h2>
        <p style="color: #666; font-size: 14px; margin: 0;">Numéro: ${contract.contractNumber}</p>
      </div>

      <div style="margin-bottom: 25px;">
        <h3 style="color: #4B6A88; font-size: 16px; margin-bottom: 15px; border-bottom: 1px solid #87CEEB; padding-bottom: 5px;">
          INFORMATIONS DU CONTRAT
        </h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="width: 40%; padding: 8px 0; color: #4B6A88;"><strong>Numéro de contrat:</strong></td>
            <td style="padding: 8px 0;">${contract.contractNumber}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #4B6A88;"><strong>Type:</strong></td>
            <td style="padding: 8px 0;">${getTypeText(contract.type)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #4B6A88;"><strong>Statut:</strong></td>
            <td style="padding: 8px 0;">${getStatusText(contract.status)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #4B6A88;"><strong>Date de création:</strong></td>
            <td style="padding: 8px 0;">${formatDate(contract.createdAt)}</td>
          </tr>
        </table>
      </div>

      <div style="margin-bottom: 25px;">
        <h3 style="color: #4B6A88; font-size: 16px; margin-bottom: 15px; border-bottom: 1px solid #87CEEB; padding-bottom: 5px;">
          INFORMATIONS CLIENT
        </h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="width: 40%; padding: 8px 0; color: #4B6A88;"><strong>Nom:</strong></td>
            <td style="padding: 8px 0;">${contract.clientName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #4B6A88;"><strong>Email:</strong></td>
            <td style="padding: 8px 0;">${contract.clientEmail}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #4B6A88;"><strong>Téléphone:</strong></td>
            <td style="padding: 8px 0;">${contract.clientPhone || 'Non renseigné'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #4B6A88;"><strong>Adresse:</strong></td>
            <td style="padding: 8px 0;">${contract.clientAddress || 'Non renseignée'}</td>
          </tr>
        </table>
      </div>

      <div style="margin-bottom: 25px;">
        <h3 style="color: #4B6A88; font-size: 16px; margin-bottom: 15px; border-bottom: 1px solid #87CEEB; padding-bottom: 5px;">
          INFORMATIONS BATEAU
        </h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="width: 40%; padding: 8px 0; color: #4B6A88;"><strong>Nom:</strong></td>
            <td style="padding: 8px 0;">${contract.boatName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #4B6A88;"><strong>Propriétaire:</strong></td>
            <td style="padding: 8px 0;">${contract.boatOwner}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #4B6A88;"><strong>Port:</strong></td>
            <td style="padding: 8px 0;">${contract.port}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #4B6A88;"><strong>Type:</strong></td>
            <td style="padding: 8px 0;">${contract.boatType || 'Non spécifié'}</td>
          </tr>
        </table>
      </div>

      <div style="margin-bottom: 25px;">
        <h3 style="color: #4B6A88; font-size: 16px; margin-bottom: 15px; border-bottom: 1px solid #87CEEB; padding-bottom: 5px;">
          PÉRIODE DE LOCATION
        </h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="width: 40%; padding: 8px 0; color: #4B6A88;"><strong>Date de début:</strong></td>
            <td style="padding: 8px 0;">${formatDate(contract.startDate)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #4B6A88;"><strong>Date de fin:</strong></td>
            <td style="padding: 8px 0;">${formatDate(contract.endDate)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #4B6A88;"><strong>Durée:</strong></td>
            <td style="padding: 8px 0;">${Math.ceil((new Date(contract.endDate) - new Date(contract.startDate)) / (1000 * 60 * 60 * 24))} jours</td>
          </tr>
        </table>
      </div>

      <div style="margin-bottom: 25px;">
        <h3 style="color: #4B6A88; font-size: 16px; margin-bottom: 15px; border-bottom: 1px solid #87CEEB; padding-bottom: 5px;">
          INFORMATIONS FINANCIÈRES
        </h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="width: 40%; padding: 8px 0; color: #4B6A88;"><strong>Montant total:</strong></td>
            <td style="padding: 8px 0; color: #AD7C59; font-size: 16px; font-weight: bold;">${formatCurrency(contract.totalAmount)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #4B6A88;"><strong>Caution:</strong></td>
            <td style="padding: 8px 0;">${formatCurrency(contract.deposit)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #4B6A88;"><strong>Commission:</strong></td>
            <td style="padding: 8px 0;">${formatCurrency(contract.commission || 0)}</td>
          </tr>
        </table>
      </div>

      ${contract.specialConditions ? `
        <div style="margin-bottom: 25px;">
          <h3 style="color: #4B6A88; font-size: 16px; margin-bottom: 15px; border-bottom: 1px solid #87CEEB; padding-bottom: 5px;">
            CONDITIONS SPÉCIALES
          </h3>
          <p style="padding: 10px; background-color: #f8f9fa; border-left: 4px solid #87CEEB; margin: 0;">
            ${contract.specialConditions}
          </p>
        </div>
      ` : ''}

      <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #AD7C59; text-align: center;">
        <p style="color: #666; font-size: 12px; margin: 0;">
          Document généré automatiquement par SailingLoc<br>
          Date de génération: ${new Date().toLocaleDateString('fr-FR')}
        </p>
      </div>
    `;

    // Ajouter le contenu au DOM temporairement
    document.body.appendChild(pdfContent);

    // Capturer le contenu avec html2canvas
    const canvas = await html2canvas(pdfContent, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });

    // Supprimer l'élément temporaire
    document.body.removeChild(pdfContent);

    // Créer le PDF avec jsPDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pdfWidth - 20; // Marge de 10mm de chaque côté
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Ajouter l'image au PDF
    pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);

    // Si le contenu dépasse une page, ajouter des pages supplémentaires
    let heightLeft = imgHeight;
    let position = 10;

    while (heightLeft >= pdfHeight) {
      position = heightLeft - pdfHeight + 10;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 10, -position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    // Télécharger le PDF
    const fileName = `contrat_${contract.contractNumber}_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);

    return { success: true, fileName };
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    return { success: false, error: error.message };
  }
};

// Fonctions utilitaires
const getTypeText = (type) => {
  const typeMap = {
    rental: 'Location',
    purchase: 'Achat',
    maintenance: 'Maintenance',
    insurance: 'Assurance'
  };
  return typeMap[type] || type;
};

const getStatusText = (status) => {
  const statusMap = {
    draft: 'Brouillon',
    pending: 'En attente',
    active: 'Actif',
    completed: 'Terminé',
    cancelled: 'Annulé',
    expired: 'Expiré'
  };
  return statusMap[status] || status;
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
}; 