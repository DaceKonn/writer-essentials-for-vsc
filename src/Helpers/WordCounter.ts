import { TextDocument, window } from "vscode";
import { mdFrontMatterSectionRegExp, mdFileRegExp, mdFileRegExpFlipped } from "../regexpConstants";
import { TextCounts } from "../Models/TextCounts";
import * as fs from 'fs';
import { ProjectFilesHandler } from "./ProjectFilesHandler";
import { ProjectBibleFolderPlaces, ProjectStatisticsFolders } from "../Models/ProjectFolders";
import { WordCountsModel } from "../Models/WordCountsModel";
import { load } from "js-yaml";
import mkdirp = require("mkdirp");
import { parse } from "querystring";

export class WordCounter {

    public updateWordCount(): TextCounts {
        console.log('Update word count');
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

    public _getWordCount(doc: TextDocument): TextCounts {
        console.log('Get Word Count');
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

        var history: WordCountsModel[] = this.loadFileCountHistory(doc);

        var entry: WordCountsModel = new WordCountsModel(ProjectFilesHandler.stripPath(doc.uri.path), doc.uri.path, textCounts.wordCount, textCounts.characterCount);
        var maxDate =Math.max.apply(null, history.map(value =>new Date(value.date).getTime()));

        if (Date.now() < maxDate + 1800000) {
            history = history.filter(value => new Date(value.date).getTime() !== maxDate );
        }

        history.push(entry);
        
        this.writeFileCountHistory(doc, history);

        return textCounts;
    }

    public loadFileCountHistory(doc: TextDocument): WordCountsModel[] {
        if (!fs.existsSync(ProjectFilesHandler.statisticsSaveFilePath(doc.uri)+ '.json')) {
            mkdirp.sync(ProjectFilesHandler.statisticsSaveFolderPath(doc.uri));
            fs.writeFileSync(ProjectFilesHandler.statisticsSaveFilePath(doc.uri)+ '.json', '');
            return [];
        }
        else { 
           // var streamReader = fs.createReadStream(ProjectFilesHandler.statisticsSaveFilePath(doc.uri)+ '.json');
            var content: any = fs.readFileSync(ProjectFilesHandler.statisticsSaveFilePath(doc.uri)+ '.json','utf8');
           // streamReader.close();
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
    }

    public writeFileCountHistory(doc: TextDocument, history: WordCountsModel[]) {
        fs.writeFileSync(ProjectFilesHandler.statisticsSaveFilePath(doc.uri)+ '.json', JSON.stringify(history));
    }
}
