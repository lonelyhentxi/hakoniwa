import { 
  StartWhistleServerOptions, StopWhistleServerOptions, MergeWhistleRuleOptions
} from '../../whistle/whistle.service.defs';

export type PartialStartWhistleServerOptions = Partial<StartWhistleServerOptions>;
export type PartialStopWhistleServerOptions = Partial<StopWhistleServerOptions>;
export type PartialMergeWhistleRuleOptions = Partial<MergeWhistleRuleOptions> & {
  ruleName: string;
  ruleContent: string;
};

declare global {
  namespace Cypress {
      export interface Chainable<Subject> {
          task(task: "readFileOrNull", path: string): Chainable<string | null>;
          task(task: "startProxy", options: PartialStartWhistleServerOptions): Chainable<null>;
          task(task: "stopProxy", options: PartialStopWhistleServerOptions): Chainable<null>;
          task(task: "mergeRule", options: PartialMergeWhistleRuleOptions): Chainable<null>;
      }
  }
}