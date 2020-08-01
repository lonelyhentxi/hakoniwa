import { startWhistleServerSync, mergeWhistleRuleSync, getWhistleData, removeWhistleRules, stopWhistleServerSync } from '../src/lib/whistle/whistle.service';
import { PlainWhistleRules as Rs, PlainWhistleRule as R, RegExpWhistlePattern as P } from '../src/lib/whistle/index.node';
const assert = require('assert');

const main = async () => {
  startWhistleServerSync({
    baseDir: './temp',
    identifier: 'spec',
    port: 11111
  });
  let rules = new Rs(
    'spec',
    [
      new R('abc', 'cde'),
      new R(new P(/abc/), 'cde')
    ]
  );
  mergeWhistleRuleSync({
    baseDir: './temp',
    identifier: 'spec',
    ruleName: rules.name,
    ruleContent: rules.content(),
    force: true
  });
  rules = new Rs(
    'spec',
    [
      new R('def', 'cde'),
      new R(new P(/abc/), 'cde')
    ]
  );
  mergeWhistleRuleSync({
    baseDir: './temp',
    identifier: 'spec',
    ruleName: rules.name,
    ruleContent: rules.content(),
    force: true
  });
  let data = await getWhistleData({
    protocol: 'http',
    host: 'localhost',
    port: 11111
  })
  assert((data as any).list[0]==='spec');
  await removeWhistleRules({
    rules: (data as any).list,
    protocol: 'http',
    host: 'localhost',
    port: 11111
  });
  data = await getWhistleData({
    protocol: 'http',
    host: 'localhost',
    port: 11111
  })
  assert((data as any).list.length===0);
  stopWhistleServerSync({
    baseDir: './temp',
    identifier: 'spec'
  });
}

main();
