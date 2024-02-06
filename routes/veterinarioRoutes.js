import express from 'express';
import { autenticar, confirmar, perfil, registrar } from '../controllers/veterinarioController.js';
import checkAuth from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', registrar);
router.get('/confirmar/:token', confirmar);
router.post('/login', autenticar);

router.get('/perfil', checkAuth, perfil);
// router.get('/perfil', checkAuth, perfil);

export default router;
