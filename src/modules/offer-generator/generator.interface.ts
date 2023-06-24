import { MockData } from '../../types/mock-data.type';

export interface GeneratorInterface {
    generate(MockData: MockData): string;
}
