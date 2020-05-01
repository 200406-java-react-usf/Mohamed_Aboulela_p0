import { UserRepository } from "../repos/user-repo";
import { UserService } from "../services/user-service";
//import { PostRepository } from "../repos/post-repo";
//import { PostService } from "../services/post-service";

const userRepo = new UserRepository();
const userService = new UserService(userRepo);

//const postRepo = new PostRepository();
//const postService = new PostService(postRepo);

export default {
    userService,
    //postService
}