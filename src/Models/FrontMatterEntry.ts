import * as vscode from 'vscode';

export class FrontMatterEntry extends vscode.TreeItem {

    key: string;
    value: string | number | boolean | Date;
    subCollection: Array<FrontMatterEntry> | undefined;

    constructor(key: string, value: string | number | boolean | Date, subCollection?: Array<FrontMatterEntry>) {
        super(key+': '+value, subCollection !== undefined ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None);
        this.key = key;
        this.value = value;
        this.subCollection = subCollection;
    }

    // key: string;
    // value: string | number | boolean | Date;
    // array: Array<string> | Array<number> | Array<boolean> | Array<Date> | undefined;
    // subCollection: Array<FrontMatterEntry> | undefined;
    // isArray: boolean;
    // hasSubCollection: boolean | undefined;

    // constructor (key: string, value: any, collapsibleState: vscode.TreeItemCollapsibleState, asSubObject?: boolean){
    //     super('', collapsibleState);
    //     this.key = key;
    //     this.isArray = false;
    //     if (asSubObject) {
    //         this.value = '';
    //         this.subCollection = value;
    //     }
    //     else {
    //         if (Array.isArray(value)) {
    //             this.value = '';
    //             this.isArray = true;
    //             this.array = value;
    //         }
    //         else {
    //             this.value = value;
    //         }
    //     }
    //     this.hasSubCollection = asSubObject; 

    //     super.label = this.value !== '' ? this.key + (this.isArray ? '[]' : ': ' + this.value) : this.key; 
    // }
}