import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    res.send('desde api vet')
});

router.get('/login', (req, res) => {
    res.send('desde api vet LOGIN')
});

export default router;