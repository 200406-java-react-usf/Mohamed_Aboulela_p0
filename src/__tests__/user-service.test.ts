import { UserService } from '../services/user-service';
import { UserRepository } from '../repos/user-repo';
import { User } from '../models/user';
import Validator from '../util/validator';
import { ResourceNotFoundError, BadRequestError, AuthenticationError, ResourcePersistenceError } from '../errors/errors';
import { mapAstrologyResultSet } from '../util/result-set-mapper';

jest.mock('../repos/user-repo', () => {
    return new class UserRepository {
        getAll = jest.fn();
        getById = jest.fn();
        getByCredentials = jest.fn();
        save = jest.fn();
        update = jest.fn();
        delete = jest.fn();
        //getUserByUniqueKey = jest.fn();
    }
});

describe('userService', () => {

    let sut: UserService;
    let mockRepo;

    let mockUsers = [
        new User(1, 'ktigaloo', 'password', 'Kristen', 'Tigaloo', 'ktigaloo@astrofan.com', 'Admin'),
        new User(2, 'gphalar', 'password', 'George', 'Phalar', 'gphalar@astrofan.com', 'User'),
        new User(3, 'agargantuan', 'password', 'Andrew', 'Gargantuan', 'agargantuan@astrofan.com', 'User'),
        new User(4, 'mandromeda', 'password', 'Maryam', 'Andromeda', 'mandromeda@astrofan.com', 'User'),
        new User(5, 'ecristanopolis', 'password', 'Ezekiel', 'Cristanopolis', 'ecristanopolis@astrofan.com', 'User'),
    ];

    beforeEach( () => {
        mockRepo = jest.fn( () => {
            return {
                getAll: jest.fn(),
                getById: jest.fn(),
                getByCredentials: jest.fn(),
                save: jest.fn(),
                update: jest.fn(),
                delete: jest.fn(),
                //getUserByUniqueKey: jest.fn()
            }
        });

        sut = new UserService(mockRepo);
    });

    test('should resolve to User[] (without passwords) when getAllUsers() successfully retrieves users from the data source', async () => {
        
        //Arrange
        expect.hasAssertions();
        mockRepo.getAll = jest.fn().mockReturnValue(mockUsers);

        //Act
        let result = await sut.getAllUsers();

        //Asssert
        expect(result).toBeTruthy();
        expect(result.length).toBe(5);
        result.forEach(val => expect(val.password).toBeUndefined());
    });

    test('should reject with ResourceNotFoundError when getAllUsers fails to get any users from the data source', async () => {
        
        //Arrange
        expect.hasAssertions();
        mockRepo.getAll = jest.fn().mockReturnValue([]);

        //Act
        try {
            await sut.getAllUsers();
        } catch (e) {
            //Assert
            expect(e instanceof ResourceNotFoundError).toBe(true);
        }
    });


    test('should resolve to User when getById is given a valid and known id', async () => {
        
        //Arrange
        expect.hasAssertions();

        Validator.isValidId = jest.fn().mockReturnValue(true);
        mockRepo.getById = jest.fn().mockImplementation((id: number) => {
            return new Promise<User>((resolve) => resolve(mockUsers[id-1]));
        })

        //Act
        let result = await sut.getUserById(1);

        //Asssert
        expect(result).toBeTruthy();
        expect(result.id).toBe(1);
        expect(result.password).toBeUndefined();
    });

    test('should reject with BadRequestError when getUserById is given an invalid value as id (negative number)', async() => {
        
        //Arrange
        expect.hasAssertions();
        mockRepo.getById = jest.fn().mockReturnValue(false);

        //Act
        try {
            await sut.getUserById(-1);
        } catch (e) {

            //Assert
            expect(e instanceof BadRequestError).toBe(true);
        }
    });

    test('should reject with BadRequestError when getUserById is given an invalid value as id (decimal)', async() => {
        
        //Arrange
        expect.hasAssertions();
        mockRepo.getById = jest.fn().mockReturnValue(false);

        //Act
        try {
            await sut.getUserById(3.14);
        } catch (e) {

            //Assert
            expect(e instanceof BadRequestError).toBe(true);
        }
    });

    test('should reject with BadRequestError when getUserById is given an invalid value as id (NaN)', async() => {
        
        //Arrange
        expect.hasAssertions();
        mockRepo.getById = jest.fn().mockReturnValue(false);

        //Act
        try {
            await sut.getUserById(NaN);
        } catch (e) {

            //Assert
            expect(e instanceof BadRequestError).toBe(true);
        }
    });

    test('should reject with BadRequestError when getUserById is given an invalid value as id (zero)', async() => {
        
        //Arrange
        expect.hasAssertions();
        mockRepo.getById = jest.fn().mockReturnValue(false);

        //Act
        try {
            await sut.getUserById(0);
        } catch (e) {

            //Assert
            expect(e instanceof BadRequestError).toBe(true);
        }
    });

    test('should reject with ResourceNotFoundError when getById is given an unknown value as id ', async() => {
        
        //Arrange
        expect.hasAssertions();
        mockRepo.getById = jest.fn().mockReturnValue(true);

        //Act
        try {
            await sut.getUserById(8392);
        } catch (e) {

            //Assert
            expect(e instanceof ResourceNotFoundError).toBe(true);
        }
    });

    test('should resolve to adding a new user when given the correct information to addNewUser', async () => {
        
        //Arrange
        expect.hasAssertions();

        sut.checkUsername = jest.fn().mockReturnValue(true);
        mockRepo.save = jest.fn().mockReturnValue(mockUsers[0]);

        //Act
        let result = await sut.addNewUser(mockUsers[0]);

        //Asssert
        expect(result).toBeTruthy();
        expect(result.id).toBe(1);
        expect(result.password).toBeUndefined();
    });

    test('should throw BadRequestError when sending a bad value to addNewUser', async () => {
        
        //Arrange
        expect.hasAssertions();

        //Act
        try {
            await sut.addNewUser(null);
        } catch (e) {

            //Assert
            expect(e instanceof BadRequestError).toBe(true);
        }
    });

    test('should throw ResourcePersistenceError when sending a username that already is in the table addNewUser', async () => {
        
        //Arrange
        expect.hasAssertions();
        sut.checkUsername = jest.fn().mockReturnValue(false);

        //Act
        try {
            await sut.addNewUser(mockUsers[0]);
        } catch (e) {

            //Assert
            expect(e instanceof ResourcePersistenceError).toBe(true);
        }
    });

    test('should resolve to updating a user given the correct information', async () => {

        //Arrange
        expect.hasAssertions();
        sut.getUserById = jest.fn().mockReturnValue({});
        sut.checkUsername = jest.fn().mockReturnValue(true);
        mockRepo.update = jest.fn().mockReturnValue({})

        //Act
        let result = sut.updateUser(new User(1, 'maboulela', 'password', 'mohamed', 'aboulela', 'maboulela@astrofan.com', 'Admin'));

        //Assert
        expect(result).toBeTruthy();
    });

    test('should resolve to deleting a user given the correct information to delete', async () => {

        //Arrange
        expect.hasAssertions();
        sut.getUserById = jest.fn().mockReturnValue({});
        mockRepo.delete = jest.fn().mockReturnValue({})

        //Act
        let result = sut.deleteUser(new User(1, 'maboulela', 'password', 'mohamed', 'aboulela', 'maboulela@astrofan.com', 'Admin'));

        //Assert
        expect(result).toBeTruthy();
    });

    test('should throw BadRequestError when sending a bad value to deleteUser', async () => {
        
        //Arrange
        expect.hasAssertions();

        //Act
        try {
            await sut.deleteUser(null);
        } catch (e) {

            //Assert
            expect(e instanceof BadRequestError).toBe(true);
        }
    });


    test('should throw BadRequestError when sending a bad value to updateUser', async () => {
        
        //Arrange
        expect.hasAssertions();

        //Act
        try {
            await sut.updateUser(null);
        } catch (e) {

            //Assert
            expect(e instanceof BadRequestError).toBe(true);
        }
    });

});