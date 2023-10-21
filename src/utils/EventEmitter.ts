import * as EventEmitter from 'events';

type EventName = string | symbol;
type HandlerParameters = unknown[];

export interface TypedEventEmitter<TEvents extends Record<EventName, HandlerParameters>> {
    addListener<TName extends keyof TEvents>(eventName: TName, listener: (...args: TEvents[TName]) => void): this;

    on<TName extends keyof TEvents>(eventName: TName, listener: (...args: TEvents[TName]) => void): this;

    once<TName extends keyof TEvents>(eventName: TName, listener: (...args: TEvents[TName]) => void): this;

    removeListener<TName extends keyof TEvents>(eventName: TName, listener: (...args: TEvents[TName]) => void): this;

    off<TName extends keyof TEvents>(eventName: TName, listener: (...args: TEvents[TName]) => void): this;

    removeAllListeners(event?: EventName): this;

    setMaxListeners(n: number): this;

    getMaxListeners(): number;

    listeners(eventName: EventName): Function[];

    rawListeners(eventName: EventName): Function[];

    emit<TName extends keyof TEvents>(eventName: TName, ...args: TEvents[TName]): boolean;

    listenerCount(eventName: EventName): number;

    prependListener<TName extends keyof TEvents>(eventName: TName, listener: (...args: TEvents[TName]) => void): this;

    prependOnceListener<TName extends keyof TEvents>(eventName: TName, listener: (...args: TEvents[TName]) => void): this;

    eventNames(): EventName[];
}

export interface AsyncTypedEventEmitter<TEvents extends Record<EventName, HandlerParameters>> extends TypedEventEmitter<TEvents> {
    emitAsync<TName extends keyof TEvents>(eventName: TName, ...args: TEvents[TName]): Promise<boolean>;
}

export class AsyncEventEmitter extends EventEmitter {
    async emitAsync(eventName: EventName, ...args: unknown[]) {
        const listeners = this.listeners(eventName);
        if (listeners.length < 1) {
            return false;
        }

        for (const listener of listeners) {
            listener(...args);
        }

        return true;
    }
}
