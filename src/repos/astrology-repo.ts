import data from '../data/astrology-db';
import { Astrology } from '../models/astrology';
import { CrudRepository } from './crud-repo';
import { 
    BadRequestError, 
    ResourceNotFoundError,
    ResourcePersistenceError,
    NotImplementedError
} from '../errors/errors';

export class AstrologyRepository implements CrudRepository<Astrology> {
    
    getAll(): Promise<Astrology[]> {

        return new Promise((resolve, reject)  => {

            setTimeout(() => {

                let signs: Astrology[] = [];

                for(let sign of data) {
                    signs.push({...sign});
                }

                if(signs.length === 0) {
                    reject(new ResourceNotFoundError());
                    return;
                }

                resolve(signs);

                
            }, 1000);

        });
    }

    getById(id: number): Promise<Astrology> {
    
        return new Promise<Astrology>((resolve, reject) => {
            if (typeof id !== 'number' || !Number.isInteger(id) || id <= 0) {
                reject(new BadRequestError());
                return;
            }

            setTimeout(function() {
        
                const sign: Astrology = {...data.filter(sign => sign.id === id).pop()};

                if(!sign) {
                    reject(new ResourceNotFoundError());
                    return;
                }

                resolve(sign);
                
            }, 250);

        });
    }

    save(newAstrology: Astrology): Promise<Astrology> {
        return new Promise<Astrology>((resolve, reject) => {
            reject(new NotImplementedError());
        });
    }

    update(updatedAstrology: Astrology): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            reject(new NotImplementedError());
        });
    }

    deleteById(id: number): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            reject(new NotImplementedError());
        });
    }

    getAstrologySignByAstrologyId(aid: number): Promise<Astrology[]> {
        return new Promise<Astrology[]>((resolve, reject) => {

            if (typeof aid !== 'number' || !Number.isInteger(aid) || aid <= 0) {
                reject(new BadRequestError());
                return;
            }

            setTimeout(function() {
                const signs = data.filter(sign => sign.astrologyId == aid);
                resolve(signs);
            }, 250);

        });
    }
}
