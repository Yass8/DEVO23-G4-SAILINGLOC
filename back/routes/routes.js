import express from "express"

// import userRoutes from './user.routes.js'; // Fichier manquant
import userDocumentRoutes from './userDocument.routes.js';
import portRoutes from './port.routes.js';
// import boatTypeRoutes from './boatType.routes.js'; // Fichier manquant
import boatRoutes from './boat.routes.js';
import boatPhotoRoutes from './boatPhoto.routes.js';
import boatEquipmentRoutes from './boatEquipment.routes.js';
import availabilityRoutes from './availability.routes.js';
import reservationRoutes from './reservation.routes.js';
import paymentRoutes from './payment.routes.js';
import contractRoutes from './contract.routes.js';
import reviewRoutes from './review.routes.js';
import messageRoutes from './message.routes.js';
import authRoutes from './auth.routes.js';
import contactRoutes from './contact.routes.js';
import userRoutes from './user.routes.js';
import { isAuthenticated } from '../middlewares/auth/authorize.js';
const router = express.Router();

router.use('/users', isAuthenticated, userRoutes); // Route commentée car fichier manquant
router.use('/users-documents', isAuthenticated, userDocumentRoutes);
router.use('/ports', portRoutes);
// router.use('/boat-types', boatTypeRoutes); // Route commentée car fichier manquant
router.use('/boats', boatRoutes);
router.use('/boat-photos', boatPhotoRoutes);
router.use('/boat-equipments', boatEquipmentRoutes);
router.use('/availabilities', availabilityRoutes);
router.use('/reservations', reservationRoutes);
router.use('/payments', isAuthenticated, paymentRoutes);
router.use('/contracts', isAuthenticated, contractRoutes);
router.use('/reviews', reviewRoutes);
router.use('/messages', isAuthenticated, messageRoutes);
router.use('/auth', authRoutes);
router.use('/contact', contactRoutes);

router.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the SailingLoc API' });
});

export default router;