import { spawnSync } from 'child_process';
import { rmdirSync, existsSync, unlinkSync, writeFileSync } from 'fs';
import * as path from 'path';

export interface StartWhistleServerOptions {
    baseDir: string;
    identifier: string;
    port: string;
}

export function startWhistleServerSync({baseDir, identifier, port }: StartWhistleServerOptions) {
    const serverDir = path.join(baseDir, ".whistle", "custom_dirs", identifier);
    if(existsSync(serverDir)) {
        rmdirSync(serverDir, {
            recursive: true
        });
    }
    spawnSync("w2",["start", "-D", baseDir, "-S", identifier, "-port", port.toString()]);
}

export interface StopWhistleServerOptions {
    baseDir: string;
    identifier: string;
}

export function stopWhistleServerSync({baseDir, identifier}: StopWhistleServerOptions) {
    spawnSync("w2", ["stop","-D", baseDir, "-S", identifier]);
}

export interface MergeWhistleRuleOptions {
    baseDir: string;
    identifier: string;
    ruleName: string;
    ruleContent: string;
    force: boolean;
}

export function mergeWhistleRuleSync({baseDir, identifier, ruleName, ruleContent, force}:MergeWhistleRuleOptions){
    const ruleFilePath = path.join(baseDir, ".whistle", "custom_dirs", identifier, ruleName);
    if(existsSync(ruleFilePath)) {
        unlinkSync(ruleFilePath);
    }
    writeFileSync(ruleFilePath, ruleContent, { encoding: 'utf-8', mode: 'w' });
    const args = ["add", ruleFilePath , "-D", baseDir, "-S", identifier];
    if(force) {
        args.push("--force");
    }
    spawnSync("w2", args);
}