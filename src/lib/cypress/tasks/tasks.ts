import * as fs from 'fs';
import { 
    startWhistleServerSync, stopWhistleServerSync, 
    mergeWhistleRuleSync, allowWhistleMultipleRules, 
    getWhistleData, removeWhistleRules,
} from '../../whistle/whistle.service';
import {
    StartWhistleServerOptions,
    StopWhistleServerOptions,
    MergeWhistleRuleOptions,
    AllowWhistleMultipleRulesOptions,
    ProxyOptions, 
    RemoveWhistleRulesOptions
} from './tasks.defs';

export const cyTasks = (on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions) => {
    on('task', {
        readFileOrNull: (path: string) => {
            if(!fs.existsSync(path)) {
                return null;
            } else {
                return fs.readFileSync(path, { encoding: 'utf-8' })
            }
        },
        removeFile: (path: string) => {
            if(fs.existsSync(path) && !fs.statSync(path).isDirectory()) {
                fs.unlinkSync(path);
            }
            return null;
        },
        startProxy: (options: StartWhistleServerOptions) => {
            startWhistleServerSync(options);
            return null;
        },
        stopProxy: (options: StopWhistleServerOptions) => {
            stopWhistleServerSync(options);
            return null;
        },
        mergeRule: (options: MergeWhistleRuleOptions) => {
            mergeWhistleRuleSync(options);
            return null;
        },
        allowMultipleRules: async (options: AllowWhistleMultipleRulesOptions) => {
            await allowWhistleMultipleRules(options);
            return null;
        },
        getProxyData: async (options: ProxyOptions) => {
            return await getWhistleData(options);
        },
        removeRules: async (options: RemoveWhistleRulesOptions) => {
            await removeWhistleRules(options);
            return null;
        }
    });
}
