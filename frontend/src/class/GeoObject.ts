
export interface GeoObject {

    category: "region_cz" | "district_cz" | "municipality_cz" | "ward_cz" | "quarter_cz" | "street_cz" ,
    userData: {
        latitude: number,
        longitude: number,
        id: number,
        suggestFirstRow: string,
        suggestSecondRow: string,
        bbox: Array<number>,
        municipality: string,
    }
}