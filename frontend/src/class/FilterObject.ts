import { LocationQuery } from "vue-router";
import { DealType, OwnershipType, PropertyType, SubcategoryType } from "./types";
import { LocationFilter } from "./GeoFilter";

export type OrderingOption = "priceDrop" | "age" | "price" | "pricePerMeter";
export type DeletedOption = "deleted" | "active" | "all";

export class Ordering {
    key: OrderingOption;
    desc: boolean;

    constructor(key: OrderingOption, desc: boolean) {
        this.key = key;
        this.desc = desc;
    }

    public toString(): string {
        return `${this.key}:${this.desc}`;
    }

    static fromString(s: string): Ordering {
        const split = s.split(":");
        return new Ordering(split[0] as OrderingOption, split[1] !== "0");
    }
}

export class FilterObject {
    query?: string;
    priceMin?: number;
    priceMax?: number;
    rentMin?: number;
    rentMax?: number;
    priceDropPercent?: number;
    priceDropCzk?: number;
    pricePerMeterMin?: number;
    pricePerMeterMax?: number;
    rentPerMeterMin?: number;
    rentPerMeterMax?: number;
    ageMin?: number;
    ageMax?: number;
    deleted?: DeletedOption;
    deal?: Array< DealType> = [];
    property?: Array< PropertyType> = [];
    subcategory?:  Array<SubcategoryType> = []; 
    ownership?: Array< OwnershipType> = [];
    location?: LocationFilter;
    orderBy = new Array<Ordering>();

    toParams(): LocationQuery {
        const obj = {} as LocationQuery;

        let keys = [
            "query",
            "priceMin",
            "priceMax",
            "rentMin",
            "rentMax",
            "pricePerMeterMin",
            "pricePerMeterMax",
            "rentPerMeterMin",
            "rentPerMeterMax",
            "priceDropPercent",
            "priceDropCzk",
            "ageMin",
            "ageMax",
        ];

        for (const key of keys) {
            // @ts-ignore
            if (this[key]) obj[key] = this[key];
        }

        // @ts-ignore
        if(this["deleted"] && this["deleted"] !== "active") obj["deleted"] = this["deleted"];

        keys = ["deal", "property", "ownership", "subcategory"];

        for (const key of keys) {
            // @ts-ignore
            if (this[key] && this[key].length > 0) obj[key] = this[key];
        }

        /** todo sub */

        if (this.location) {
            obj.loc_title = this.location.place.userData.suggestFirstRow;

            if(this.location.type === "radius") {
                obj.lat = this.location.place.userData.latitude.toString();
                obj.lon = this.location.place.userData.longitude.toString();
                obj.radius = this.location.radius.toString();
            }
            if(this.location.type === "exact") {
                obj.bbox = this.location.place.userData.bbox.join(",");
                obj.loc_type = this.location.place.category;
                   
            }

           
        }

        if (this.orderBy.length > 0) {
            const o = new Set();
            const orderBy = [] as string[];
            this.orderBy.forEach((e, i) => {
                if (o.has(e.key)) return;
                o.add(e.key);
                orderBy.push(`${i}:${e.key}:${e.desc ? "desc" : "asc"}`);
            });
            obj.orderBy = orderBy;
        }

        return obj;
    }

    static fromParams(params: Record<string, unknown>): FilterObject {
        const f = new FilterObject();

        let keys = [
            "query",
            "priceMin",
            "priceMax",
            "rentMin",
            "rentMax",
            "pricePerMeterMin",
            "pricePerMeterMax",
            "rentPerMeterMin",
            "rentPerMeterMax",
            "priceDropPercent",
            "priceDropCzk",
            "ageMin",
            "ageMax",
        ];

        for (const key of keys) {
            // @ts-ignore
            if (params[key]) f[key] = params[key];
        }
        if(params["deleted"] && params.deleted !== "active") f["deleted"] = params.deleted as DeletedOption;

        keys = ["deal", "property", "subcategory", "ownership"];

        for (const key of keys) {
            // @ts-ignore
            f[key] = params[key] ?? [];
        }


        if ("lat" in params) {
            f.location = {
                // @ts-ignore
                userData: {
                    latitude: parseFloat(params.lat as string),
                    longitude: parseFloat(params.lon as string),
                    suggestFirstRow: params.loc_title as string ?? `<z dřívějšího vyhledávání>`,
                },
                radius: parseInt(params.radius as string) ?? 1,
            };
        }

        if ("orderBy" in params) {
            f.orderBy = [];

            if (Array.isArray(params.orderBy) && params.orderBy.length > 0) {
                // @ts-ignore
                const list = params.orderBy.map((o) => o.split(":"));
                list.forEach((o) => (o[0] = parseInt(o[0])));
                // @ts-ignore
                list.sort((o) => o[0]);
                // @ts-ignore
                f.orderBy = list.map((o) => new Ordering(o[1], o[2] === "desc"));
            } else {
                // @ts-ignore
                const split = params.orderBy.split(":");
                f.orderBy.push(new Ordering(split[1], split[2] === "desc"));
            }
        }

        return f;
    }
}
