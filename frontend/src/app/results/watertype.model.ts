export class Watertype {
    id: number;
    parentId: number;
    name: string;
    code: string;

    public static fromJSON(obj): Watertype {
        const watertype = new Watertype();
        watertype.id = obj.id;
        watertype.parentId = obj.parentId;
        watertype.name = obj.name;
        watertype.code = obj.code;
        return watertype;
    }
}
