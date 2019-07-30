import { JsonschemaFormCommandContribution, JsonschemaFormMenuContribution, JsonschemaKeybindingContribution } from './jsonschema-form-contribution';
import {
    CommandContribution,
    MenuContribution
} from "@theia/core/lib/common";
import { OpenHandler, WidgetFactory, WebSocketConnectionProvider, KeybindingContribution } from "@theia/core/lib/browser";
import { ContainerModule } from "inversify";
import { JsonschemaFormWidget, JsonschemaFormWidgetOptions } from './jsonschema-form-widget';
import { JsonschemaFormOpenHandler } from './jsonschema-form-open-handler';
import { ListFilesServicePath, ListFilesService } from '../common/list-files';
import { ListFilesWidget } from './listfiles-widget';

require('../../src/browser/style/list-files.css');

export default new ContainerModule(bind => {
    // add your contribution bindings here

    bind(CommandContribution).to(JsonschemaFormCommandContribution).inSingletonScope();
    bind(MenuContribution).to(JsonschemaFormMenuContribution).inSingletonScope();
    bind(KeybindingContribution).to(JsonschemaKeybindingContribution).inSingletonScope();

    bind(OpenHandler).to(JsonschemaFormOpenHandler).inSingletonScope();
    bind(WidgetFactory).toDynamicValue(({ container }) => ({
        id: JsonschemaFormWidget.id,
        createWidget: (options: JsonschemaFormWidgetOptions) => {
            const child = container.createChild();
            child.bind(JsonschemaFormWidgetOptions).toConstantValue(options);
            child.bind(JsonschemaFormWidget).toSelf();
            return child.get(JsonschemaFormWidget);
        }
    }));

    bind(WidgetFactory).toDynamicValue(({ container }) => ({
        id: ListFilesWidget.id,
        createWidget: () => {
            const child = container.createChild();
            child.bind(ListFilesWidget).toSelf();
            return child.get(ListFilesWidget);
        }
    }));

    bind(ListFilesService).toDynamicValue(context => WebSocketConnectionProvider.createProxy(context.container, ListFilesServicePath)).inSingletonScope();
});