import * as vscode from 'vscode';
import * as yaml from 'js-yaml';
import { SSL_OP_CISCO_ANYCONNECT } from 'constants';

export class MarkdownFrontMatterReader {
    tempDoc: any;
    mdFrontMatterRegExp: RegExp = /(?<=---\s)[\s\S]*?(?=\s---)/;

	handleTextDocument(document: vscode.TextDocument | undefined): any {
        if (document !== undefined)
        {
            if (document.languageId === "markdown") {
                var text = document.getText();
                let doc: any;

                try{
                    doc = this.getFrontMatterFromString(text);
                    this.tempDoc = doc;
                }
                catch{
                    doc = this.tempDoc;
                }
            }
        }
	}

    getFrontMatterFromString(text: string) {
        var capture = text.match(this.mdFrontMatterRegExp);
        if (capture !== null)
        {
            var doc = yaml.load(capture[0]);
        }
        return doc;
    }
}