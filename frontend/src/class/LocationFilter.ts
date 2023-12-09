import { GeoObject } from "./GeoObject"


export type LocationFilter = RadiusLocationFilter | ExactLocationFilter;


export class RadiusLocationFilter {
    type: 'radius' = "radius";
    radius: number;
    place: GeoObject;

    constructor(place: GeoObject, radius: number) {
        this.place = place;
        this.radius = radius;
    }

    toParams() {
        return {
            lon: this.place.userData.longitude,
            lat: this.place.userData.latitude,
            loc_title: this.place.userData.suggestFirstRow, // for reconstruction on url load
            loc_radius: this.radius,
        }
    }

    static fromParams(params: any) {
        return new RadiusLocationFilter({
            userData: {
                suggestFirstRow: params.loc_title,
                longitude:  Number.parseFloat( params.lon),
                latitude:  Number.parseFloat(params.lat),
            }
        } as GeoObject,
            Number.parseInt(params.loc_radius)
        )
    }
}

export class ExactLocationFilter {
    type: 'exact' = "exact";
    place: GeoObject;

    constructor(place: GeoObject) {
        this.place = place;
    }

    static supportsCategory(category: string) {
        return ["region_cz", "municipality_cz", "quarter_cz", "street_cz"].includes(category);
    }

    private static getFilteringObjectValuPropName(place: GeoObject) {
        // @ts-ignore
        return place.userData[ExactLocationFilter.getGeoObjectPropName(place.category)] ?? 'municipality';
    }

    private static getGeoObjectPropName(str: string) : string {
        // @ts-ignore
        return {
            "region_cz": "region",
            "municipality_cz": "municipality",
            "quarter_cz": "municipality",
            "street_cz": "street",
        }[str] ?? 'municipality_cz';
    }

    get filteringObjectValue() {
        return ExactLocationFilter.getFilteringObjectValuPropName(this.place);
    }


    toParams() {
        return {
            loc_type : this.place.category,
            loc_bbox: this.place.userData.bbox,
            loc_name: this.filteringObjectValue,
            loc_title: this.place.userData.suggestFirstRow, // for reconstruction on url load
        }
    }

    static fromParams(params: any) {
        const x= new ExactLocationFilter({
            category: params.loc_type,
            userData: {
                suggestFirstRow: params.loc_title,
                bbox: params.loc_bbox.map((x: string) => Number.parseFloat(x)),
                [ExactLocationFilter.getGeoObjectPropName(params.loc_type)]: params.loc_name,
            }
        } as GeoObject) // shouldnt break anything
        return x;
    }
}
