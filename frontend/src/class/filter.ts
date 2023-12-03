export class Filter<T> {
    private data = new Set<T>();

    reset(): void {
        this.data.clear();
    }

    add(identifier: T): void {
        this.data.add(identifier);
    }

    remove(identifier: T): void {
        this.data.delete(identifier);
    }

    set(identifier: T, value: boolean): void {
        if (value) {
            this.add(identifier);
        } else {
            this.remove(identifier);
        }
    }

    get(identifier: T): boolean {
        return this.data.has(identifier);
    }

    asArray(): Array<T> {
        return Array.from(this.data);
    }
}
