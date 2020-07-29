import { execSync } from 'child_process';
import { rmdirSync, existsSync, unlinkSync, writeFileSync, mkdirSync } from 'fs';
import * as path from 'path';
import {
    StartWhistleServerOptions, StopWhistleServerOptions,
    MergeWhistleRuleOptions, ProxyOptions,
    AllowWhistleMultipleRulesOptions, RemoveWhistleRulesOptions
} from './whistle.service.defs';
export {
    StartWhistleServerOptions, StopWhistleServerOptions,
    MergeWhistleRuleOptions, ProxyOptions,
    AllowWhistleMultipleRulesOptions, RemoveWhistleRulesOptions
};
import fetch from 'node-fetch';

export function stopWhistleServerSync({ baseDir, identifier, w2path }: StopWhistleServerOptions) {
    execSync(`${w2path ?? 'w2'} stop -S ${identifier} -D ${baseDir}`, {
        stdio: 'inherit',
        cwd: process.cwd(),
    });
}

export function startWhistleServerSync({ baseDir, identifier, port, w2path }: StartWhistleServerOptions) {
    try {
        stopWhistleServerSync({ baseDir, identifier, w2path });
    } catch (e) {
    }
    const serverDir = path.join(baseDir, "./.whistle", "custom_dirs", identifier);
    if (existsSync(serverDir)) {
        rmdirSync(serverDir, {
            recursive: true
        });
    }
    execSync(`${w2path ?? 'w2'} start -S ${identifier} -D ${baseDir} --port ${port}`, {
        stdio: 'inherit',
        cwd: process.cwd(),
    });
}

export function mergeWhistleRuleSync({ baseDir, identifier, ruleName, ruleContent, force, w2path }: MergeWhistleRuleOptions) {
    const ruleFilePath = path.join(baseDir, "./.whistle", "custom_dirs", identifier, ruleName + ".js");
    if (existsSync(ruleFilePath)) {
        unlinkSync(ruleFilePath);
    }
    mkdirSync(path.dirname(ruleFilePath), { recursive: true });
    writeFileSync(ruleFilePath, ruleContent, { encoding: 'utf-8' });
    const args = ["add", ruleFilePath, "-S", identifier, "-D", baseDir];
    if (force ?? true) {
        args.push("--force");
    }
    execSync(`${w2path ?? 'w2'} ${args.join(' ')}`, {
        stdio: 'inherit',
        cwd: process.cwd(),
    });
}

export async function allowWhistleMultipleRules(options: AllowWhistleMultipleRulesOptions) {
    await fetch(`${options.protocol}://${options.host}:${options.port}/cgi-bin/rules/allow-multiple-choice`, {
        method: 'POST',
        body: JSON.stringify({ allowMultipleChoice: 1 }),
        headers: { 'Content-Type': 'application/json' }
    });
}

export async function getWhistleData(options: ProxyOptions) {
    return await fetch(`${options.protocol}://${options.host}:${options.port}/cgi-bin/get-data`, {
        method: 'GET',
    });
}

export async function removeWhistleRules(options: RemoveWhistleRulesOptions) {
    const rules = options.rules instanceof Array ? options.rules : [options.rules];
    await Promise.all(rules.map(r => fetch(`${options.protocol}://${options.host}:${options.port}/cgi-bin/rules/remove`, {
        method: 'POST',
        body: JSON.stringify({ name: r }),
        headers: { 'Content-Type': 'application/json' }
    })))
}