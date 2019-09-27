import * as vscode from 'vscode';
import * as yaml from 'js-yaml';
import { FrontMatterEntry } from '../Models/FrontMatterEntry';
import { markdownFrontMatterTreeDataProvider } from '../extension';
import { type } from 'os';
import { isSpecialType } from '../Models/SpecialFrontMatterTypes';

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

                markdownFrontMatterTreeDataProvider.refresh();
            }
        }
	}

    getFrontMatterFromString(text: string) {
        var capture = text.match(this.mdFrontMatterRegExp);
        if (capture !== null)
        {
            var doc = yaml.safeLoad(capture[0]);
            return doc;
        }
        return undefined;
    }

    getFrontMatterFromTemp() {
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