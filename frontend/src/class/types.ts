export const DealCodes = [1, 2, 3, 4];
export const DealLabels: Record<DealType, string> = { 1: "Prodej", 2: "Pronájem", 3: "Dražba", 4: "Podíly" };
export type DealType = typeof DealCodes[number];
export enum Deal {
    "sell" = 1,
    "rent" = 2,
    "auction" = 3,
    "shares" = 4,
}

export const PropertyCodes = [1, 2, 3, 4, 5];
export const PropertyLabels: Record<PropertyType, string> = { 1: "Byty", 2: "Domy", 3: "Pozemky", 4: "Komerční", 5: "Jiné" } ;
export type PropertyType = typeof PropertyCodes[number];
export enum Property {
    "apartment" = 1,
    "house" = 2,
    "parcel" = 3,
    "commercial" = 4,
    "other" = 5,
}

export const OwnershipCodes = [0, 1, 2, 3];
export const OwnershipLabels:  Record<OwnershipType, string> = { 0: "Neuvedeno", 1: "Osobní", 2: "Družstevní", 3: "Statní/Obecní"};
export type OwnershipType = typeof OwnershipCodes[number];
export enum Ownership {
    "Osobní" = 1,
    "Družstevní" = 2,
    "Statní/Obecní" = 3,
    "not-present" = 0,
}

export const ApartmentSubcategoryCodes = [0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 47];
export type ApartmentSubcategoryType = typeof ApartmentSubcategoryCodes[number];
export const ApartmentSubcategoryLabels:  Record<ApartmentSubcategoryType, string> = {
    0: "Neuvedeno",
    2: "1+kk",
    3: "1+1",
    4: "2+kk",
    5: "2+1",
    6: "3+kk",
    7: "3+1",
    8: "4+kk",
    9: "4+1",
    10: "5+kk",
    11: "5+1",
    12: "6 a více",
    47: "Pokoj",
};
export enum ApartmentSubcategory {
    "not-present" = 0,
    "1+kk" = 2,
    "1+1" = 3,
    "2+kk" = 4,
    "2+1" = 5,
    "3+kk" = 6,
    "3+1" = 7,
    "4+kk" = 8,
    "4+1" = 9,
    "5+kk" = 10,
    "5+1" = 11,
    "6-a-vice" = 12,
    "pokoj" = 47,
}

export const ParcelSubcategoryCodes = [0, 19, 18, 20, 22, 21, 46, 24, 23, 48];
export const ParcelSubcategoryLabels:  Record<ParcelSubcategoryType, string> = { 0: "Neuvedeno", 19: "Bydlení", 18: "Komerční", 20: "Pole", 22: "Lesy", 21: "Louky", 46: "Rybníky", 24: "Ostatní", 23: "Zahrady", 48: "Sady/vinice" };

export type ParcelSubcategoryType = typeof ParcelSubcategoryCodes[number];
export enum ParcelSubcategory {
    "not-present" = 0,
    "stavebni-parcely" = 19,
    "komercni-pozemky" = 18,
    "pole" = 20,
    "louky" = 22,
    "lesy" = 21,
    "rybniky" = 46,
    "sady-vinice" = 48,
    "zahrady" = 23,
    "ostatni-pozemky" = 24,
}

export const HouseSubcategoryCodes = [0, 37, 39, 43, 40, 44, 33, 35, 54];
export const HouseSubcategoryLabels: Record<HouseSubcategoryType, string> = { 0: "Neuvedeno", 37: "Rodinný", 39: "Vila", 43: "Chalupa", 40: "Na klíč", 44: "Zemědělská usedlost", 33: "Chata", 35: "Památka/jiné", 54: "Vícegenerační dům" };
export type HouseSubcategoryType = typeof HouseSubcategoryCodes[number];
export enum HouseSubcategory {
    "not-present" = 0,
    "rodinne-domy" = 37,
    "vily" = 39,
    "chalupy" = 43,
    "chaty" = 33,
    "pamatky-jine" = 35,
    "projekty-na-klic" = 40,
    "zemedelske-usedlosti" = 44,
    "vicegeneracni-domy" = 54,
}


export const CommercialSubcategoryCodes = [0, 25, 26, 28, 29, 27, 30, 31, 38, 57, 56, 32];
export type CommercialSubcategoryType = typeof CommercialSubcategoryCodes[number];
export const CommercialSubcategoryLabels: Record<CommercialSubcategoryType, string> = {
    0: "Neuvedeno",
    25: "Kanceláře",
    26: "Sklady",
    28: "Obchodní prostory",
    29: "Ubytování",
    27: "Výroba",
    30: "Restaurace",
    31: "Zemědělský",
    38: "Činžovní dům",
    57: "Apartmány",
    56: "Ordinace",
    32: "Ostatní",
};
export enum CommercialSubcategory {
    "not-present" = 0,
    "kancelare" = 25,
    "sklady" = 26,
    "vyrobni-prostory" = 27,
    "obchodni-prostory" = 28,
    "ubytovani" = 29,
    "restaurace" = 30,
    "zemedelske-objekty" = 31,
    "cinzovni-domy" = 38,
    "virtualni-kancelare" = 49,
    "ordinace" = 56,
    "apartmany" = 57,    
    "ostatni-komercni-prostory" = 32,
}

export const OtherSubcategoryCodes = [34, 52, 53, 51, 36, 50];
export const OtherSubcategoryLabels: Record<OtherSubcategoryType, string>  = { 0: "Neuvedeno", 34: "Garáž", 52: "Garážové stání", 53: "Mobilheim", 51: "Půdní prostor", 36: "Ostatní", 50: "Vinný sklep" };
export type OtherSubcategoryType = typeof OtherSubcategoryCodes[number];
export enum OtherSubcategory {
    "not-present" = 0,
    "garaze" = 34,
    "garazova-stani" = 52,
    "vinne-sklepy" = 50,
    "pudni-prostory" = 51,
    "mobilheimy" = 53,
    "jine-nemovitosti" = 36,
}

export type SubcategoryType = ApartmentSubcategoryType | HouseSubcategoryType | CommercialSubcategoryType | ParcelSubcategoryType | OtherSubcategoryType;

export const SubcategoryCodes = {
    [Property.apartment]: ApartmentSubcategoryCodes,
    [Property.house]: HouseSubcategoryCodes,
    [Property.commercial]: CommercialSubcategoryCodes,
    [Property.parcel]: ParcelSubcategoryCodes,
    [Property.other]: OtherSubcategoryCodes,
}

export const SubcategoryAllCodes = [
    ...ApartmentSubcategoryCodes,
    ...HouseSubcategoryCodes,
    ...CommercialSubcategoryCodes,
    ...ParcelSubcategoryCodes,
    ...OtherSubcategoryCodes,
];

export const SubcategoryLabels : { [key in PropertyType] : Record<number, string>} = {
    [Property.apartment]: ApartmentSubcategoryLabels,
    [Property.house]: HouseSubcategoryLabels,
    [Property.commercial]: CommercialSubcategoryLabels,
    [Property.parcel]: ParcelSubcategoryLabels,
    [Property.other]: OtherSubcategoryLabels,
}
