import data from '../data/astrology-db';
import { Astrology } from '../models/astrology';
import { CrudRepository } from './crud-repo';
import { BadRequestError, ResourceNotFoundError, ResourcePersistenceError, NotImplementedError, InternalServerError } from '../errors/errors';
import { PoolClient } from 'pg';
import { connectionPool } from '..';
import { mapAstrologyResultSet } from '../util/result-set-mapper';

export class AstrologyRepository implements CrudRepository<Astrology> {
    
    baseQuery = `
    select
        a.id,
        a.title,
        a.body,
        a.astrology_id
    from astrology a
    `
    
    async getAll(): Promise<Astrology[]> {
        let client: PoolClient;
            try { 
                client = await connectionPool.connect();
                let sql = `${this.baseQuery} order by a.id`;
                let rs = await client.query(sql);
                return rs.rows;

            } catch (e) {
                throw new InternalServerError();
            } finally {
                client && client.release();
            }
    };

    async getById(id: number): Promise<Astrology> {
        let client: PoolClient;
            try { 
                client = await connectionPool.connect();
                let sql = `${this.baseQuery} where a.id = $1`;
                let rs = await client.query(sql, [id]);
                return mapAstrologyResultSet(rs.rows[0]);

            } catch (e) {
                throw new InternalServerError();
            } finally {
                client && client.release();
            }
    }

    async save(newAstrology: Astrology): Promise<Astrology> {
        let client: PoolClient;
            try { 
                client = await connectionPool.connect();
                let sql = `
                    insert into astrology (title, body, astrology_id) values
                    ($1, $2, $3) returning id
                `
                
                let rs = await client.query(sql, [newAstrology.title, newAstrology.body, newAstrology.astrologyId]);
                newAstrology.id = rs.rows[0].id;

                return newAstrology;

            } catch (e) {
                console.log(e);
                throw new InternalServerError();
            } finally {
                client && client.release();
            }
    }

    async update(updatedAstrology: Astrology): Promise<boolean> {
        // only added functionality to update astrology type (for now)
        let client: PoolClient;
            try { 
                client = await connectionPool.connect();
                let sql = `
                    update astrology
                    set
                        body = $2
                    where id = $1
                `;
                let rs = await client.query(sql, [updatedAstrology.id, updatedAstrology.body]);
                return true;

            } catch (e) {
                throw new InternalServerError();
            } finally {
                client && client.release();
            }
    }

    async delete(astrologyToDelete: Astrology): Promise<boolean> {
        let client: PoolClient;
            try { 
                client = await connectionPool.connect();
                let sql = `
                    delete from astrology
                    where id = $1
                `;
                await client.query(sql, [astrologyToDelete.id]);
                return true;
            } catch (e) {
                console.log(e);
                throw new InternalServerError();
            } finally {
                client && client.release();
            }
    }


    async getAstrologyByUniqueKey(key: string, val: string): Promise<Astrology> {

        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery} where a.${key} = $1`;
            let rs = await client.query(sql, [val]);
            return mapAstrologyResultSet(rs.rows[0]);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    }

    async checkUserExists(val: number): Promise<Astrology> {
        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `
                select * from users where id = $1
            `;
            let rs = await client.query(sql, [val]);
            return mapAstrologyResultSet(rs.rows[0]);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    }
}