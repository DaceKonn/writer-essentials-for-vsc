export const ManuscriptsFolder: string = 'Manuscripts';
export const ProjectBibleFolder: string = 'ProjectBible';
export const ProjectBibleFolderCharacters: string = 'ProjectBible\\characters';
export const ProjectBibleFolderPlaces: string = 'ProjectBible\\places';
export const ProjectStatisticsFolders: string = 'ProjectStatistics';
export const ScratchpadFolder: string = 'Scratchpad';

export function getProjectFolders() {
    return [ManuscriptsFolder, ProjectBibleFolder, ProjectStatisticsFolders, ProjectBibleFolderCharacters, ProjectBibleFolderPlaces, ScratchpadFolder];
}