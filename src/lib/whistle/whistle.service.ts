import { spawnSync, SpawnSyncOptions, SpawnSyncReturns } from 'child_process';
import { rmdirSync, existsSync, unlinkSync, writeFileSync } from 'fs';
import * as path from 'path';

export function startWhistleServerSync(baseDir: string, identifier: string, port: number, options?: SpawnSyncOptions): SpawnSyncReturns<Buffer> {
    const serverDir = path.resolve("baseDir", ".whistle", "custom_dirs", identifier);
    if(existsSync(serverDir)) {
        rmdirSync(serverDir, {
            recursive: true
        });
    }
    return spawnSync("w2",["start", "-D", baseDir, "-S", identifier, "-port", port.toString()], options);
}

export function stopWhistleServerSync(baseDir: string, identifier: string, options?: SpawnSyncOptions): SpawnSyncReturns<Buffer> {
    return spawnSync("w2", ["stop","-D", baseDir, "-S", identifier], options);
}

export function addWhistleRuleSync(baseDir: string, identifier: string, ruleName: string, ruleContent: string, force: boolean, options?: SpawnSyncOptions): SpawnSyncReturns<Buffer> {
    const ruleFilePath = path.resolve(baseDir, ".whistle", "custom_dirs", identifier, ruleName);
    if(existsSync(ruleFilePath)) {
        unlinkSync(ruleFilePath);
    }
    writeFileSync(ruleFilePath, ruleContent, { encoding: 'utf-8', mode: 'w' });
    const args = ["add", ruleFilePath , "-D", baseDir, "-S", identifier];
    if(force) {
        args.push("--force");
    }
    return spawnSync("w2", args , options);
}