import html2pdf from 'html2pdf.js/dist/html2pdf.min.js';

export const generateContractPdf = async (reservation, reference) => {
  const source = document.getElementById('contract-template');
  if (!source) throw new Error('Template non trouvé dans le DOM');

  // injection rapide (data-attribute)
  source.dataset.reference = reference ?? '';

  const opt = {
    margin:       10,
    filename:     'contrat.pdf',
    html2canvas:  { scale: 2, useCORS: true },
    jsPDF:        { unit: 'mm', format: 'a4' }
  };

  return html2pdf().set(opt).from(source).outputPdf('blob');
};