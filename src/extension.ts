// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { FrontMatterReader } from './FrontMatterReaders/FrontMatterReader';
import { FrontMatterTreeDataProvider } from './TreeDataProviders/FrontMatterTreeDataProvider';
import { StatisticsTreeDataProvider } from './TreeDataProviders/StatisticsTreeDataProvider';
import { ProjectFilesHandler } from './Helpers/ProjectFilesHandler';
import { WordCounter } from './Helpers/WordCounter';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export var frontMatterReader: FrontMatterReader;
export var frontMatterTreeDataProvider: FrontMatterTreeDataProvider;
export var statisticsTreeDataProvider : StatisticsTreeDataProvider;

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "writer-essentials" is now active!');

	frontMatterReader = new FrontMatterReader();
	frontMatterTreeDataProvider = new FrontMatterTreeDataProvider(context);
	statisticsTreeDataProvider = new StatisticsTreeDataProvider(context);
	
	
	vscode.workspace.onDidChangeTextDocument(change => {if (change !== undefined) {frontMatterReader.handleTextDocument(change.document);}});
	vscode.workspace.onDidChangeTextDocument(change => {if (change !== undefined) {WordCounter.updateWordCount();}});
	vscode.window.onDidChangeActiveTextEditor(change => {if (change !== undefined) {frontMatterReader.handleTextDocument(change.document);}});
	vscode.window.onDidChangeActiveTextEditor(change => {if (change !== undefined) {WordCounter.updateWordCount();}});

	vscode.window.registerTreeDataProvider('front-matter-view', frontMatterTreeDataProvider);
	vscode.window.registerTreeDataProvider('stats-view', statisticsTreeDataProvider);

	ProjectFilesHandler.registerCommands(context);
	WordCounter.registerCommands(context);
		//context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
