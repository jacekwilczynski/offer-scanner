import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export interface NewOffer {
    url: string;
    title: string;
}

@Entity()
export class Offer implements NewOffer {
    @PrimaryGeneratedColumn({ name: 'id' })
    private id?: number;

    private _url: string = undefined as any;
    private _title: string = undefined as any;
    private _createdAt: Date = undefined as any;
    private _updatedAt: Date = undefined as any;

    /** Only for the ORM; leads to the "undefined as any" default property values to satisfy TypeScript */
    private constructor() {
    }

    static create({ url, title }: NewOffer) {
        const instance = new Offer();
        const now = new Date();
        instance._url = url;
        instance._title = title;
        instance._createdAt = now;
        instance._updatedAt = now;

        return instance;
    }

    @Column({ name: 'url' })
    get url(): string {
        return this._url;
    }

    set url(value: string) {
        this._updatedAt = new Date();
        this._url = value;
    }

    @Column({ name: 'title' })
    get title(): string {
        return this._title;
    }

    set title(value: string) {
        this._updatedAt = new Date();
        this._title = value;
    }

    @Column({ name: 'created_at' })
    get createdAt(): Date {
        return this._createdAt;
    }

    /** Only for the ORM */
    private set createdAt(value: Date) {
        this._createdAt = value;
    }

    @Column({ name: 'updated_at' })
    get updatedAt(): Date {
        return this._updatedAt;
    }

    /** Only for the ORM */
    private set updatedAt(value: Date) {
        this._updatedAt = value;
    }
}
