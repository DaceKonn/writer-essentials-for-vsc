import * as vscode from 'vscode';
import * as yaml from 'js-yaml';
import { FrontMatterEntry } from '../Models/FrontMatterEntry';
import { markdownFrontMatterTreeDataProvider, statisticsTreeDataProvider } from '../extension';
import { type } from 'os';
import { isSpecialType } from '../Models/SpecialFrontMatterTypes';
import * as regExp from '../regexpConstants';
import { window } from 'vscode';

export class MarkdownFrontMatterReader {
    tempDoc: any;
    //mdFrontMatterRegExp: RegExp = /(?<=---\s)[\s\S]*?(?=\s---)/;

    updateFromEditor() {
        let editor = window.activeTextEditor;
        if (!editor) {
            return;
        }

        let doc = editor.document;

        if (doc.languageId === "markdown") {
            try {
                var frontM = this.getFrontMatterFromString(doc.getText());
                this.tempDoc = frontM;
                markdownFrontMatterTreeDataProvider.refresh();
            }
            catch {

            }
            
        } else {
            console.log('!markdown');
           return;
        } 
    }

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

                markdownFrontMatterTreeDataProvider.refresh();
                statisticsTreeDataProvider.refresh();
            }
        }
	}

    getFrontMatterFromString(text: string) {
        var capture = text.match(regExp.mdFrontMatterContentRegExp);
        if (capture !== null)
        {
            var doc = yaml.safeLoad(capture[0]);
            return doc;
        }
        return undefined;
    }

    getFrontMatterFromTemp() {
        if (this.tempDoc === undefined) {
            this.updateFromEditor();
        }
        return this.getFrontMatter(this.tempDoc);
    }

    getFrontMatter(input: any) {
        var out = new Array<FrontMatterEntry>();
        if (input === undefined)
        {
            return out;
        }

        if (Array.isArray(input)) {
            for (var i = 0; i < input.length; i++) {
                if (Array.isArray(input[i]) || typeof(input[i]) === 'object') {
                    out.push(new FrontMatterEntry(i.toString(), '', this.getFrontMatter(input[i])));
                }
                else {
                    out.push(new FrontMatterEntry(i.toString(), input[i]));
                }
            }
        }
        else if (typeof(input) === 'object') {
            var keys = Object.keys(input);

            for (let key of keys) {
                var value = input[key];
                if (Array.isArray(value)) {
                    out.push(new FrontMatterEntry(key + ' [' + value.length + ']', '', this.getFrontMatter(value), isSpecialType(key) ? key : undefined));
                }
                else if (typeof(value) === 'object') {
                    out.push(new FrontMatterEntry(key, '', this.getFrontMatter(value)));
                }
                else {
                    out.push(new FrontMatterEntry(key, value));
                }
            }
        }
        else {
            out.push(new FrontMatterEntry(input, ''));
        }

        return out;
    }
}