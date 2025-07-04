import express, { Router } from 'express';
import ColaboracaoController from '../controllers/ColaboracaoController';
import { requireAuth } from '../middleware/authMiddleware';

const router: Router = express.Router();

// Página pública - listar colaborações
router.get('/colaboracoes', ColaboracaoController.index);

// Páginas protegidas - formulário e envio
router.get('/colaborar', requireAuth, ColaboracaoController.showForm);
router.post('/colaborar', requireAuth, ColaboracaoController.store);

export default router;