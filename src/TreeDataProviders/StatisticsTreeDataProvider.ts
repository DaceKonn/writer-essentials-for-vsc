import * as vscode from 'vscode';
import * as dateformat from 'dateformat';
import { WordCounter } from '../Helpers/WordCounter';
import { StatisticsEntry } from '../Models/StatisticsEntry';
import { compareValues } from '../Helpers/DynamicCompare';

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
            let editor = vscode.window.activeTextEditor;

            if (!editor) {
                console.log("!editor");
              //  this._statusBarItem.hide();
                return;
            }

            var out: StatisticsEntry[] = [];
            var count = WordCounter.wordCount.characterCount === 0 ? WordCounter.updateWordCount() : WordCounter.wordCount;
            var sub: StatisticsEntry[] = [];

            var wc: StatisticsEntry;
            var cc:StatisticsEntry;

            if (editor.document.uri.path.indexOf('/Manuscripts/') !== -1) {
                var history = WordCounter.loadFileCountHistory(editor.document);

                wc = new StatisticsEntry(
                    'Word count', 
                    count.wordCount, 
                    history
                        .sort(compareValues('_date', 'desc'))
                        .map(value => 
                            new StatisticsEntry(
                                dateformat(value.date, 'yyyy-mm-dd HH:MM'), 
                                this.formatCountHistoryEntry(value.wordCount, value.wordDiff)
                                )
                            ), 
                    undefined,
                    vscode.TreeItemCollapsibleState.Collapsed);
                cc = new StatisticsEntry(
                    'Character count', 
                    count.characterCount, 
                    history
                        .sort(compareValues('_date', 'desc'))
                        .map(value => 
                            new StatisticsEntry(
                                dateformat(value.date, 'yyyy-mm-dd HH:MM'), 
                                this.formatCountHistoryEntry(value.charCount, value.charDiff)
                                )
                            ), 
                    undefined,vscode.TreeItemCollapsibleState.Collapsed);
            }
            else {
                wc = new StatisticsEntry('Word count', count.wordCount);
                cc = new StatisticsEntry('Character count', count.characterCount);
            }
            
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
    
    formatCountHistoryEntry(value: number, diff: number) {
        if (diff === undefined) {
            return value + ' (---)';
        }
        return value + ' (' + (diff > 0 ? '+' : '') + diff+')';
    }
}