import express from 'express';
import { Astrology } from '../models/astrology';
import AppConfig from '../config/app';
import { adminGuard } from '../middleware/auth-middleware';

export const AstrologyRouter = express.Router();

const astrologyService = AppConfig.astrologyService;

AstrologyRouter.get('', adminGuard, async (req, resp) => {
    try{
        let payload = await astrologyService.getAllSigns();
        resp.status(200).json(payload);
    } catch (e){
        resp.status(404).json(e);
    }
});

AstrologyRouter.get('/:id', async (req, resp) => {
    const id = +req.params.id; // the plus sign is to type coerce id into a number
    try {
        let payload = await astrologyService.getSignById(id);
        return resp.status(200).json(payload);
    } catch (e) {
        return resp.status(404).json(e).send();
    }
});
