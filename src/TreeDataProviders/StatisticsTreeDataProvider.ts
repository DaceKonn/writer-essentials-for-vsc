import * as vscode from 'vscode';
import * as dateformat from 'dateformat';
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
            var wordCounter = new WordCounter();
            let editor = vscode.window.activeTextEditor;

            if (!editor) {
                console.log("!editor");
              //  this._statusBarItem.hide();
                return;
            }

            var history = wordCounter.loadFileCountHistory(editor.document);

            var out: StatisticsEntry[] = [];
            var count = wordCounter.updateWordCount();
            var sub: StatisticsEntry[] = [];

            var wc = new StatisticsEntry('Word count', count.wordCount, history.map(value => new StatisticsEntry(dateformat(value.date, 'yyyy-mm-dd HH:MM'), value.wordCount)), undefined,vscode.TreeItemCollapsibleState.Collapsed);
            var cc = new StatisticsEntry('Character count', count.characterCount, history.map(value => new StatisticsEntry(dateformat(value.date, 'yyyy-mm-dd HH:MM'), value.charCount)), undefined,vscode.TreeItemCollapsibleState.Collapsed);

            sub.push(wc);
            sub.push(cc);
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