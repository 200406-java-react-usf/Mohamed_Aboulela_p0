export class Astrology {

    id: number;
    title: string;
    body: string;
    astrologyId: number;

    constructor (id: number, title: string, body: string, aid: number) {
        this.id = id;
        this.title = title;
        this.body = body;
        this.astrologyId = aid;
    }
    
}