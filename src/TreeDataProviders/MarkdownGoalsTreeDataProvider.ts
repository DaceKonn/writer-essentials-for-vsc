import * as vscode from 'vscode'

export class MarkdownGoalsTreeDataProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<vscode.TreeItem | null> = new vscode.EventEmitter<vscode.TreeItem | null>();
	readonly onDidChangeTreeData: vscode.Event<vscode.TreeItem | null> = this._onDidChangeTreeData.event;

    constructor(private context: vscode.ExtensionContext) {
        console.log('constructor');
	}

	refresh(): void {
        console.log('refresh');
		this._onDidChangeTreeData.fire();
	}
    getChildren(element?: vscode.TreeItem | undefined): vscode.ProviderResult<vscode.TreeItem[]> {
        console.log('getChildren');
        if (element === undefined)
        {
            return markdownFrontMatterReader.getFrontMatterFromTemp();
        }
        else {
            if (element.subCollection !== undefined) {
                return element.subCollection;
            }
            return [];
        }
    }

    getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
        console.log('getTreeItem');
		return element;
	}
}