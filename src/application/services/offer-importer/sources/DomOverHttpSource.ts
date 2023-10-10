import * as assert from 'assert';
import { JSDOM } from 'jsdom';
import { OfferSource } from 'src/application/services/offer-importer/sources/OfferSource';
import { Offer } from 'src/model/Offer';
import { HttpClient } from 'src/application/interfaces/HttpClient';
import { isFulfilled } from 'src/utils/type-guards';

export class DomOverHttpSource extends OfferSource {
    constructor(
        private readonly httpClient: HttpClient,
        private readonly config: DomOverHttpSourceConfig,
    ) {
        super();
    }

    supports(url: string): boolean {
        return this.config.urlRegex.test(url);
    }

    protected async _fetchOffers(listingUrl: string): Promise<Offer[]> {
        const schemeAndDomain = getUrlBase(listingUrl);
        const document = await this.loadDocument(listingUrl);
        const offerWrappers = [...document.querySelectorAll(this.config.selectors.wrapper)];

        const promises = offerWrappers.map(async (wrapper) => {
            const url = this.extractUrl(wrapper, schemeAndDomain);
            const title = this.extractTitle(wrapper);
            const document = await this.loadDocument(url);
            const content = document.querySelector(this.config.selectors.detailSelector)?.innerHTML ?? '';

            return ({ url, title, content });
        });

        const results = await Promise.allSettled(promises);

        return results.filter(isFulfilled).map(r => r.value);
    }

    private async loadDocument(url: string) {
        const html = await this.httpClient.fetchText(url);

        return new JSDOM(html).window.document;
    }

    private extractUrl(wrapper: Element, schemeAndDomain: string) {
        const link = wrapper.querySelector(this.config.selectors.link);
        assert(link && 'href' in link && typeof link.href === 'string', 'Offer link not found.');

        return link.href.startsWith('/')
            ? schemeAndDomain + link.href.slice(1)
            : link.href;
    }

    private extractTitle(wrapper: Element) {
        const title = wrapper.querySelector(this.config.selectors.title)?.textContent;
        assert(title != null, 'Offer title not found.');

        return title;
    }
}

export type DomOverHttpSourceConfig = {
    urlRegex: RegExp;
    selectors: OfferSelectors;
}

export type OfferSelectors = {
    wrapper: string;
    link: string;
    title: string;
    detailSelector: string;
}

function getUrlBase(url: string) {
    const urlObject = new URL(url);
    urlObject.pathname = '';
    urlObject.hash = '';
    urlObject.search = '';

    return urlObject.toString();
}
