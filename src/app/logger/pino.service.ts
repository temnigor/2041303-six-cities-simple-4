import { injectable } from 'inversify';
import pino from 'pino';
import { LoggerInterface } from './loger.interfase';

@injectable()
export class PinoService {
    private readonly Logger: LoggerInterface;

    constructor() {
        this.Logger = pino();
    }

    public info(massage: string, ...arg: unknown[]) {
        this.Logger.info(massage, ...arg);
    }

    public warn(massage: string, ...arg: unknown[]) {
        this.Logger.warn(massage, ...arg);
    }

    public error(massage: string, ...arg: unknown[]) {
        this.Logger.error(massage, ...arg);
    }

    public debug(massage: string, ...arg: unknown[]) {
        this.Logger.debug(massage, ...arg);
    }
}
