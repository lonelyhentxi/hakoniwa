import { execSync } from 'child_process';
import { rmdirSync, existsSync, unlinkSync, writeFileSync, mkdirSync } from 'fs';
import * as path from 'path';
import { StartWhistleServerOptions,StopWhistleServerOptions,MergeWhistleRuleOptions } from './whistle.service.defs';
export { StartWhistleServerOptions,StopWhistleServerOptions,MergeWhistleRuleOptions };

export function stopWhistleServerSync({baseDir, identifier, w2path}: StopWhistleServerOptions) {
    execSync(`${w2path??'w2'} stop -D ${baseDir} -S ${identifier}`, {
        stdio: 'inherit',
        cwd: process.cwd(),
    });
}

export function startWhistleServerSync({baseDir, identifier, port, w2path}: StartWhistleServerOptions) {
    try {
        stopWhistleServerSync({baseDir, identifier, w2path});
    } catch (e) {
    }
    const serverDir = path.join(baseDir,"./.whistle", "custom_dirs", identifier);
    if(existsSync(serverDir)) {
        rmdirSync(serverDir, {
            recursive: true
        });
    }
    execSync(`${w2path??'w2'} start -D ${baseDir} -S ${identifier} --port ${port}`, {
        stdio: 'inherit',
        cwd: process.cwd(),
    });
}

export function mergeWhistleRuleSync({baseDir, identifier, ruleName, ruleContent, force, w2path}: MergeWhistleRuleOptions){
    const ruleFilePath = path.join(baseDir,"./.whistle", "custom_dirs", identifier, ruleName + ".js");
    if(existsSync(ruleFilePath)) {
        unlinkSync(ruleFilePath);
    }
    mkdirSync(path.dirname(ruleFilePath), { recursive:true });
    writeFileSync(ruleFilePath, ruleContent, { encoding: 'utf-8' });
    const args = ["add", ruleFilePath , "-D", baseDir, "-S", identifier];
    if(force??true) {
        args.push("--force");
    }
    execSync(`${w2path??'w2'} ${args.join(' ')}`, {
        stdio: 'inherit',
        cwd: process.cwd(),
    });
}