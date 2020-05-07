//import data from '../data/user-db';
import { User } from '../models/user';
import { CrudRepository } from './crud-repo';
import { NotImplementedError,  ResourceNotFoundError, ResourcePersistenceError } from '../errors/errors';
import { InternalServerError } from '../errors/errors';
import { connectionPool } from '..';
import { PoolClient } from 'pg';
import { mapUserResultSet } from '../util/result-set-mapper';


export class UserRepository implements CrudRepository<User> {

    baseQuery = `
    select
        u.id,
        u.username,
        u.password,
        u.first_name,
        u.last_name,
        u.email,
        ur.name as role_id
    from users u
    join user_roles ur
    on u.role_id = ur.id
    `;
    
    // Gets all users from database
    async getAll(): Promise<User[]> {

            let client: PoolClient;
            try { 
                client = await connectionPool.connect();
                let sql = `${this.baseQuery} order by u.id`;
                let rs = await client.query(sql);
                return rs.rows;
            } catch (e) {
                throw new InternalServerError();
            } finally {
                client && client.release();
            }
           
        };

    //Gets single user if exists
    async getById(id: number): Promise<User> {
        
        let client: PoolClient;
        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery} where u.id = $1`;
            let rs = await client.query(sql, [id]);
            return mapUserResultSet(rs.rows[0]);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }

    }

    async getUserByUniqueKey(key: string, val: string): Promise<User> {

        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery} where au.${key} = $1`;
            let rs = await client.query(sql, [val]);
            return mapUserResultSet(rs.rows[0]);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
        
    
    }


    //Logs in user if credentials are correct
    async getbyCredentials(un: string, pw: string) {
        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery} where u.username = $1 and u.password = $2`
            let rs = await client.query(sql, [un, pw]);
            return mapUserResultSet(rs.rows[0]);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    }

    //creates new user
    async save(newUser: User): Promise<User> {
        let client: PoolClient;
        
        try {
            client = await connectionPool.connect();

            //WIP FIX FROM REVABOARDS
            let roleId = (await client.query('select id from user_roles where name = $1', [newUser.role])).rows[0].id;

            let sql = `
                insert into users (username, password, first_name, last_name, email, role_id)
                values ($1, $2, $3, $4, $5, $6) returning id
            `;

            let rs = await client.query(sql, [newUser.username, newUser.password, newUser.firstName, newUser.lastName, newUser.email, roleId]);

            newUser.id = rs.rows[0].id;

            return newUser;
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }

    }

    //updates user
    async update(updatedUser: User): Promise<boolean> {
        let client: PoolClient;
            try { 
                client = await connectionPool.connect();
                let sql = `
                    update users
                    set
                        username = $2,
                        password = $3,
                        first_name = $4,
                        last_name = $5
                        email = $6
                    where id = $1
                `;
                await client.query(sql, [updatedUser.id, updatedUser.username, updatedUser.password, updatedUser.firstName, updatedUser.lastName, updatedUser.email]);
                
                return true;
            } catch (e) {
                console.log(e);
                throw new InternalServerError();
            } finally {
                client && client.release();
            }
    }

    //deletes user
    async delete(userToDelete: User): Promise<boolean> {
        let client: PoolClient;
            try { 
                client = await connectionPool.connect();
                let sql = `
                    delete from users
                    where id = $1
                `;
                await client.query(sql, [userToDelete.id]);
                return true;
            } catch (e) {
                console.log(e);
                throw new InternalServerError();
            } finally {
                client && client.release();
            }
    }

    async checkUsername(username: string): Promise<User> {
        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `select * from users where username = $1`;
            let rs = await client.query(sql, [username]);
            return mapUserResultSet(rs.rows[0]);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    }

    
}
