export interface LoggerInterface {
    info(massage: string, ...arg: unknown[]): void;
    error(massage: string, ...arg: unknown[]): void;
    warn(massage: string, ...arg: unknown[]): void;
    debug(massage: string, ...arg: unknown[]): void;
}
