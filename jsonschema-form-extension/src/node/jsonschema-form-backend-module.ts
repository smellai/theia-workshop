import { ConnectionContainerModule } from '@theia/core/lib/node/messaging/connection-container-module';
import { ListFilesServiceImpl } from './list-files-impl';
import { ListFilesService, ListFilesServicePath } from '../common/list-files';
import { ContainerModule } from 'inversify';

export default new ContainerModule((bind) => {
    const listFilesServiceConnectionModule = ConnectionContainerModule.create(({ bind, bindBackendService }) => {
        bind(ListFilesServiceImpl).toSelf().inSingletonScope();
        bind(ListFilesService).toService(ListFilesServiceImpl);
        bindBackendService(ListFilesServicePath, ListFilesService);
    });
    bind(ConnectionContainerModule).toConstantValue(listFilesServiceConnectionModule);
})
