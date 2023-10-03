import { mock } from 'jest-mock-extended';
import { HttpClient } from 'src/application/interfaces/HttpClient';
import { DomOverHttpSource } from 'src/application/services/offer-importer/sources/DomOverHttpSource';
import { Offer } from 'src/model/Offer';

describe(DomOverHttpSource.name, () => {
    const httpClient = mock<HttpClient>();
    const urlRegex = new RegExp('^https://olx.pl/');

    const source = new DomOverHttpSource(
        httpClient,
        {
            urlRegex,
            selectors: {
                wrapperSelector: '[data-cy="l-card"]',
                linkSelector: 'a',
                titleSelector: 'h6',
            },
        },
    );

    it('should fetch and parse offers from supported URL', async () => {
        // given
        httpClient
            .fetchText
            .mockResolvedValueOnce(`
<div data-cy="l-card">
    <a href="https://olx.pl/offers/first">
        <h6>First</h6>
        <p>2023-09-29</p>
    </a>
</div>
<div data-cy="l-card">
    <!-- note the relative URL -->
    <a href="/offers/second">(title placed outside the anchor just for test)</a>
    <h6>Second</h6>
    <p>2023-09-28</p>
</div>
`);

        // when
        const offers = await source.fetchOffers('https://olx.pl/listing');

        // then
        expect(httpClient.fetchText).toHaveBeenCalledTimes(1);
        expect(httpClient.fetchText).toHaveBeenCalledWith('https://olx.pl/listing');

        expect(offers).toEqual([
            { url: 'https://olx.pl/offers/first', title: 'First' },
            { url: 'https://olx.pl/offers/second', title: 'Second' },
        ] satisfies Offer[]);
    });

    it('should throw if asked to fetch from unsupported URL', () => {
        expect(() => source.fetchOffers('https://wut.xd'))
            .toThrow(new RegExp('https://wut.xd'));
    });

    it.each([
        'https://olx.pl/',
        'https://olx.pl/abc?def=ghi',
    ])(`supports %s if regex is ${urlRegex}`, (url) => {
        expect(source.supports(url)).toBe(true);
    });

    it.each([
        'https://another-site.com/',
        'https://aolx.pl/',
        'https://sthelse/olx.pl/x',
        'ftp://olx.pl/',
        'olx.pl/',
    ])(`does not support %s if regex is ${urlRegex}`, (url) => {
        expect(source.supports(url)).toBe(false);
    });
});
