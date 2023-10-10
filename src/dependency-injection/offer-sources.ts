import { DomOverHttpSourceConfig } from 'src/application/services/offer-importer/sources/DomOverHttpSource';

export const offerSources: Record<string, DomOverHttpSourceConfig> = {
    'olx.pl': {
        urlRegex: new RegExp('^(https?://)?[^]*olx.pl/'),
        selectors: {
            wrapper: '[data-cy="l-card"]',
            link: 'a',
            title: 'h6',
            detailSelector: '[data-cy="ad_description"]',
        },
    },
    'otodom.pl': {
        urlRegex: new RegExp('^(https?://)?[^]*otodom.pl/'),
        selectors: {
            wrapper: '[data-cy="listing-item"]',
            link: '[data-cy="listing-item-link"]',
            title: '[data-cy="listing-item-title"]',
            detailSelector:
                '[data-testid="ad.top-information.table"],' +
                '[data-testid="content-container"],' +
                '[data-testid="ad.additional-information.table"]',
        },
    },
};
