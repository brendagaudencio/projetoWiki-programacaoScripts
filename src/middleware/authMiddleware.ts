import { Request, Response, NextFunction } from 'express';
import db from '../models';

const { User } = db;

interface AuthenticatedRequest extends Request {
  user?: any;
}

const requireAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    if (!req.session || !(req.session as any).userId) {
        res.redirect('/auth/login');
        return;
    }

    try {
        const user = await User.findByPk((req.session as any).userId);
        
        if (!user) {
            req.session.destroy((err: any) => {
                if (err) console.error('Erro ao destruir sessão:', err);
            });
            res.redirect('/auth/login');
            return;
        }
        
        req.user = user;
        next();
    } catch (error) {
        console.error('Erro no middleware de autenticação:', error);
        res.redirect('/auth/login');
    }
};

const redirectIfLoggedIn = (req: Request, res: Response, next: NextFunction): void => {
    if (req.session && (req.session as any).userId) {
        res.redirect('/');
        return;
    }
    next();
};

export {
    requireAuth,
    redirectIfLoggedIn
};