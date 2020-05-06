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

AstrologyRouter.post('', async (req, resp) => {
    try {
        let newAstrology = await astrologyService.addNewSign(req.body);
        return resp.status(201).json(newAstrology);
    } catch (e) {
        return resp.status(e.statusCode || 500).json(e);
    }
})

AstrologyRouter.put('', async (req,resp) => {
    try {
        let updatedAstrology = await astrologyService.updateSign(req.body);
        return resp.status(202).json(updatedAstrology);
    } catch (e) {
        return resp.status(e.statusCode || 500).json(e);
    }
})

AstrologyRouter.delete('', adminGuard, async (req, resp) => {
    try {
        let signToBeDeleted = await astrologyService.deleteSign(req.body);
        return resp.status(202).json(signToBeDeleted);
    } catch (e) {
        return resp.status(e.statusCode || 500).json(e);
    }
})