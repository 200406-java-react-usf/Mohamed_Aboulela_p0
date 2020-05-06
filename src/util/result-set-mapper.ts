import { UserSchema, AstrologySchema } from "./schemas";
import { User } from "../models/user";
import { Astrology } from "../models/astrology";

export function mapUserResultSet(resultSet: UserSchema): User {
    
    if (!resultSet) {
        return {} as User;
    }

    return new User(
        resultSet.id,
        resultSet.username,
        resultSet.password,
        resultSet.first_name,
        resultSet.last_name,
        resultSet.email,
        resultSet.role_name
    );
}


export function mapAstrologyResultSet(resultSet: AstrologySchema): Astrology {

	if(!resultSet){
		return {} as Astrology;
	}

	return new Astrology (
		resultSet.id,
		resultSet.title,
		resultSet.body,
		resultSet.astrology_id
	);
}