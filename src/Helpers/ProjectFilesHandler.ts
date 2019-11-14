import * as fs from 'fs';
import * as vscode from 'vscode';
import { getProjectFolders, ProjectStatisticsFolders } from '../Models/ProjectFolders';
//import { workspace, ExtensionContext } from 'vscode';
import mkdirp = require('mkdirp');
import { downloadAndUnzipVSCode } from 'vscode-test';
import { mdFileRegExpFlipped, mdFileRegExp, fountainFileRegExpFlipped } from '../RegexpConstants';

export class ProjectFilesHandler {

    public static registerCommands(context: vscode.ExtensionContext) {
        const initFoldersCommand = 'writer-essentials.initFolders';

        const initFoldersCommandHandler = () => {
            ProjectFilesHandler.initProjectFolders();
        };

        context.subscriptions.push(vscode.commands.registerCommand(initFoldersCommand, initFoldersCommandHandler));
        
        const openOrCreateFileCommand = 'writer-essentials.openOrCreateFile';

        const openOrCreateFileCommandHandler = (uri: string) => {
            ProjectFilesHandler.openOrCreateFile(uri);
        };

        context.subscriptions.push(vscode.commands.registerCommand(openOrCreateFileCommand, openOrCreateFileCommandHandler));
    }

    public static initProjectFolders() {
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

    public static openOrCreateFile(uri: string) {
        if (!fs.existsSync(vscode.Uri.parse('file:'+this.getRoot()+uri).fsPath)) {
            vscode.window.showInformationMessage("File doesn't exist");
            const newFile = vscode.Uri.parse('untitled:' +this.getRoot()+ uri);
            
            vscode.workspace.openTextDocument(newFile).then(document => {
                const edit = new vscode.WorkspaceEdit();
                edit.insert(newFile, new vscode.Position(0, 0), "---\n\tauthor: anonymous\n---\n");
                return vscode.workspace.applyEdit(edit).then(success => {
                    if (success) {
                        vscode.window.showTextDocument(document);
                    } else {
                        vscode.window.showInformationMessage('Error!');
                    }
                });
            });

        }
        else {
            vscode.workspace.openTextDocument(vscode.Uri.parse('file:'+this.getRoot()+uri)).then((a: vscode.TextDocument) => {
                vscode.window.showTextDocument(a, 1, false);
            }, (error: any) => {
                console.error(error);
                debugger;
            });
        }
        
    }

    public static getRoot(flip?: boolean) {
        if (vscode.workspace.workspaceFolders !== undefined && vscode.workspace.workspaceFolders.length > 0) {
            var path =vscode.workspace.workspaceFolders[0].uri.fsPath;
            if (flip) {
                return path.split('\\').join('/');
            }

            return path;
        }
        else {
            vscode.window.showWarningMessage("Writer Essentials couldn't get the root");
            return '';
        }
    }

    public static stripPath(path: string) {
        var rootPath = ProjectFilesHandler.getRoot(true).toLowerCase();
        var lowPath = path.toLowerCase();
        var index = lowPath.indexOf(rootPath);
        var length = rootPath.length;

        if (index === -1) {
            return path;
        }

        var substring = path.substr(index, length);
        var strippedPath = path.replace(substring, '');

        //var strippedPath = path.replace(rootPath, '');
        strippedPath = strippedPath.replace('//', '');
        return strippedPath;
    }

    public static statisticsSaveFolderPath(uri: vscode.Uri, languageId: string) {
        var regex: RegExp;
        if (languageId === 'markdown') {
            regex = mdFileRegExpFlipped;
        }
        else if (languageId === 'fountain') {
            regex = fountainFileRegExpFlipped;
        }
        else {
            return "";
        }

        var trimmedUri = uri.path.replace(regex, '');

        return ProjectFilesHandler.getRoot(true) +'/'+ ProjectStatisticsFolders + '/' + ProjectFilesHandler.stripPath(trimmedUri);
    }

    public static statisticsSaveFilePath(uri: vscode.Uri) {
        return ProjectFilesHandler.getRoot(true) +'/'+ ProjectStatisticsFolders + '/' + ProjectFilesHandler.stripPath(uri.path);
    }
}