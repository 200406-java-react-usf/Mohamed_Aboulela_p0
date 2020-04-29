import { UserService } from '../services/user-service';
import { UserRepository } from '../repos/user-repo';
import { User } from '../models/user';
import Validator from '../util/validator';
import { ResourceNotFoundError, BadRequestError } from '../errors/errors';

describe('userService', () => {

    let sut: UserService;
    let mockRepo: UserRepository = new UserRepository();

    let mockUsers = [
        new User(1, 'ktigaloo', 'password', 'Kristen', 'Tigaloo', 'ktigaloo@astrofan.com', 'Admin'),
        new User(2, 'gphalar', 'password', 'George', 'Phalar', 'gphalar@astrofan.com', 'User'),
        new User(3, 'agargantuan', 'password', 'Andrew', 'Gargantuan', 'agargantuan@astrofan.com', 'User'),
        new User(4, 'mandromeda', 'password', 'Maryam', 'Andromeda', 'mandromeda@astrofan.com', 'User'),
        new User(5, 'ecristanopolis', 'password', 'Ezekiel', 'Cristanopolis', 'ecristanopolis@astrofan.com', 'User'),
    ];

    beforeEach(() => {
        
        sut = new UserService(mockRepo);

        //Reset all external methods 
        for (let method in UserRepository.prototype) {
            UserRepository.prototype[method] = jest.fn().mockImplementation(() => {
                throw new Error(`Failed to mock external method: UserRepository.${method}!`);
            });
        }
    });

    test('should resolve to User[] (withoutpassowrds) when getAllUsers() successfully retrieves users from the data source', async () => {

        //Arrange
        expect.hasAssertions();
        UserRepository.prototype.getAll = jest.fn().mockReturnValue(mockUsers);

        //Act
        let result = await sut.getAllUsers();

        //Assert
        expect(result).toBeTruthy();
        expect(result.length).toBe(5);
        result.forEach(val => expect(val.password).toBeUndefined());


    });

    test('should reject with ResourceNotFoundError when getAllUsers fails to get any users from the data source', async () => {

        // Arrange
        expect.assertions(1);
        UserRepository.prototype.getAll = jest.fn().mockReturnValue([]);

        // Act
        try {
            await sut.getAllUsers();
        } catch (e) {

            // Assert
            expect(e instanceof ResourceNotFoundError).toBe(true);
        }

    });

    test('should resolve to User when getUserById is given a valid an known id', async () => {

        // Arrange
        expect.assertions(3);
        
        Validator.isValidId = jest.fn().mockReturnValue(true);

        UserRepository.prototype.getById = jest.fn().mockImplementation((id: number) => {
            return new Promise<User>((resolve) => resolve(mockUsers[id - 1]));
        });


        // Act
        let result = await sut.getUserById(1);

        // Assert
        expect(result).toBeTruthy();
        expect(result.id).toBe(1);
        expect(result.password).toBeUndefined();

    });

    test('should reject with BadRequestError when getUserById is given a invalid value as an id (decimal)', async () => {

        // Arrange
        expect.hasAssertions();
        UserRepository.prototype.getById = jest.fn().mockReturnValue(false);

        // Act
        try {
            await sut.getUserById(3.14);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with BadRequestError when getUserById is given a invalid value as an id (zero)', async () => {

        // Arrange
        expect.hasAssertions();
        UserRepository.prototype.getById = jest.fn().mockReturnValue(false);

        // Act
        try {
            await sut.getUserById(0);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with BadRequestError when getUserById is given a invalid value as an id (NaN)', async () => {

        // Arrange
        expect.hasAssertions();
        UserRepository.prototype.getById = jest.fn().mockReturnValue(false);

        // Act
        try {
            await sut.getUserById(NaN);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with BadRequestError when getUserById is given a invalid value as an id (negative)', async () => {

        // Arrange
        expect.hasAssertions();
        UserRepository.prototype.getById = jest.fn().mockReturnValue(false);

        // Act
        try {
            await sut.getUserById(-2);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with ResourceNotFoundError if getByid is given an unknown id', async () => {

        // Arrange
        expect.hasAssertions();
        UserRepository.prototype.getById = jest.fn().mockReturnValue(true);

        // Act
        try {
            await sut.getUserById(9999);
        } catch (e) {

            // Assert
            expect(e instanceof ResourceNotFoundError).toBe(true);
        }

    });

});