import { TextDocument, window } from "vscode";
import { mdFrontMatterSectionRegExp } from "../regexpConstants";
import { TextCounts } from "../Models/TextCounts";

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

        return textCounts;
    }
}
