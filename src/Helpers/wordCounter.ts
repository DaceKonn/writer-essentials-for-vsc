import { TextDocument, window } from "vscode";
import { mdFrontMatterSectionRegExp } from "../regexpConstants";

export class WordCounter {

    public updateWordCount() {
        console.log('Update word count');
        // Get the current text editor
        let editor = window.activeTextEditor;
        if (!editor) {
            console.log("!editor");
          //  this._statusBarItem.hide();
            return 0;
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
           return 0;
        } 
    }

    public _getWordCount(doc: TextDocument): number {
        console.log('Get Word Count');
        let docContent = doc.getText();

        // Parse out front matter
        docContent = docContent.replace(mdFrontMatterSectionRegExp, '');
        // Parse out unwanted whitespace so the split is accurate
        docContent = docContent.replace(/(< ([^>]+)<)/g, '').replace(/\s+/g, ' ');
        docContent = docContent.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
        let wordCount = 0;
        if (docContent !== "") {
            wordCount = docContent.split(" ").length;
        }

        return wordCount;
    }
}