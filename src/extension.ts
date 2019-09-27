// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { MarkdownFrontMatterReader } from './MarkdownFrontMatterReader';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	var markdownFrontMatterReader = new MarkdownFrontMatterReader();

	console.log('Congratulations, your extension "writer-essentials" is now active!');
	
	vscode.workspace.onDidChangeTextDocument(change => {if (change !== undefined) {markdownFrontMatterReader.handleTextDocument(change.document);}});
	vscode.window.onDidChangeActiveTextEditor(change => {if (change !== undefined) {markdownFrontMatterReader.handleTextDocument(change.document);}});

	//context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
