export interface StartServerOptions {
  baseDir: string;
  identifier: string;
  port: number;
  // default: w2
  w2path?: string;
  // default: default cert
  certDir?: string;
}

export interface StopServerOptions {
  baseDir: string;
  identifier: string;
  w2path?: string;
}

export interface SetRuleOptions {
  baseDir: string;
  identifier: string;
  ruleName: string;
  ruleContent: string;
  // default: true
  force?: boolean;
  // default: w2
  w2path?: string;
}

export interface ProxyOptions {
  host: string;
  port: number;
  protocol: 'http' | 'https'
}

export type ToggleConfigOptions = ProxyOptions & { value: boolean };
export type IdentifyConfigOptions = ProxyOptions & { name: string };
export type SetValueOptions = ProxyOptions & { 
  name: string; 
  value?: string; 
  hide?: boolean; 
  active?: boolean; 
  changed?: boolean; 
};

export interface ProxyValue {
  name: string;
  data: string;  
}

export interface ProxyData {
  list: string[];
}