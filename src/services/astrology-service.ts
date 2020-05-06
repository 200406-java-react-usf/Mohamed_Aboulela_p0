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
	
}
