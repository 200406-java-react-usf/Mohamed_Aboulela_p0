import { UserRepository } from "../repos/user-repo";
import { UserService } from "../services/user-service";
import { AstrologyRepository } from "../repos/astrology-repo";
import { AstrologyService } from "../services/astrology-service";

const userRepo = new UserRepository();
const userService = new UserService(userRepo);

const astrologyRepo = new AstrologyRepository();
const astrologyService = new AstrologyService(astrologyRepo);

export default {
    userService,
    //astrologyService
}