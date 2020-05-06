export interface CrudRepository<T> {
    getAll(): Promise<T[]>;
    getById(id: number): Promise<T>;
}