export interface StartWhistleServerOptions {
  baseDir: string;
  identifier: string;
  port: number;
  w2path?: string;
}

export interface StopWhistleServerOptions {
  baseDir: string;
  identifier: string;
  w2path?: string;
}

export interface MergeWhistleRuleOptions {
  baseDir: string;
  identifier: string;
  ruleName: string;
  ruleContent: string;
  // default: true
  force?: boolean;
  w2path?: string;
}