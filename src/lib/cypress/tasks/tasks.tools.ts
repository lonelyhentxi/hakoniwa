import {ProxyIdentifyConfigOptions, ProxyIdentifyConfigsOptions} from './tasks.defs';

export function splitIterableField(options: ProxyIdentifyConfigsOptions): ProxyIdentifyConfigOptions[] {
  const res = [];
  const names = options.names instanceof Array ? options.names : [options.names];
  for (const k of names) {
    const fromCopy = Object.assign({name: k}, options);
    delete (fromCopy as any).names;
    res.push(fromCopy);
  }
  return res;
}
