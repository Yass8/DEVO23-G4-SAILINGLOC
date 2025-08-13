import path from 'path';
import fs from 'fs';

class UploadFile {

  uniqid(prefix = '', size = 4) {
    const ramdomPart = Math.random().toString(36).substring(2, size + 2);
    const timestamp = Date.now().toString(36);
    return `${prefix}-${ramdomPart}-${timestamp}`;
  }

  async saveFile(prefix = '', fileBuffer, originalName, destination, extensions = [], maxMo = 4) {
    const ext = path.extname(originalName).toLowerCase();

    if (extensions.length && !extensions.includes(ext)) {
      throw new Error(`Extension non autorisée. Autorisées : ${extensions.join(', ')}`);
    }

    const maxBytes = maxMo * 1024 * 1024;
    if (fileBuffer.length > maxBytes) {
      throw new Error(`Le fichier est trop volumineux. Taille maximale autorisée : ${maxMo} Mo`);
    }

    const baseDir = path.join(process.cwd(), 'uploads');// dossier racine des uploads

    const fullDir = path.join(baseDir, destination);

    await fs.promises.mkdir(fullDir, { recursive: true });

    const fileName = `${this.uniqid(prefix)}${ext}`;
    const filePath = path.join(fullDir, fileName);

    await fs.promises.writeFile(filePath, fileBuffer);

    return path.join('/uploads', destination, fileName).replace(/\\/g, '/'); // retourne le chemin relatif avec des slashes pour les URLs

  }
}

export default new UploadFile();