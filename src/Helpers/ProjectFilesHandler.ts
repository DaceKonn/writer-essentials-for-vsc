import * as fs from 'fs';
import * as vscode from 'vscode';
import { getProjectFolders } from '../Models/ProjectFolders';
//import { workspace, ExtensionContext } from 'vscode';
import mkdirp = require('mkdirp');
import { downloadAndUnzipVSCode } from 'vscode-test';

export class ProjectFilesHandler {

    public static registerCommands(context: vscode.ExtensionContext) {
        const initFoldersCommand = 'writer-essentials.initFolders';

        const initFoldersCommandHandler = () => {
            ProjectFilesHandler.initProjectFolders();
        };

	    context.subscriptions.push(vscode.commands.registerCommand(initFoldersCommand, initFoldersCommandHandler));
    }

	public static initFoldersCommandHandler = () => {
		ProjectFilesHandler.initProjectFolders();
	}

    public static initProjectFolders() {
        if (vscode.workspace.workspaceFolders === undefined || vscode.workspace.workspaceFolders.length === 0) {
            vscode.window.showWarningMessage("In order to initialize project folders you need to set up workspace first");
            return;
        }

        var root = this.getRoot();
        if (root !== undefined) {
            var folders = getProjectFolders();

            folders.forEach(element => {
                mkdirp.sync(root + "\\" + element);
            });
            mkdirp.sync(root + "\\ProjectStatistics");
        }

        vscode.window.showInformationMessage("Writer Essentials initialized folders");
    }

    private static getRoot() {
        if (vscode.workspace.workspaceFolders !== undefined && vscode.workspace.workspaceFolders.length > 0) {
            return vscode.workspace.workspaceFolders[0].uri.fsPath;
        }
        else {
            vscode.window.showWarningMessage("Writer Essentials require you to set up workspace first");
            return;
        }
    }
}