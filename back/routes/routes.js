import express from "express"

import userRoutes from './user.routes.js';
import userDocumentRoutes from './userDocument.routes.js';
import portRoutes from './port.routes.js';
import boatTypeRoutes from './boatType.routes.js';
import boatRoutes from './boat.routes.js';
import boatPhotoRoutes from './boatPhoto.routes.js';
import boatEquipmentRoutes from './boatEquipment.routes.js';
import availabilityRoutes from './availability.routes.js';
import reservationRoutes from './reservation.routes.js';
import paymentRoutes from './payment.routes.js';
import contractRoutes from './contract.routes.js';
import reviewRoutes from './review.routes.js';
import messageRoutes from './message.routes.js';


const router = express.Router();


router.use('/users', userRoutes);
router.use('/users-documents', userDocumentRoutes);
router.use('/ports', portRoutes);
router.use('/boat-types', boatTypeRoutes);
router.use('/boats', boatRoutes);
router.use('/boat-photos', boatPhotoRoutes);
router.use('/boat-equipments', boatEquipmentRoutes);
router.use('/availabilities', availabilityRoutes);
router.use('/reservations', reservationRoutes);
router.use('/payments', paymentRoutes);
router.use('/contracts', contractRoutes);
router.use('/reviews', reviewRoutes);
router.use('/messages', messageRoutes);



export default router;