import * as vscode from 'vscode';

export class StatisticsEntry extends vscode.TreeItem {

    key: string;
    value: string | number | boolean | Date;
    subCollection: Array<StatisticsEntry> | undefined;


    constructor(key: string, value: string | number | boolean | Date, subCollection?: Array<StatisticsEntry>, isSection?: boolean) {
        super(isSection === true ? key : key+': '+value, 
            subCollection !== undefined ? vscode.TreeItemCollapsibleState.Expanded : vscode.TreeItemCollapsibleState.None);
        this.key = key;
        this.value = value;
        this.subCollection = subCollection;
    }
}