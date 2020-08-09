import { 
  StartServerOptions as ProxyStartServerOptions, 
  StopServerOptions as ProxyStopServerOptions,
  SetRuleOptions as ProxySetRuleOptions, 
  ProxyOptions,
  ToggleConfigOptions as ProxyToggleConfigOptions, 
  IdentifyConfigOptions as ProxyIdentifyConfigOptions, 
  SetValueOptions as ProxySetValueOptions,
  ProxyData, ProxyValue
} from '../../whistle/service.defs';

type ProxyIdentifyConfigsOptions = ProxyOptions & { names: string[] | string };


export {
  ProxyStartServerOptions, ProxyStopServerOptions, ProxySetRuleOptions, ProxyOptions, 
  ProxyIdentifyConfigOptions, ProxyIdentifyConfigsOptions, ProxyToggleConfigOptions, ProxySetValueOptions,
  ProxyData, ProxyValue
}

declare global {
  namespace Cypress {
      export interface Chainable<Subject> {
          // Filesystem
          task(task: "fsReadFileOrNull", path: string): Chainable<string | null>;
          task(task: "fsRemoveFile", path: string): Chainable<null>;
          // Proxy Server
          task(task: "proxyStart", options: ProxyStartServerOptions): Chainable<null>;
          task(task: "proxyStop", options: ProxyStopServerOptions): Chainable<null>;
          // Proxy Data
          task(task: "proxyGetData", options: ProxyOptions): Chainable<any>;
          // Proxy Rules
          task(task: "proxyToggleMultipleRules", options: ProxyToggleConfigOptions): Chainable<null>;
          task(task: "proxySetRule", options: ProxySetRuleOptions): Chainable<null>;
          task(task: "proxyRemoveRules", options: ProxyIdentifyConfigsOptions): Chainable<null>;
          // Proxy Values
          task(task: "proxyAddValue", options: ProxyIdentifyConfigOptions): Chainable<null>;
          task(task: "proxySetValue", options: ProxySetValueOptions): Chainable<null>;
          task(task: "proxyRemoveValues", options: ProxyIdentifyConfigsOptions): Chainable<null>;
          // HTTPS & HTTP2
          task(task: "proxyToggleInterceptHTTPSConnects", options: ProxyToggleConfigOptions): Chainable<null>;
          task(task: "proxyToggleHTTP2", options: ProxyToggleConfigOptions): Chainable<null>;
      }
  }
}