import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs-extra';
import { JsonData, JsonDataProcess } from './loadData';
export interface VersionConfig {
    [key: string]: {
        asset_bundle_url: string;
        ex_resource_url: string;
        lua_url: string;
        lua_version: string;
    };
}

@Injectable()
export class DataService {
    private dataVersion: VersionConfig;
    private dbDataInGame: JsonDataProcess;
    private dataInGame: JsonData;
    constructor() {
        // version input
        const filePathVersion = path.resolve(process.cwd(),'./src/data/version.json');
        const fileContentsVersion = fs.readFileSync(filePathVersion, 'utf-8');
        this.dataVersion = JSON.parse(fileContentsVersion) as VersionConfig;

        //data-in-game input
        this.dbDataInGame = new JsonDataProcess();
        this.updateDataInGame()
    }

    getVersionData(): VersionConfig {
        return this.dataVersion;
    }

    getDataInGame(): JsonData {
        return this.dataInGame
    }

    getDataResource() {
        return this.dataResource;
    }

    async updateDataInGame() {
       this.dataInGame = await this.dbDataInGame.getData()
    }
}