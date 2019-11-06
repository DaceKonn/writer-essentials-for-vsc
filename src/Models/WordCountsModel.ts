export class WordCountsModel {

    private _date: Date;
    public get date() : Date {
        return this._date;
    }
    public set date(v : Date) {
        this._date = v;
    }
    
    public get fileName() : string {
        return this._fileName;
    }
    public set fileName(v : string) {
        this._fileName = v;
    }
    
    public get filePath() : string {
        return this._filePath;
    }
    public set filePath(v : string) {
        this._filePath = v;
    }
    
    public get wordCount() : number {
        return this._wordCount;
    }
    public set wordCount(v : number) {
        this._wordCount = v;
    }
    
    public get charCount() : number {
        return this._charCount;
    }
    public set charCount(v : number) {
        this._charCount = v;
    }

    public get wordDiff() : number {
        return this._wordDiff;
    }
    public set wordDiff(v : number) {
        this._wordDiff = v;
    }

    public get charDiff() : number {
        return this._charDiff;
    }
    public set charDiff(v : number) {
        this._charDiff = v;
    }
    
    
    
    constructor(
        private _fileName: string,
        private _filePath: string,
        private _wordCount: number,
        private _charCount: number,
        private _wordDiff: number,
        private _charDiff: number
    )
    {
        this._date = new Date(Date.now());
    }

    public static decodeFromJSON(parsed: any) {
        var model = new WordCountsModel(parsed._fileName, parsed._filePath, parsed._wordCount, parsed._charCount, parsed._wordDiff, parsed._charDiff);
        model.date = new Date(parsed._date);
        return model;
    }
}