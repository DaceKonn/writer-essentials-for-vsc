import * as vscode from 'vscode';
import { FrontMatterEntry } from "../Models/FrontMatterEntry";
import { markdownFrontMatterReader } from '../extension';

export class MarkdownFrontMatterTreeDataProvider implements vscode.TreeDataProvider<FrontMatterEntry> {
    private _onDidChangeTreeData: vscode.EventEmitter<FrontMatterEntry | null> = new vscode.EventEmitter<FrontMatterEntry | null>();
	readonly onDidChangeTreeData: vscode.Event<FrontMatterEntry | null> = this._onDidChangeTreeData.event;

    constructor(private context: vscode.ExtensionContext) {
	}

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}
    getChildren(element?: FrontMatterEntry | undefined): vscode.ProviderResult<FrontMatterEntry[]> {
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

    getTreeItem(element: FrontMatterEntry): vscode.TreeItem {
		return element;
	}
}