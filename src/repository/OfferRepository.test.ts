import { beforeEach, describe, expect, it } from '@jest/globals';
import { Repository } from 'typeorm';
import { useDatabase } from 'src/testing/composables';
import * as services from 'src/services';
import { Offer } from 'src/entity/Offer';

describe('Repository<Offer>', () => {
    useDatabase();

    let repository: Repository<Offer>;

    beforeEach(async () => {
        repository = await services.offerRepository();
        await repository.clear();
        expect(await repository.find()).toEqual([]);
    });

    it('can create and read an offer', async () => {
        const createdOffer = Offer.create({
            url: 'https://offers.com/1',
            title: 'Great thing!',
        });
        await repository.save(createdOffer);

        expect(await repository.find()).toEqual([createdOffer]);
        expect(await repository.findOneBy({ url: 'https://offers.com/1' })).toEqual(createdOffer);
        expect(await repository.findOneBy({ url: 'https://offers.com/2' })).toBeNull();
    });

    it('can update an offer', async () => {
        const firstOffer = Offer.create({
            url: 'https://offers.com/1',
            title: 'one',
        });
        const secondOffer = Offer.create({
            url: 'https://offers.com/2',
            title: 'two',
        });

        await repository.save([firstOffer, secondOffer]);

        let [firstFound, secondFound] = await repository.find();
        expect(firstFound).toHaveProperty('title', 'one');
        expect(secondFound).toHaveProperty('title', 'two');

        secondOffer.title = '222';
        await repository.save(secondOffer);

        [firstFound, secondFound] = await repository.find();
        expect(firstFound).toHaveProperty('title', 'one');
        expect(secondFound).toHaveProperty('title', '222');
    });
});
