import {expect} from 'chai';
import { Container } from 'inversify';
import { ListFilesServiceImpl } from './list-files-impl';
import {resolve} from 'path';

describe('ListFilesServiceImpl', () => {
    function setup() {
        const container = new Container();
        container.bind(ListFilesServiceImpl).toSelf().inSingletonScope();
        return container;
    }

    it('should list directory files names', async () => {
        const impl = setup().get(ListFilesServiceImpl);
        console.log(resolve('../workspace/TestDir'));
        expect(await impl.get(resolve('../workspace/TestDir'))).to.be.an('array').that.includes('Untitled2.txt');
    });

    it('should detect no directory objects', async () => {
        const impl = setup().get(ListFilesServiceImpl);
        expect(await impl.get('fantasy-dir')).to.be.an('array').that.includes('this is not a directory');
    });
});