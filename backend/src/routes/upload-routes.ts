import { Router } from 'express';
import { requireAuth } from '@/middleware/auth';
import { articleUpload } from '@/middleware/upload';
import { uploadArticleImage, deleteArticleImage } from '@/controllers/upload-controller';

const router = Router();

// Upload article image
router.post('/article-image', requireAuth, articleUpload.single('image'), uploadArticleImage);

// Delete article image
router.delete('/article-image', requireAuth, deleteArticleImage);

export default router;
