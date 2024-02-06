import express from 'express';
import { autenticar, confirmar, perfil, registrar } from '../controllers/veterinarioController.js';

const router = express.Router();

router.post('/', registrar);

router.get('/perfil', perfil);

router.get('/confirmar/:token', confirmar);

router.post('/autenticar', autenticar);

export default router;