import { DealType, SubcategoryType, PropertyType, OwnershipType } from "./types";

export default interface Listing {
  _id: string;
  prop: PropertyType;
  deal: DealType;
  sub: SubcategoryType;
  ownership: OwnershipType;
  apiUrl: URL;
  url: URL;
  id: string;
  meta: string;
  title: string;
  description: string;
  price: number;
  priceUnit?: string;
  address: string;
  location: {
    type: string;
    coordinates: [number, number]
  };
  images:  Array<{self: URL, gallery: URL, view: URL}>;
  items: Record<string, string | number | boolean>;
  // items: {
  //   Celková cena: 4800000;
  //   ID zakázky: B50077083;
  //   Aktualizace: 06.01.2023;
  //   Stavba: Panelová;
  //   Stav objektu: Velmi dobrý;
  //   Vlastnictví: Osobní;
  //   Podlaží: 8. podlaží z celkem 8;
  //   Plocha podlahová: 67;
  //   Lodžie: true;
  //   Sklep: true;
  //   Topení: Ústřední dálkové;
  //   Energetická náročnost budovy: Třída C - Úsporná;
  //   Bezbariérový: true;
  //   Výtah: true
  // };
  usableArea?: number;
  pricePerMeter?: number;
  pricePerMeterSource?: number;
  priceHistory: Record<string, number>;
  lastUpdate: Date;
  inserted: Date;
  priceDropPercent: number;
  priceDropCzk: number;
  locality: {
    id: number;
    name: string
    };
  deleted?: Date
}