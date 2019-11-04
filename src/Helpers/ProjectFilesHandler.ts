import * as fs from 'fs';
import { getProjectFolders } from '../Models/ProjectFolders';

export class ProjectFilesHandler {

    public initProjectStructure() {
        
        var folders = getProjectFolders();

        folders.forEach(function (element) {
            console.log('Folder exists - ' + element + ' - '+ fs.existsSync(element));
        });
    }
}