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

export interface ProxyOptions {
  host: string;
  port: number;
  protocol: 'http' | 'https'
}


export type AllowWhistleMultipleRulesOptions = ProxyOptions & { value: boolean };

export type RemoveWhistleRulesOptions = ProxyOptions & { rules: string[] | string; };