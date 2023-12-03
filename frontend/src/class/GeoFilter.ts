import { GeoObject } from "./GeoObject"


export type LocationFilter =  RadiusLocationFilter | ExactLocationFilter ;


export class RadiusLocationFilter {
    type: 'radius' = "radius";
    radius: number;
    place: GeoObject;

    constructor(place: GeoObject, radius: number) {
        this.place = place;
        this.radius = radius;
    }
}

export class ExactLocationFilter {
    type: 'exact' = "exact";
    place: GeoObject;

    constructor(place: GeoObject) {
        this.place = place;
    }

    get filteringObjectName() {
        return ""
    }
}
