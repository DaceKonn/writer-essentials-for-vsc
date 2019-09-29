import * as vscode from 'vscode';
import { markdownFrontMatterReader } from '../extension';
import { WordCounter } from '../Helpers/wordCounter';

export class StatisticsTreeDataProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
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
            var count = new WordCounter().updateWordCount();
            return [];
        }
        else {

            return [];
        }
    }

    getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
        console.log('getTreeItem');
        
		return element;
	}
}