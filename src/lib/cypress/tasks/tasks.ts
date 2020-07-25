import * as fs from 'fs';
import { 
    startWhistleServerSync, stopWhistleServerSync, mergeWhistleRuleSync
} from '../../whistle/whistle.service';
import { 
    HAKONIWA_PROXY_DIR, 
    HAKONIWA_PROXY_IDENTIFIER, 
    HAKONIWA_PROXY_PORT
} from '../../../constants/constants.node';
import {
    PartialStartWhistleServerOptions,
    PartialStopWhistleServerOptions,
    PartialMergeWhistleRuleOptions
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
        startProxy: (options: PartialStartWhistleServerOptions = {}) => {
            const config = Object.assign({
                baseDir: HAKONIWA_PROXY_DIR,
                identifier: HAKONIWA_PROXY_IDENTIFIER,
                port: HAKONIWA_PROXY_PORT
            }, options);
            startWhistleServerSync(config);
            return null;
        },
        stopProxy: (options: PartialStopWhistleServerOptions) => {
            const config = Object.assign({
                baseDir: HAKONIWA_PROXY_DIR,
                identifier: HAKONIWA_PROXY_IDENTIFIER
            }, options);
            stopWhistleServerSync(config);
            return null;
        },
        mergeRule: (options: PartialMergeWhistleRuleOptions) => {
            const config = Object.assign({
                baseDir: HAKONIWA_PROXY_DIR,
                identifier: HAKONIWA_PROXY_IDENTIFIER
            }, options);
            mergeWhistleRuleSync(config);
            return null;
        }
    });
}
