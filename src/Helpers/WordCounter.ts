import * as vscode from "vscode";
import { mdFrontMatterSectionRegExp } from "../regexpConstants";
import { TextCounts } from "../Models/TextCounts";
import * as fs from 'fs';
import { ProjectFilesHandler } from "./ProjectFilesHandler";
import { WordCountsModel } from "../Models/WordCountsModel";
import mkdirp = require("mkdirp");
import { window, TextDocument } from "vscode";
import { compareValues } from "./DynamicCompare";

export class WordCounter {
    
    private static _wordCount : TextCounts = new TextCounts();
    public static get wordCount() : TextCounts {
        return this._wordCount;
    }
    
    public static registerCommands(context: vscode.ExtensionContext) {
        const updateWordCountCommand = 'writer-essentials.updateWordCount';

        const updateWordCountCommandHandler = () => {
            WordCounter.updateWordCount();
        };

        context.subscriptions.push(vscode.commands.registerCommand(updateWordCountCommand, updateWordCountCommandHandler));
    }

    public static updateWordCount(): TextCounts {
        // Get the current text editor
        let editor = window.activeTextEditor;
        if (!editor) {
            console.log("!editor");
          //  this._statusBarItem.hide();
            return new TextCounts();
        }

        let doc = editor.document;

        // Only update status if an MD file
         if (doc.languageId === "markdown") {
            return this._getWordCount(doc);

            // Update the status bar
           // this._statusBarItem.text = wordCount !== 1 ? `$(pencil) ${wordCount} Words` : '$(pencil) 1 Word';
          //  this._statusBarItem.show();
        } else {
            console.log('!markdown');
           return new TextCounts();
        } 
    }

    public static _getWordCount(doc: TextDocument): TextCounts {
        let textCounts = new TextCounts();

        let docContent = doc.getText();

        // Parse out front matter
        docContent = docContent.replace(mdFrontMatterSectionRegExp, '');

        //get character count with white spaces etc.
        textCounts.characterCount = docContent.length;
        
        // Parse out unwanted whitespace so the split is accurate
        docContent = docContent.replace(/(< ([^>]+)<)/g, '').replace(/\s+/g, ' ');
        docContent = docContent.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
        if (docContent !== "") {
            textCounts.wordCount = docContent.split(" ").length;
            
        }

        this._updateHistory(doc, textCounts);

        this._wordCount = textCounts;
        return WordCounter.wordCount;
    }

    public static loadFileCountHistory(doc: TextDocument): WordCountsModel[] {
        if (!fs.existsSync(ProjectFilesHandler.statisticsSaveFilePath(doc.uri)+ '.json')) {
            mkdirp.sync(ProjectFilesHandler.statisticsSaveFolderPath(doc.uri));
            fs.writeFileSync(ProjectFilesHandler.statisticsSaveFilePath(doc.uri)+ '.json', '');
            return [];
        }
        else { 
           // var streamReader = fs.createReadStream(ProjectFilesHandler.statisticsSaveFilePath(doc.uri)+ '.json');
            var content: any = fs.readFileSync(ProjectFilesHandler.statisticsSaveFilePath(doc.uri)+ '.json','utf8');
           // streamReader.close();
           try
           {
            var parsed = JSON.parse(content);
            if (parsed === undefined || parsed === null) {
                return [];
            }
            else {
                return parsed.map((element: any) => {
                    return WordCountsModel.decodeFromJSON(element);
                });
            }
           }
           catch
           {
               return [];
           }

        }
    }

    public static writeFileCountHistory(doc: TextDocument, history: WordCountsModel[]) {
        fs.writeFileSync(ProjectFilesHandler.statisticsSaveFilePath(doc.uri)+ '.json', JSON.stringify(history));
    }

    private static _updateHistory(doc: TextDocument, counts: TextCounts) {
        if (doc.uri.path.indexOf('/Manuscripts/') !== -1)
        {
            var history: WordCountsModel[] = this.loadFileCountHistory(doc);
            var sorted = [...history];
            var valuesToSet = counts;

            if (history.length > 1) {
                sorted.sort(compareValues('_date', 'desc'));
            }

            var top = sorted[0];
            var entry: WordCountsModel;
            if (top === undefined){
                entry = new WordCountsModel(
                    ProjectFilesHandler.stripPath(doc.uri.path), 
                    doc.uri.path, 
                    valuesToSet.wordCount, 
                    valuesToSet.characterCount,
                    0,
                    0);
            }
            else if (top.charCount !== valuesToSet.characterCount) {
                var offset: TextCounts = new TextCounts();
                if (Date.now() < top.date.getTime() + 1800000) {
                    history = history.filter(value => new Date(value.date).getTime() !== top.date.getTime() );
                    if (sorted.length > 1) {
                        offset.wordCount = sorted[1].wordCount;
                        offset.characterCount = sorted[1].charCount;
                    }
                }
                else {
                    offset.wordCount = top.wordCount;
                    offset.characterCount = top.charCount;
                }

                entry = new WordCountsModel(
                    ProjectFilesHandler.stripPath(doc.uri.path), 
                    doc.uri.path, 
                    valuesToSet.wordCount, 
                    valuesToSet.characterCount,
                    valuesToSet.wordCount - offset.wordCount,
                    valuesToSet.characterCount - offset.characterCount);
            }
            else {
                return;
            }

            history.push(entry);
            
            this.writeFileCountHistory(doc, history);
        }
    }
}
