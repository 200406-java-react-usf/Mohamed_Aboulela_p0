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
                            id: 1,
                            title: "Aquarius",
                            type: "Although they can easily adapt to the energy that surrounds them, Aquarius-born have a deep need to be some time alone and away from everything, in order to restore power. People born under the Aquarius sign, look at the world as a place full of possibilities. Aquarius is an air sign, and as such, uses his mind at every opportunity. If there is no mental stimulation, they are bored and lack a motivation to achieve the best result. The ruling planet of Aquarius, Uranus has a timid, abrupt and sometimes aggressive nature, but it also gives Aquarius visionary quality. They are capable of perceiving the future and they know exactly what they want to be doing five or ten years from now. Uranus also gave them the power of quick and easy transformation, so they are known as thinkers, progressives and humanists. They feel good in a group or a community, so they constantly strive to be surrounded by other people. The biggest problem for Aquarius-born is the feeling that they are limited or constrained. Because of the desire for freedom and equality for all, they will always strive to ensure freedom of speech and movement. Aquarius-born have a reputation for being cold and insensitive persons, but this is just their defence mechanism against premature intimacy. They need to learn to trust others and express their emotions in a healthy way.'",
                            astrology_id: 1
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

        let mockAstrology = new Astrology(1, 'Aquarius', 'Although they can easily adapt to the energy that surrounds them, Aquarius-born have a deep need to be some time alone and away from everything, in order to restore power. People born under the Aquarius sign, look at the world as a place full of possibilities. Aquarius is an air sign, and as such, uses his mind at every opportunity. If there is no mental stimulation, they are bored and lack a motivation to achieve the best result. The ruling planet of Aquarius, Uranus has a timid, abrupt and sometimes aggressive nature, but it also gives Aquarius visionary quality. They are capable of perceiving the future and they know exactly what they want to be doing five or ten years from now. Uranus also gave them the power of quick and easy transformation, so they are known as thinkers, progressives and humanists. They feel good in a group or a community, so they constantly strive to be surrounded by other people. The biggest problem for Aquarius-born is the feeling that they are limited or constrained. Because of the desire for freedom and equality for all, they will always strive to ensure freedom of speech and movement. Aquarius-born have a reputation for being cold and insensitive persons, but this is just their defence mechanism against premature intimacy. They need to learn to trust others and express their emotions in a healthy way.', 1);
        (mockMapper.mapAstrologyResultSet as jest.Mock).mockReturnValue(mockAstrology);

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

        let mockAstrology = new Astrology(1, 'Aquarius', 'Although they can easily adapt to the energy that surrounds them, Aquarius-born have a deep need to be some time alone and away from everything, in order to restore power. People born under the Aquarius sign, look at the world as a place full of possibilities. Aquarius is an air sign, and as such, uses his mind at every opportunity. If there is no mental stimulation, they are bored and lack a motivation to achieve the best result. The ruling planet of Aquarius, Uranus has a timid, abrupt and sometimes aggressive nature, but it also gives Aquarius visionary quality. They are capable of perceiving the future and they know exactly what they want to be doing five or ten years from now. Uranus also gave them the power of quick and easy transformation, so they are known as thinkers, progressives and humanists. They feel good in a group or a community, so they constantly strive to be surrounded by other people. The biggest problem for Aquarius-born is the feeling that they are limited or constrained. Because of the desire for freedom and equality for all, they will always strive to ensure freedom of speech and movement. Aquarius-born have a reputation for being cold and insensitive persons, but this is just their defence mechanism against premature intimacy. They need to learn to trust others and express their emotions in a healthy way.', 1);
        (mockMapper.mapAstrologyResultSet as jest.Mock).mockReturnValue(mockAstrology);

        //Act
        let result = await sut.getById(1);

        //Assert
        expect(result).toBeTruthy();
        expect(result instanceof Astrology).toBe(true);
        expect(mockConnect).toBeCalledTimes(1);
    });

});