import EventEmitter from 'node:events';
import { createReadStream } from 'node:fs';
import { FileReaderInterface } from './interface/file-reader.interface';

const CHANG_SIZE = 16384;

export default class TSVFileReader
    extends EventEmitter
    implements FileReaderInterface
{
    constructor(public fileName: string) {
        super();
    }

    public async read(): Promise<void> {
        const stream = createReadStream(this.fileName, {
            highWaterMark: CHANG_SIZE,
            encoding: 'utf-8',
        });

        let data = '';
        let nextLinePosition = -1;
        let lineCount = 0;

        for await (const chang of stream) {
            data += chang;

            while ((nextLinePosition = data.indexOf('\n')) >= 0) {
                const completeRow = data.slice(0, nextLinePosition);
                data = data.slice(++nextLinePosition);
                lineCount++;

                await new Promise(resolve => {
                    this.emit('line', completeRow, resolve);
                });
            }

            this.emit('end', lineCount);
        }
    }
}
