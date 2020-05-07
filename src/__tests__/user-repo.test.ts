import { UserRepository } from '../repos/user-repo';
import * as mockIndex from '..';
import * as mockMapper from '../util/result-set-mapper';
import { User } from '../models/user';

/*
    We need to mock the connectionPool exported from the main module
    of our application. At this time, we only use one exposed method
    of the pg Pool API: connect. So we will provide a mock function 
    in its place so that we can mock it in our tests.
*/

jest.mock('..', () => {
    return {
        connectionPool: {
            connect: jest.fn()
        }
    }
});

jest.mock('../util/result-set-mapper', () => {
    return {
        mapUserResultSet: jest.fn()
    }
});

describe('userRepo', () => {
    let sut = new UserRepository();
    let mockConnect = mockIndex.connectionPool.connect;

    beforeEach( () => {
        (mockConnect as jest.Mock).mockClear().mockImplementation( () => {
            return {
                query: jest.fn().mockImplementation( () => {
                    return { 
                        rows: [
                            {
                            id: 1,
                            username: 'maboulela',
                            password: 'password',
                            first_name: 'Mohamed',
                            last_name: 'Aboulela',
                            email: 'maboulela@astrofan.com'
                            }
                        ]
                    }
                }),
                release: jest.fn()
            }
        });
        (mockMapper.mapUserResultSet as jest.Mock).mockClear();
    })


    test('should resolve to an array of Users when getAll retrieves records from data source', async () => {

        //Arrange
        expect.hasAssertions();

        let mockUser = new User(1, 'username', 'password', 'firstName', 'lastName', 'email', 'Locked');
        (mockMapper.mapUserResultSet as jest.Mock).mockReturnValue(mockUser);

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

    test('should resolve to a User object when getById retrieves a record from data source', async () => {
        
        //Arrange
        expect.hasAssertions();

        let mockUser = new User(1, 'username', 'password', 'firstName', 'lastName', 'email', 'Locked');
        (mockMapper.mapUserResultSet as jest.Mock).mockReturnValue(mockUser);

        //Act
        let result = await sut.getById(1);

        //Assert
        expect(result).toBeTruthy();
        expect(result instanceof User).toBe(true);
        expect(mockConnect).toBeCalledTimes(1);
    });

    test('should resolve to a User object when getByCredentials is called', async () => {
       
        //Arrange
        expect.hasAssertions();

        let mockUser = new User(1, 'username', 'password', 'firstName', 'lastName', 'email', 'Locked');
        (mockMapper.mapUserResultSet as jest.Mock).mockReturnValue(mockUser);

        //Act
        let result = await sut.getbyCredentials("username", "password");

        //Assert
        expect(result).toBeTruthy();
        expect(result instanceof User).toBe(true);
        expect(mockConnect).toBeCalledTimes(1);
    });

    test('should resolve to a new User object when save is called', async () => {
        
        //Arrange
        expect.hasAssertions();

        let mockUser = new User(1, 'username', 'password', 'firstName', 'lastName', 'email', 'Locked');
        (mockMapper.mapUserResultSet as jest.Mock).mockReturnValue(mockUser);

        //Act
        let result = await sut.save(mockUser);

        //Assert
        expect(result).toBeTruthy();
        expect(result instanceof User).toBe(true);
        expect(mockConnect).toBeCalledTimes(1);
    });
});