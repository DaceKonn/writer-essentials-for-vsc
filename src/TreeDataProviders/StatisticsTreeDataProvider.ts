import * as vscode from 'vscode';
import { markdownFrontMatterReader } from '../extension';
import { WordCounter } from '../Helpers/wordCounter';

export class StatisticsTreeDataProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<vscode.TreeItem | null> = new vscode.EventEmitter<vscode.TreeItem | null>();
	readonly onDidChangeTreeData: vscode.Event<vscode.TreeItem | null> = this._onDidChangeTreeData.event;

    constructor(private context: vscode.ExtensionContext) {
	}

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}
    getChildren(element?: vscode.TreeItem | undefined): vscode.ProviderResult<vscode.TreeItem[]> {
        if (element === undefined)
        {
            var out: vscode.TreeItem[] = [];
            var count = new WordCounter().updateWordCount();
            out.push(new vscode.TreeItem('File word count: '+count,vscode.TreeItemCollapsibleState.None));
            return out;
        }
        else {

            return [];
        }
    }

    getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
		return element;
	}
}