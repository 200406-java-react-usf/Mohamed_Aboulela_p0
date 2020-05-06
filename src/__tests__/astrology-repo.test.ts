import { AstrologyRepository } from '../repos/astrology-repo';
import * as mockIndex from '..';
import * as mockMapper from '../util/result-set-mapper';
import { Astrology } from '../models/astrology';
import { InternalServerError } from '../errors/errors';

jest.mock('..', () => {
    return {
        connectionPool: {
            connect: jest.fn()
        }
    }
});

jest.mock('../util/result-set-mapper', () => {
    return {
        mapAstrologyResultSet: jest.fn()
    }
});

describe('Astrology Repo', () => {
    let sut = new AstrologyRepository();
    let mockConnect = mockIndex.connectionPool.connect;

    beforeEach( () => {
        (mockConnect as jest.Mock).mockClear().mockImplementation( () => {
            return {
                query: jest.fn().mockImplementation( () => {
                    return { 
                        rows: [
                            {
                            //id: 1,
                            //balance: 400,
                            //type: "Checking",
                            //owner_id: 1
                            }
                        ]
                    }
                }),
                release: jest.fn()
            }
        });
        (mockMapper.mapAstrologyResultSet as jest.Mock).mockClear();
    })


    test('should resolve to an array of signs when getAll retrieves records from data source', async () => {

        //Arrange
        expect.hasAssertions();

        //let mockAstrology = new Astrology(1, 'Checking', 500, 1);
        //(mockMapper.mapAstrologyResultSet as jest.Mock).mockReturnValue(mockAstrology);

        //Act
        let result = await sut.getAll();

        //Assert
        expect(result).toBeTruthy();
        expect(result instanceof Array).toBe(true);
        expect(result.length).toBe(1);
        expect(mockConnect).toBeCalledTimes(1);
    });

    test('should resolve to an empty array when getAll retrieves no records from data source', async () => {

        //Arrange
        expect.hasAssertions();
        (mockConnect as jest.Mock).mockImplementation( () => {
            return {
                query: jest.fn().mockImplementation( () => {return {rows: [] } }),
                release: jest.fn()
            }
        });

        //Act
        let result = await sut.getAll();

        //Assert
        expect(result).toBeTruthy();
        expect(result instanceof Array).toBe(true);
        expect(result.length).toBe(0);
        expect(mockConnect).toBeCalledTimes(1);
    });

    test('should resolve to an Astrology object when getById retrieves a record from data source', async () => {
        
        //Arrange
        expect.hasAssertions();

        //let mockAstrology = new Astrology(1, 500, 'Checking', 1);
        //(mockMapper.mapAstrologyResultSet as jest.Mock).mockReturnValue(mockAstrology);

        //Act
        let result = await sut.getById(1);

        //Assert
        expect(result).toBeTruthy();
        expect(result instanceof Astrology).toBe(true);
        expect(mockConnect).toBeCalledTimes(1);
    });

    test('should resolve to a new Astrology object when save is called', async () => {
        
        //Arrange
        expect.hasAssertions();

        //let mockAstrology = new Astrology(1, 500, 'Checking', 1);
        //(mockMapper.mapAstrologyResultSet as jest.Mock).mockReturnValue(mockAstrology);

        //Act
        //let result = await sut.save(mockAstrology);

        //Assert
        //expect(result).toBeTruthy();
        //expect(result instanceof Astrology).toBe(true);
        expect(mockConnect).toBeCalledTimes(1);
    });

    // test('should resolve to an Astrology object when getAstrologyByUniqueKey is called', async() => {
        
    //     //Arrange
    //     expect.hasAssertions();

    //     let mockAstrology = new Astrology(1, 500, 'Checking', 1);
    //     (mockMapper.mapAstrologyResultSet as jest.Mock).mockReturnValue(mockAstrology);

    //     //Act
    //     let result = await sut.getAstrologyByUniqueKey("astrologyId", "1");

    //     //Assert
    //     expect(result).toBeTruthy();
    //     expect(result instanceof Astrology).toBe(true);
    //     expect(mockConnect).toBeCalledTimes(1);
    // });
});