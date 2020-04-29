import { User } from "../models/user";
import { UserRepository } from "../repos/user-repo";
import { isValidId, isValidStrings, isValidObject, isPropertyOf, isEmptyObject } from "../util/validator";
import { 
    BadRequestError, 
    ResourceNotFoundError, 
    NotImplementedError, 
    ResourcePersistenceError, 
    AuthenticationError 
} from "../errors/errors";


export class UserService {

    constructor(private userRepo: UserRepository) {
        this.userRepo = userRepo;
    }

    getAllUsers(): Promise<User[]> {

        return new Promise<User[]>(async (resolve, reject) => {

            let users: User[] = [];
            let result = await this.userRepo.getAll();

            for (let user of result) {
                users.push({...user});
            }

            if (users.length == 0) {
                reject(new ResourceNotFoundError());
                return;
            }

            resolve(users.map(this.removePassword));

        });

    }

    getUserById(id: number): Promise<User> {

        return new Promise<User>(async (resolve, reject) => {

            if (!isValidId(id)) {
                return reject(new BadRequestError());
            }

            let user = {...await this.userRepo.getById(id)};

            if (isEmptyObject(user)) {
                return reject(new ResourceNotFoundError());
            }

            resolve(this.removePassword(user));

        });

    }

    getUserByUniqueKey(queryObj: any): Promise<User> {

        return new Promise<User>(async (resolve, reject) => {

            // we need to wrap this up in a try/catch in case errors are thrown for our awaits
            try {

                let queryKeys = Object.keys(queryObj);

                if(!queryKeys.every(key => isPropertyOf(key, User))) {
                    return reject(new BadRequestError());
                }

                // we will only support single param searches (for now)
                let key = queryKeys[0];
                let val = queryObj[key];

                // if they are searching for a user by id, reuse the logic we already have
                if (key === 'id') {
                    return resolve(await this.getUserById(+val));
                }

                // ensure that the provided key value is valid
                if(!isValidStrings(val)) {
                    return reject(new BadRequestError());
                }

                let user = {...await this.userRepo.getUserByUniqueKey(key, val)};

                if (isEmptyObject(user)) {
                    return reject(new ResourceNotFoundError());
                }

                resolve(this.removePassword(user));

            } catch (e) {
                reject(e);
            }

        });
    }

    authenticateUser(un: string, pw: string): Promise<User> {

        return new Promise<User>(async (resolve, reject) => {

            if (!isValidStrings(un, pw)) {
                reject(new BadRequestError());
                return;
            }

            let authUser: User;
            try {
                authUser = await this.userRepo.getUserByCredentials(un, pw);
            } catch (e) {
                reject(e);
            }

            if (isEmptyObject(authUser)) {
                reject(new AuthenticationError('Bad credentials provided.'));
                return;
            }

            resolve(this.removePassword(authUser));

        });

    }

    addNewUser(newUser: User): Promise<User> {
        
        return new Promise<User>(async (resolve, reject) => {

            if (!isValidObject(newUser, 'id')) {
                reject(new BadRequestError('Invalid property values found in provided user.'));
                return;
            }

            let conflict = this.getUserByUniqueKey({username: newUser.username});
        
            if (conflict) {
                reject(new ResourcePersistenceError('The provided username is already taken.'));
                return;
            }
        
            conflict = this.getUserByUniqueKey({email: newUser.email});
    
            if (conflict) {
                reject(new ResourcePersistenceError('The provided email is already taken.'));
                return;
            }

            try {
                const persistedUser = await this.userRepo.save(newUser);
                resolve(this.removePassword(persistedUser));
            } catch (e) {
                reject(e);
            }

        });

    }

    updateUser(updatedUser: User): Promise<boolean> {
        
        return new Promise<boolean>(async (resolve, reject) => {

            if (!isValidObject(updatedUser)) {
                reject(new BadRequestError('Invalid user provided (invalid values found).'));
                return;
            }

            try {
                // let repo handle some of the other checking since we are still mocking db
                resolve(await this.userRepo.update(updatedUser));
            } catch (e) {
                reject(e);
            }

        });

    }

    deleteById(id: number): Promise<boolean> {
        
        return new Promise<boolean>(async (resolve, reject) => {
            reject(new NotImplementedError());
        });

    }

    private removePassword(user: User): User {
        if(!user || !user.password) return user;
        let usr = {...user};
        delete usr.password;
        return usr;   
    }

}