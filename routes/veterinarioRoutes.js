import express from 'express';
import { confirmar, perfil, registrar } from '../controllers/veterinarioController.js';

const router = express.Router();

router.post('/', registrar);

router.get('/perfil', perfil);

router.get('/confirmar/:token', confirmar)

export default router;