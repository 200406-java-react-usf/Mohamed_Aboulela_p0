import data from '../data/user-db';
import { User } from '../models/user';
import { CrudRepository } from './crud-repo';
import {
    NotImplementedError, 
    ResourceNotFoundError, 
    ResourcePersistenceError
} from '../errors/errors';

export class UserRepository implements CrudRepository<User> {

    getAll(): Promise<User[]> {

        return new Promise<User[]>((resolve) => {

            setTimeout(() => {
                let users: User[] = data;
                resolve(users);
            }, 250);

        });
    
    }

    getById(id: number): Promise<User> {

        return new Promise<User>((resolve) => {

            setTimeout(() => {
                const user = {...data.find(user => user.id === id)};
                resolve(user);
            }, 250);

        });
    }

    getUserByUniqueKey(key: string, val: string): Promise<User> {

        return new Promise<User>((resolve, reject) => {
           
            setTimeout(() => {
                const user = {...data.find(user => user[key] === val)};
                resolve(user);
            }, 250);

        });
        
    
    }

    getUserByCredentials(un: string, pw: string) {
        
        return new Promise<User>((resolve, reject) => {
        
            setTimeout(() => {
                const user = {...data.find(user => user.username === un && user.password === pw)};
                resolve(user);  
            }, 250);

        });
    
    }

    save(newUser: User): Promise<User> {
            
        return new Promise<User>((resolve, reject) => {
        
            setTimeout(() => { 
                newUser.id = (data.length) + 1;
                data.push(newUser);
                resolve(newUser);
            });

        });
    
    }

    update(updatedUser: User): Promise<boolean> {
        
        return new Promise<boolean>((resolve, reject) => {
        
            setTimeout(() => {
        
                let persistedUser = data.find(user => user.id === updatedUser.id);
        
                if (!persistedUser) {
                    reject(new ResourceNotFoundError('No user found with provided id.'));
                    return;
                }
                
                if (persistedUser.username != updatedUser.username) {
                    reject(new ResourcePersistenceError('Usernames cannot be updated.'));
                    return;
                }
        
                const conflict = data.find(user => {
                    if (user.id == updatedUser.id) return false;
                    return user.email == updatedUser.email; 
                });
        
                if (conflict) {
                    reject(new ResourcePersistenceError('Provided email is taken by another user.'));
                    return;
                }
    
                persistedUser = updatedUser;
    
                resolve(true);
        
            });

        });
    
    }

    deleteById(id: number): Promise<boolean> {

        return new Promise<boolean>((resolve, reject) => {
            reject(new NotImplementedError());
        });
    }

}
