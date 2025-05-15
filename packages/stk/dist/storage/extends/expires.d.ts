import { ExpiresType } from '@/storage/shared';
export declare function setExpires(target: object, property: string, value: ExpiresType, receiver: any): Date;
export declare function getExpires(target: object, property: string): Date;
export declare function removeExpires(target: object, property: string, receiver: any): any;
