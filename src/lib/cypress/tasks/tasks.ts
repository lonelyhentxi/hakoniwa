import * as fs from 'fs';
import { 
    startServerSync, stopServerSync, 
    setRuleSync, toggleMultipleRules,  removeRule,
    getData, toggleInterceptHTTPSConnects, toggleHTTP2, 
    setValue, removeValue, getValues
} from '../../whistle/service';
import {
    ProxyStartServerOptions, ProxyStopServerOptions, ProxySetRuleOptions, ProxyOptions,
    ProxyIdentifyConfigOptions, ProxyIdentifyConfigsOptions, ProxyToggleConfigOptions, 
    ProxySetValueOptions
} from './tasks.defs';
import { splitIterableField } from './tasks.tools';

export const cyTasks = (on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions) => {
    on('task', {
        fsReadFileOrNull: (path: string) => {
            if(!fs.existsSync(path)) {
                return null;
            } else {
                return fs.readFileSync(path, { encoding: 'utf-8' })
            }
        },
        fsRemoveFile: (path: string) => {
            if(fs.existsSync(path) && !fs.statSync(path).isDirectory()) {
                fs.unlinkSync(path);
            }
            return null;
        },
        proxyStart: (options: ProxyStartServerOptions) => {
            startServerSync(options);
            return null;
        },
        proxyStop: (options: ProxyStopServerOptions) => {
            stopServerSync(options);
            return null;
        },
        proxySetRule: (options: ProxySetRuleOptions) => {
            setRuleSync(options);
            return null;
        },
        proxyToggleMultipleRules: async (options: ProxyToggleConfigOptions) => {
            await toggleMultipleRules(options);
            return null;
        },
        proxyToggleInterceptHTTPSConnects: async (options: ProxyToggleConfigOptions) => {
            await toggleInterceptHTTPSConnects(options);
            return null;
        },
        proxyToggleHttp2: async (options: ProxyToggleConfigOptions) => {
            await toggleHTTP2(options);
            return null;
        },
        proxyGetData: async (options: ProxyOptions) => {
            return await getData(options);
        },
        proxyGetValues: async (options: ProxyOptions) => {
            return await getValues(options);
        },
        proxyRemoveRules: async (options: ProxyIdentifyConfigsOptions) => {
            const configs = splitIterableField(options);
            await Promise.all(configs.map(c=>removeRule(c)));
            return null;
        },
        proxySetValue: async (options: ProxySetValueOptions) => {
            await setValue(options);
            return null;
        },
        proxyRemoveValues: async (options: ProxyIdentifyConfigsOptions) => {
            const configs = splitIterableField(options);
            await Promise.all(configs.map(c=>removeValue(c)));
            return null;
        }
    });
}
