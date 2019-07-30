export const ListFilesService = Symbol('ListFilesService');
export interface ListFilesService {
    get(filesNames: string): Promise<string[]>;
}
export const ListFilesServicePath = '/services/list-files-service';