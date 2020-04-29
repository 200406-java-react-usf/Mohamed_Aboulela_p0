import { User } from '../models/user';
let id = 1;

export default [
    new User(1, 'ktigaloo', 'password', 'Kristen', 'Tigaloo', 'ktigaloo@astrofan.com', 'Admin'),
    new User(2, 'gphalar', 'password', 'George', 'Phalar', 'gphalar@astrofan.com', 'User'),
    new User(3, 'agargantuan', 'password', 'Andrew', 'Gargantuan', 'agargantuan@astrofan.com', 'User'),
    new User(4, 'mandromeda', 'password', 'Maryam', 'Andromeda', 'mandromeda@astrofan.com', 'User'),
    new User(5, 'ecristanopolis', 'password', 'Ezekiel', 'Cristanopolis', 'ecristanopolis@astrofan.com', 'User'),
];