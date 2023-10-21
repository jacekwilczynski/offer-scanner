import { AsyncTypedEventEmitter } from 'src/utils/EventEmitter';
import { ListingToNotifyAbout } from 'src/application/interfaces/Notifier';

export type EventMap = {
    'notification sent': [ListingToNotifyAbout[]],
    // Node.js built-in, see https://nodejs.org/api/events.html#capture-rejections-of-promises
    'error': [Error];
}

export type AppEventEmitter = AsyncTypedEventEmitter<EventMap>;
