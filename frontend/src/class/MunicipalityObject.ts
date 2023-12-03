export interface CityObject {
    name: string | null;
    count: number;
    region: string | null;
    postcode: string | null;
    selected: boolean;
}

export function compare(a: CityObject, b: CityObject) : number {
    if (a.count < b.count || a.name === null) {
        return 1;
    }
    if (a.count > b.count || b.name === null) {
        return -1;
    }
    return a.name?.localeCompare(b.name);
}


