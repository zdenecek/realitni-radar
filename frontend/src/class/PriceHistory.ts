export type PriceHistory = Record<string, number>;

export default class PriceHistoryHelper {
    private static today(): Date {
        return new Date(Date.now());
    }

    private static stringifyDate(date: Date): string {
        return date.toISOString().split("T")[0];
    }

    static normalize(data: PriceHistory, deleted: Date | string | undefined): PriceHistory {
        // add price for today to have at least two entries
        const dataCopy = { ...data };

        // sort just in case
        const ordered = Object.keys(dataCopy)
            .sort()
            .reduce((obj, key) => {
                obj[key] = dataCopy[key];
                return obj;
            }, {} as Record<string, number>);

        const lastDate = (() => {
            if (!deleted) return PriceHistoryHelper.stringifyDate(PriceHistoryHelper.today());
            else if (typeof deleted === "string") return deleted;
            else return PriceHistoryHelper.stringifyDate(deleted);
        })();

        const values = Object.values(ordered);
        ordered[lastDate] = values[values.length - 1];

        return ordered;
    }
}
