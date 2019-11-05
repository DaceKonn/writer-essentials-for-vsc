import * as vscode from 'vscode';

export class StatisticsEntry extends vscode.TreeItem {

    key: string;
    value: string | number | boolean | Date;
    subCollection: Array<StatisticsEntry> | undefined;


    constructor(key: string, value: string | number | boolean | Date, subCollection?: Array<StatisticsEntry>, isSection?: boolean, state?: vscode.TreeItemCollapsibleState) {
        super(isSection === true ? key : key+': '+value, 
            subCollection !== undefined ? (state === undefined ? vscode.TreeItemCollapsibleState.Expanded : vscode.TreeItemCollapsibleState.Collapsed) : vscode.TreeItemCollapsibleState.None);
        this.key = key;
        this.value = value;
        this.subCollection = subCollection;
    }
}