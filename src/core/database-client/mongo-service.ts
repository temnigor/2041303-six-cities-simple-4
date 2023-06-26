import { DatabaseClientInterface } from './database-client.interface';
import { inject, injectable } from 'inversify';
import { AppComponent } from '../../enum/app-component.enum.js';
import mongoose, { Mongoose } from 'mongoose';
import { LoggerInterface } from '../../app/logger/loger.interface';

const RETRY_COUNT = 5;
const RETRY_TIMEOUT = 1000;

@injectable()
export class MongoService implements DatabaseClientInterface {
    private connectStatus = false;
    private mongooseInstants: Mongoose | null = null;
    constructor(
        @inject(AppComponent.LoggerInterface) private logger: LoggerInterface,
    ) {}

    private async _connect(url: string): Promise<void> {
        this.mongooseInstants = await this._connectWithRetry(url);
        this.connectStatus = true;
    }

    private async _disconnect(): Promise<void> {
        await this.mongooseInstants?.disconnect();
        this.connectStatus = false;
    }

    private async _connectWithRetry(uri: string): Promise<Mongoose> {
        let attempt = 0;
        while (attempt < RETRY_COUNT) {
            try {
                return await mongoose.connect(uri);
            } catch (error) {
                attempt++;
                this.logger.error(
                    `Failed to connect to the database. Attempt ${attempt}`,
                );
                await setTimeout(
                    () => this.logger.info('try reconnect...'),
                    RETRY_TIMEOUT,
                );
            }
        }

        this.logger.error(
            `Unable to establish database connection after ${attempt}`,
        );
        throw new Error('Failed to connect to the database');
    }

    public async connect(uri: string): Promise<void> {
        if (this.connectStatus) {
            throw new Error('MongoDB client already connected');
        }

        this.logger.info('Trying to connect to MongoDB…');
        await this._connect(uri);
        this.logger.info('Database connection established.');
    }

    public async disconnect(): Promise<void> {
        if (!this.connectStatus) {
            throw new Error('Not connected to the database');
        }

        await this._disconnect();
        this.logger.info('Database connection closed.');
    }
}
