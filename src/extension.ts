// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { MarkdownFrontMatterReader } from './FrontMatterReaders/MarkdownFrontMatterReader';
import { MarkdownFrontMatterTreeDataProvider } from './TreeDataProviders/MarkdownFrontMatterTreeDataProvider';
import { StatisticsTreeDataProvider } from './TreeDataProviders/StatisticsTreeDataProvider';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export var markdownFrontMatterReader: MarkdownFrontMatterReader;
export var markdownFrontMatterTreeDataProvider: MarkdownFrontMatterTreeDataProvider;
export var statisticsTreeDataProvider : StatisticsTreeDataProvider;

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "writer-essentials" is now active!');

	markdownFrontMatterReader = new MarkdownFrontMatterReader();
	markdownFrontMatterTreeDataProvider = new MarkdownFrontMatterTreeDataProvider(context);
	statisticsTreeDataProvider = new StatisticsTreeDataProvider(context);
	
	
	vscode.workspace.onDidChangeTextDocument(change => {if (change !== undefined) {markdownFrontMatterReader.handleTextDocument(change.document);}});
	vscode.window.onDidChangeActiveTextEditor(change => {if (change !== undefined) {markdownFrontMatterReader.handleTextDocument(change.document);}});

	vscode.window.registerTreeDataProvider('markdown-front-matter-view', markdownFrontMatterTreeDataProvider);
	vscode.window.registerTreeDataProvider('markdown-stats-view', statisticsTreeDataProvider);
	//context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
