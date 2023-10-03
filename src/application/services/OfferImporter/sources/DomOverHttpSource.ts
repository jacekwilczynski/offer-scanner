import * as assert from 'assert';
import { JSDOM } from 'jsdom';
import { OfferSource } from 'src/application/services/OfferImporter/sources/OfferSource';
import { Offer } from 'src/model/Offer';
import { HttpClient } from 'src/application/interfaces/HttpClient';

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
        const offerWrappers = [...document.querySelectorAll(this.config.selectors.wrapperSelector)];

        return offerWrappers.map(wrapper => ({
            url: this.extractUrl(wrapper, schemeAndDomain),
            title: this.extractTitle(wrapper),
        }));
    }

    private async loadDocument(listingUrl: string) {
        const html = await this.httpClient.fetchText(listingUrl);

        return new JSDOM(html).window.document;
    }

    private extractUrl(wrapper: Element, schemeAndDomain: string) {
        const link = wrapper.querySelector(this.config.selectors.linkSelector);
        assert(link && 'href' in link && typeof link.href === 'string', 'Offer link not found.');

        return link.href.startsWith('/')
            ? schemeAndDomain + link.href.slice(1)
            : link.href;
    }

    private extractTitle(wrapper: Element) {
        const title = wrapper.querySelector(this.config.selectors.titleSelector)?.textContent;
        assert(title != null, 'Offer title not found.');

        return title;
    }
}

export type DomOverHttpSourceConfig = {
    urlRegex: RegExp;
    selectors: OfferSelectors;
}

export type OfferSelectors = {
    wrapperSelector: string;
    linkSelector: string;
    titleSelector: string;
}

function getUrlBase(url: string) {
    const urlObject = new URL(url);
    urlObject.pathname = '';
    urlObject.hash = '';
    urlObject.search = '';

    return urlObject.toString();
}
