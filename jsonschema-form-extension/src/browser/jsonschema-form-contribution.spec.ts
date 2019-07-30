(() => {
    const g = global as any
    g.navigator = {
        platform: '',
        userAgent: ''
    };
    g.document = {
        createElement: () => null,
        queryCommandSupported: () => false,
        documentElement: {
            style: {}
        }
    };
    g.window = {}
    class Element {}
    g.Element = Element;
})();

import { expect } from 'chai';
import { Container } from 'inversify';
import { JsonschemaFormCommandContribution } from './jsonschema-form-contribution';
import { MessageService, SelectionService, Command, CommandHandler } from '@theia/core';
import URI from '@theia/core/lib/common/uri';
import { ApplicationShell, WidgetManager } from '@theia/core/lib/browser';
import { ListFilesService } from '../common/list-files';

describe('JsonschemaFormCommandContribution', () => {
    function setup(selectionUri:string, result:string[], state:any) {
        const container = new Container();
        container.bind(JsonschemaFormCommandContribution).toSelf().inSingletonScope();
        container.bind(MessageService).toConstantValue({} as any);
        container.bind(SelectionService).toConstantValue({selection: {uri: new URI(selectionUri)}} as any);
        container.bind(ListFilesService).toConstantValue({get: () => Promise.resolve(result)});
        container.bind(ApplicationShell).toConstantValue({addWidget: ()=>{}, revealWidget: ()=>{}} as any);
        container.bind(WidgetManager).toConstantValue({getOrCreateWidget: () => ({
            updateList: (files:string[]) => {
                console.log(`=========${files}`);
                state.files = files;
            }
        })} as any);

        return container;
    }
    it('should pass to widget manager the same array provided by ListFilesService', async () => {
        const state = {files: []};
        const mockedList = ['Untitled1'];
        const impl = setup('ciao', mockedList, state).get(JsonschemaFormCommandContribution);
        const commands: {command: Command, handler: CommandHandler}[] = [];
        impl.registerCommands({registerCommand: (command: Command, handler: CommandHandler) => {
            commands.push({command, handler})
        }} as any);
        const fileListCommand = commands.find(command => command.command.id === 'Arduino.ListFiles');
        expect(fileListCommand).to.not.be.undefined;
        await fileListCommand!.handler.execute();
        expect(state.files).to.eql(mockedList);
    });
});