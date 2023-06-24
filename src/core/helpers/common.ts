import crypto from 'node:crypto';

export const createSHA256 = (line: string, salt: string): string => {
    const shaHashes = crypto.createHmac('sha256', salt);
    return shaHashes.update(line).digest('hex');
};
