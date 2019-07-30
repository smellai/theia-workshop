import * as React from "react";
import { injectable } from "inversify";
import { ReactWidget } from "@theia/core/lib/browser";

export interface FileItem {
    name: string
}

export class FileListItem extends React.Component<FileItem> {
    render(): JSX.Element {
        return <li className="file-item">{this.props.name}</li>;
    }
}

@injectable()
export class ListFilesWidget extends ReactWidget {

    static id = 'list-files-widget';

    constructor() {
        super();
        this.id = ListFilesWidget.id;
        this.title.label = 'File List';
        this.title.icon = 'fa fa-list-alt';
    }

    protected files: ListFilesWidget.Props = {list: []};

    updateList(newList:string[]) {
        this.files = {list: newList};
        this.update();
    }

    render(): React.ReactNode {
        return (<ul className="file-list">
            {this.files.list.map((file, index) => {
                return <FileListItem key={index} name={file}/>;
            })}
        </ul>);
    }
}

export namespace ListFilesWidget {

    /**
     * Props for customizing the abstract list widget.
     */
    export interface Props {
        readonly list: string[];
    }
}
