
import { injectable } from 'inversify';
import { ListFilesService } from '../common/list-files';
import {readdir, existsSync, lstatSync} from 'fs';
import URI from '@theia/core/lib/common/uri';

@injectable()
export class ListFilesServiceImpl implements ListFilesService {
    get(uri: string): Promise<string[]> {
        const dir = new URI(uri).path.toString();
        let isDirExists = existsSync(dir) && lstatSync(dir).isDirectory();

        console.log(`================${dir}`);
        return new Promise((resolve, reject) => {
            if (!isDirExists) {
                return resolve(['this is not a directory']);
            }

            readdir(dir, (err, files) => {
                if (err) {
                    reject(err);
                    return;
                }
                return resolve(files);
            });
        });
    }
}
