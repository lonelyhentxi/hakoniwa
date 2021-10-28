import { execSync } from 'child_process';
import { rmdirSync, existsSync } from 'fs';
import * as path from 'path';
import {
  StartServerOptions,
  StopServerOptions,
  SetRuleOptions,
  ProxyOptions,
  ToggleConfigOptions,
  IdentifyConfigOptions,
  SetValueOptions,
  ProxyValue,
  ProxyData,
} from './service.defs';
export {
  StartServerOptions,
  StopServerOptions,
  SetRuleOptions,
  ProxyOptions,
  ToggleConfigOptions,
  IdentifyConfigOptions,
  SetValueOptions,
  ProxyValue,
  ProxyData,
};
import fetch from 'node-fetch';

export function stopServerSync({ baseDir, identifier, w2path }: StopServerOptions) {
  execSync(`${w2path ?? 'w2'} stop -S ${identifier} -D ${baseDir}`, {
    stdio: 'inherit',
    cwd: process.cwd(),
  });
}

export function startServerSync({ baseDir, identifier, port, w2path, certDir }: StartServerOptions) {
  try {
    stopServerSync({ baseDir, identifier, w2path });
  } catch (e) { }
  const serverDir = path.join(baseDir, './.whistle', 'custom_dirs', identifier);
  if (existsSync(serverDir)) {
    rmdirSync(serverDir, {
      recursive: true,
    });
  }
  execSync(`${w2path ?? 'w2'} start -S ${identifier} -D ${baseDir} --port ${port}${certDir ? ` -z ${certDir}` : ''}`, {
    stdio: 'inherit',
    cwd: process.cwd(),
  });
}

export async function setRuleSync({ protocol, host, port, ruleName, ruleContent, force }: SetRuleOptions) {
  if (!force) {
    const existenceRes = await fetch(`${protocol}://${host}:${port}/cgi-bin/rules/project`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        enable: 1,
        top: 1,
        name: ruleName
      })
    });
    const existence = !!(await existenceRes.json() as any).rules;
    if (existence) {
      throw new Error('existence rules, can not set');
    }
  }
  await fetch(`${protocol}://${host}:${port}/cgi-bin/rules/project`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: ruleName,
      rules: ruleContent
    })
  });
}

export async function toggleMultipleRules(options: ToggleConfigOptions) {
  return await fetch(`${options.protocol}://${options.host}:${options.port}/cgi-bin/rules/allow-multiple-choice`, {
    method: 'POST',
    body: JSON.stringify({ allowMultipleChoice: options.value ? 1 : 0 }),
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function getData(options: ProxyOptions): Promise<ProxyData> {
  const res = await fetch(`${options.protocol}://${options.host}:${options.port}/cgi-bin/get-data`, {
    method: 'GET',
  });
  return (await res.json()) as ProxyData;
}

export async function removeRule(options: IdentifyConfigOptions) {
  await fetch(`${options.protocol}://${options.host}:${options.port}/cgi-bin/rules/remove`, {
    method: 'POST',
    body: JSON.stringify({ name: options.name }),
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function toggleInterceptHTTPSConnects(options: ToggleConfigOptions) {
  return await fetch(`${options.protocol}://${options.host}:${options.port}/cgi-bin/intercept-https-connects`, {
    method: 'POST',
    body: JSON.stringify({ interceptHttpsConnects: options.value ? 1 : 0 }),
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function toggleHTTP2(options: ToggleConfigOptions) {
  return await fetch(`${options.protocol}://${options.host}:${options.port}/cgi-bin/enable-http2`, {
    method: 'POST',
    body: JSON.stringify({ enableHttp2: options.value ? 1 : 0 }),
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function setValue(options: SetValueOptions) {
  return await fetch(`${options.protocol}://${options.host}:${options.port}/cgi-bin/values/add`, {
    method: 'POST',
    body: JSON.stringify({
      name: options.name,
      value: options.value,
      hide: options.hide,
      active: options.active,
      changed: options.changed,
    }),
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function removeValue(options: IdentifyConfigOptions) {
  return await fetch(`${options.protocol}://${options.host}:${options.port}/cgi-bin/values/remove`, {
    method: 'POST',
    body: JSON.stringify({
      name: options.name,
    }),
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function getValues(options: ProxyOptions): Promise<ProxyValue[]> {
  const res = await fetch(`${options.protocol}://${options.host}:${options.port}/cgi-bin/values/get`, {
    method: 'GET',
  });
  const json = (await res.json()) as any;
  return json.values;
}
