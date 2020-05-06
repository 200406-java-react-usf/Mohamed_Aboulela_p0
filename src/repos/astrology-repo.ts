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
    
    // Grants all information from database using admin access. 
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

    //Gets a single sign

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
}