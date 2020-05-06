import { Astrology } from '../models/astrology';
import { AstrologyRepository } from "../repos/astrology-repo";
import { ResourceNotFoundError, BadRequestError, ResourcePersistenceError } from '../errors/errors';
import { isValidId, isValidObject, isEmptyObject, isPropertyOf, isValidStrings } from '../util/validator';
import { AstrologySchema } from '../util/schemas';


export class AstrologyService {

    constructor(private astrologyRepo: AstrologyRepository) {
        this.astrologyRepo = astrologyRepo;
    }

    // TODO implement service methods

    async getAllSigns(): Promise<Astrology[]>{

		let signs = await this.astrologyRepo.getAll();

		if(signs.length == 0){
			throw new ResourceNotFoundError('No astrologys found in database');
		}

		return signs;

	}

	async getSignById(id: number): Promise<Astrology> {

		if(!isValidId(id)) {
			throw new BadRequestError('Invalid Id');
		}

		let astrology = await this.astrologyRepo.getById(id);

		if(!isValidObject(astrology)){
			throw new ResourceNotFoundError(`No astrology found with id: ${id}`);
		}

		return astrology;
	}

	async addNewSign(newAstrology: Astrology): Promise<Astrology> {

        if (!isValidObject(newAstrology)) {
            throw new BadRequestError();
        }

        let userExists = await this.checkUserExists(newAstrology.astrologyId);

        if (!userExists) {
            throw new ResourcePersistenceError('No username exists with User provided.')
        }
        
        const persistedAstrology = await this.astrologyRepo.save(newAstrology);

        return persistedAstrology;
    }

	async updateSign(updateAstrology: Astrology): Promise<boolean> {

		if (!isValidObject(updateAstrology)) {
			throw new BadRequestError('Invalid Sign');
		}

		await this.astrologyRepo.update(updateAstrology);

		return true;

	}

    async deleteSign(signToBeDeleted: Astrology): Promise<boolean> {

        if (!isValidObject(signToBeDeleted)) {
            throw new BadRequestError();
        }

        // will throw an error if no sign is found with provided id
        await this.getSignById(signToBeDeleted.id);

        await this.astrologyRepo.delete(signToBeDeleted);

        return true;
	}
	
	// async getAccountByUniqueKey(queryObj: any): Promise<Account> {

    //     try {

    //         let queryKeys = Object.keys(queryObj);

    //         if(!queryKeys.every(key => isPropertyOf(key, Account))) {
    //             throw new BadRequestError();
    //         }

    //         // only supports single param searches (for now)
    //         let key = queryKeys[0];
    //         let val = queryObj[key];

    //         // if they are searching for an account by id, reuse the logic we already have
    //         if (key === 'id') {
    //             return await this.getAccountById(+val);
    //         }

    //         // if(!isValidStrings(val)) {
    //         //     throw new BadRequestError();
    //         // }

    //         // have to change wording to work with db
    //         if (key === 'ownerId') {
    //             key = 'owner_id';
    //         }

    //         let account = await this.accountRepo.getAccountByUniqueKey(key, val);
    //         if (isEmptyObject(account)) {
    //             throw new ResourceNotFoundError();
    //         }
    //         return account;

    //     } catch (e) {
    //         throw e;
    //     }
    // }

	async checkUserExists(astrologyId: number): Promise<boolean> {
        
        let result = await this.astrologyRepo.checkUserExists(astrologyId);
        if (isEmptyObject(result)) {
            console.log(`No user found with id ${astrologyId}. Try again.`);
            return false;
        } else {
            console.log(`User exists with id ${astrologyId}. Proceed.`);
            return true;
        }
    }

}
