import { createWriteStream, WriteStream } from 'node:fs';
import { FileWriterInterface } from './file-writer.interface';

const CHUNK_SIZE = 2 * 16;

export class FileWriter implements FileWriterInterface {
    private stream: WriteStream;

    constructor(readonly fileName: string) {
        this.stream = createWriteStream(this.fileName, {
            flags: 'w',
            encoding: 'utf8',
            highWaterMark: CHUNK_SIZE,
            autoClose: true,
        });
    }

    public async write(row: string): Promise<void> {
        if (!this.stream.write(`${row}\n`)) {
            return new Promise(resolve => {
                this.stream.once('drain', () => resolve());
            });
        }
        return Promise.resolve();
    }
}
