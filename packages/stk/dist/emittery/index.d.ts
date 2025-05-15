import type { EventName, OmnipresentEventData, DebugOptions, Options, UnsubscribeFunction, EmitteryOncePromise } from './types';
declare const listenerAdded: unique symbol;
declare const listenerRemoved: unique symbol;
export default class Emittery<EventData = Record<EventName, any>, AllEventData = EventData & OmnipresentEventData> {
    static readonly listenerAdded: typeof listenerAdded;
    static readonly listenerRemoved: typeof listenerRemoved;
    debug: DebugOptions<EventData>;
    static get isDebugEnabled(): boolean;
    static set isDebugEnabled(newValue: boolean);
    constructor(options?: Options<EventData>);
    logIfDebugEnabled(type: string, eventName: EventName, eventData: any): void;
    on<Name extends keyof AllEventData>(eventNames: Name | readonly Name[], listener: (eventData: AllEventData[Name]) => any | Promise<any>): UnsubscribeFunction;
    off<Name extends keyof AllEventData>(eventNames: Name | readonly Name[], listener: (eventData: AllEventData[Name]) => any | Promise<any>): void;
    once<Name extends keyof AllEventData>(eventNames: Name | readonly Name[]): EmitteryOncePromise<AllEventData[Name]>;
    events<Name extends keyof EventData>(eventNames: Name | Name[]): {
        next(): Promise<any>;
        return(value: any): Promise<{
            done: boolean;
            value: any;
        } | {
            done: boolean;
            value?: undefined;
        }>;
        [Symbol.asyncIterator](): any;
    };
    emit(eventName: EventName, eventData?: any): Promise<any>;
    emitSerial(eventName: EventName, eventData?: any): Promise<any>;
    onAny(listener: (eventName: keyof EventData, eventData: EventData[keyof EventData]) => void | Promise<void>): UnsubscribeFunction;
    anyEvent(): {
        next(): Promise<any>;
        return(value: any): Promise<{
            done: boolean;
            value: any;
        } | {
            done: boolean;
            value?: undefined;
        }>;
        [Symbol.asyncIterator](): any;
    };
    offAny(listener: (eventName: keyof EventData, eventData: EventData[keyof EventData]) => void | Promise<void>): void;
    clearListeners(eventNames?: EventName | EventName[]): void;
    listenerCount(eventNames?: EventName | EventName[]): number;
    bindMethods(target: Record<string, unknown>, methodNames?: readonly string[]): void;
}
export {};
