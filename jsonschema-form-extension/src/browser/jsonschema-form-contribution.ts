import { injectable, inject } from "inversify";
import { CommandContribution, CommandRegistry, MenuContribution, MenuModelRegistry, MessageService, SelectionService } from "@theia/core/lib/common";
import { CommonMenus, KeybindingContribution, KeybindingRegistry, WidgetManager, ApplicationShell } from "@theia/core/lib/browser";
import { UriAwareCommandHandler } from "@theia/core/lib/common/uri-command-handler";
import { ListFilesService } from "../common/list-files";
import { ListFilesWidget } from "./listfiles-widget";

export const JsonschemaFormCommand = {
    id: 'JsonschemaForm.command',
    label: "Shows a message"
};

export const ListFilesCommand = {
    id: 'Arduino.ListFiles',
    label: 'List all files'
};

@injectable()
export class JsonschemaFormCommandContribution implements CommandContribution {

    constructor(
        @inject(MessageService) private readonly messageService: MessageService,
        @inject(SelectionService) private readonly selectionService: SelectionService,
        @inject(ListFilesService) private readonly listFilesService: ListFilesService,
        @inject(WidgetManager) private readonly widgetManager: WidgetManager,
        @inject(ApplicationShell) private readonly applicationShell: ApplicationShell,
    ) { }

    registerCommands(registry: CommandRegistry): void {
        registry.registerCommand(JsonschemaFormCommand, {
            execute: () => this.messageService.info('Hello World!')
        });

        registry.registerCommand(ListFilesCommand, new UriAwareCommandHandler(this.selectionService, {
            execute: async uri => {
                const files = await this.listFilesService.get(uri.toString());
                // this.messageService.info(files.join('\n'));
                const widget = await this.widgetManager.getOrCreateWidget<ListFilesWidget>(ListFilesWidget.id);
                if(!widget.isAttached) {
                    this.applicationShell.addWidget(widget, {area: 'right'});
                }
                this.applicationShell.revealWidget(widget.id);
                widget.updateList(files);
            }
        }));
    }
}

@injectable()
export class JsonschemaFormMenuContribution implements MenuContribution {

    registerMenus(menus: MenuModelRegistry): void {
        menus.registerMenuAction(CommonMenus.EDIT_FIND, {
            commandId: JsonschemaFormCommand.id,
            label: 'Say Hello'
        });

        menus.registerMenuAction(CommonMenus.EDIT_FIND, {
            commandId: ListFilesCommand.id,
            label: ListFilesCommand.label
        });
    }
}

@injectable()
export class JsonschemaKeybindingContribution implements KeybindingContribution {
    registerKeybindings(keybindings: KeybindingRegistry): void {
        keybindings.registerKeybinding({
            command: ListFilesCommand.id,
            keybinding: 'alt+shift+l'
        })
    }
}