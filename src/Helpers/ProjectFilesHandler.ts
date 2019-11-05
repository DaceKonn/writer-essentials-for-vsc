import * as fs from 'fs';
import { getProjectFolders } from '../Models/ProjectFolders';
import { workspace } from 'vscode';

export class ProjectFilesHandler {

    public initProjectStructure() {
        
        var folders = getProjectFolders();
        var workspaceFolders: string[] = [];
        if (workspace.workspaceFolders !== undefined) {
            workspaceFolders = workspace.workspaceFolders.map(value => value.name);
        }

        folders.forEach(function (element) {
            console.log(element + ' ' + workspaceFolders.includes(element));
        });
    }
}