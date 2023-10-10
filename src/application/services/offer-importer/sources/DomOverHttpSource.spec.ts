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
                wrapper: '[data-cy="l-card"]',
                link: 'a',
                title: 'h6',
                detailSelector: 'h1, p',
            },
        },
    );

    it('should fetch and parse working offers from supported URL', async () => {
        // given
        httpClient.fetchText.calledWith('https://olx.pl/listing').mockResolvedValueOnce(`
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
<div data-cy="l-card">
    <a href="https://olx.pl/offers/third">
        <h6>Third</h6>
        <p>2023-09-27</p>
    </a>
</div>
`);

        httpClient.fetchText.calledWith('https://olx.pl/offers/first').mockRejectedValue(new Error('oops'));

        httpClient.fetchText.calledWith('https://olx.pl/offers/second').mockResolvedValueOnce(`
<body>
    <header>OLX</header>
    <!-- no offer details for whatever reason --> 
    <footer>Bye!</footer>
</body>
        `);

        httpClient.fetchText.calledWith('https://olx.pl/offers/third').mockResolvedValueOnce(`
<body>
    <header>OLX</header>
    <h1>Third</h1>
    <p>Lorem ipsum dolor sit amet</p>
</body>
        `);

        // when
        const offers = await source.fetchOffers('https://olx.pl/listing');

        // then
        expect(httpClient.fetchText).toHaveBeenCalledTimes(4);
        expect(httpClient.fetchText).toHaveBeenCalledWith('https://olx.pl/listing');

        expect(offers).toEqual([
            { url: 'https://olx.pl/offers/second', title: 'Second', content: '' },
            { url: 'https://olx.pl/offers/third', title: 'Third', content: '<h1>Third</h1>\n<p>Lorem ipsum dolor sit amet</p>' },
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
