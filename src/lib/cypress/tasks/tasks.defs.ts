import { 
  StartWhistleServerOptions, StopWhistleServerOptions, MergeWhistleRuleOptions, 
  ProxyOptions,AllowWhistleMultipleRulesOptions, RemoveWhistleRulesOptions
} from '../../whistle/whistle.service.defs';

export {
  StartWhistleServerOptions, StopWhistleServerOptions, 
  MergeWhistleRuleOptions, ProxyOptions, 
  AllowWhistleMultipleRulesOptions, RemoveWhistleRulesOptions,
};

declare global {
  namespace Cypress {
      export interface Chainable<Subject> {
          task(task: "readFileOrNull", path: string): Chainable<string | null>;
          task(task: "removeFile", path: string): Chainable<null>;
          task(task: "startProxy", options: StartWhistleServerOptions): Chainable<null>;
          task(task: "stopProxy", options: StopWhistleServerOptions): Chainable<null>;
          task(task: "mergeRule", options: MergeWhistleRuleOptions): Chainable<null>;
          task(task: "allowMultipleRules", options: AllowWhistleMultipleRulesOptions): Chainable<null>;
          task(task: "getProxyData", options: ProxyOptions): Chainable<any>;
          task(task: "removeRules", options: RemoveWhistleRulesOptions): Chainable<null>;
      }
  }
}