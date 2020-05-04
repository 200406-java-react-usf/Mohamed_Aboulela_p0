import express from 'express';
import { Astrology } from '../models/astrology';
import AppConfig from '../config/app';

export const AstrologyRouter = express.Router();

const astrologyService = AppConfig.astrologyService;

// AstrologyRouter.get('/', async (req, resp) => {
//     try {
//         let payload = await astrologyService.getAll();
//         return resp.status(200).json(payload);
//     } catch (e) {
//         return resp.status(404).json(e).send();
//     }
// });

// AstrologyRouter.get('/:id', async (req, resp) => {
//     const id = +req.params.id; // the plus sign is to type coerce id into a number
//     try {
//         let payload = await astrologyService.getById(id);
//         return resp.status(200).json(payload);
//     } catch (e) {
//         return resp.status(404).json(e).send();
//     }
// });