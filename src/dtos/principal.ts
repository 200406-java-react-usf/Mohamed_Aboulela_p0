export class Principal {

    id: number;
    username: string;
    role: string;

    constructor(id: number, un: string, role: string) {
        this.id = id;
        this.username = un;
        this.role = role;
    }
    
}