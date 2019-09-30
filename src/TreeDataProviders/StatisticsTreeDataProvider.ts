import * as vscode from 'vscode';
import { markdownFrontMatterReader } from '../extension';
import { WordCounter } from '../Helpers/WordCounter';
import { StatisticsEntry } from '../Models/StatisticsEntry';

export class StatisticsTreeDataProvider implements vscode.TreeDataProvider<StatisticsEntry> {
    private _onDidChangeTreeData: vscode.EventEmitter<StatisticsEntry | null> = new vscode.EventEmitter<StatisticsEntry | null>();
	readonly onDidChangeTreeData: vscode.Event<StatisticsEntry | null> = this._onDidChangeTreeData.event;

    constructor(private context: vscode.ExtensionContext) {
	}

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}
    getChildren(element?: StatisticsEntry | undefined): vscode.ProviderResult<StatisticsEntry[]> {
        if (element === undefined)
        {
            var out: StatisticsEntry[] = [];
            var count = new WordCounter().updateWordCount();
            var sub: StatisticsEntry[] = [];
            sub.push(new StatisticsEntry('Word count', count));
            out.push(new StatisticsEntry('File', '', sub, true));
            return out;
        }
        else {

            return element.subCollection;
        }
    }

    getTreeItem(element: StatisticsEntry): vscode.TreeItem {
		return element;
	}
}