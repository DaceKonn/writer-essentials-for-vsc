import * as vscode from 'vscode';
import * as yaml from 'js-yaml';
import { FrontMatterEntry } from '../Models/FrontMatterEntry';
import { markdownFrontMatterTreeDataProvider, statisticsTreeDataProvider } from '../extension';
import { type } from 'os';
import { isSpecialType } from '../Models/SpecialFrontMatterTypes';
import * as regExp from '../RegexpConstants';
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

        if (doc.languageId === "markdown" || doc.languageId === 'fountain') {
            try {
                var frontM = this.getFrontMatterFromString(doc.getText(), doc.languageId);
                this.tempDoc = frontM;
                markdownFrontMatterTreeDataProvider.refresh();
            }
            catch {

            }
            
        } else {
            console.log('!markdown && !fountain');
           return;
        } 
    }

	handleTextDocument(document: vscode.TextDocument | undefined): any {
        if (document !== undefined)
        {
            if (document.languageId === "markdown" || document.languageId === 'fountain') {
                var text = document.getText();
                let doc: any;

                try{
                    doc = this.getFrontMatterFromString(text, document.languageId);
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

    getFrontMatterFromString(text: string, languageId: string) {
        var capture: RegExpMatchArray | null = null;
        if (languageId === "markdown"){
            capture = text.match(regExp.mdFrontMatterContentRegExp);
        }
        else if (languageId === "fountain") {
            capture = text.match(regExp.ftFrontMatterContentRegExp);
        }
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