import * as vscode from 'vscode';

export class FrontMatterEntry extends vscode.TreeItem {

    key: string;
    value: string | number | boolean | Date;
    subCollection: Array<FrontMatterEntry> | undefined;
    specialType: string | undefined;
    isSpecialType: boolean = this.specialType !== undefined;

    constructor(key: string, value: string | number | boolean | Date, subCollection?: Array<FrontMatterEntry>, specialType?: string) {
        super(key+': '+value, subCollection !== undefined ? vscode.TreeItemCollapsibleState.Expanded : vscode.TreeItemCollapsibleState.None);
        this.key = key;
        this.value = value;
        this.subCollection = subCollection;
        this.specialType = specialType;
        
        if (this.specialType !== undefined && this.subCollection !== undefined) {
            for (let sub of this.subCollection) {
                sub.command = {
                    command: 'writer-essentials.openOrCreateFile',
                    arguments: [('/ProjectBible/'+this.specialType+'/'+sub.value+'.md')],
                    title: 'Open'
                };
                sub.label = '> '+ sub.label;
                sub.tooltip = 'Open: /ProjectBible/'+this.specialType+'/'+sub.value+'.md';
            }
        }
    }
}