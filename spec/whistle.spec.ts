import { startServerSync, setRuleSync, getData, removeRule, stopServerSync, getValues, setValue, removeValue } from '../src/lib/whistle/service';
import { PlainProxyRules as Rs, PlainProxyRule as R, RegExpProxyPattern as P } from '../src/lib/whistle/index.node';
import assert from 'assert';

const main = async () => {
  startServerSync({
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
  setRuleSync({
    protocol: 'http',
    host: 'localhost',
    port: 11111,
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
  setRuleSync({
    protocol: 'http',
    host: 'localhost',
    port: 11111,
    ruleName: rules.name,
    ruleContent: rules.content(),
    force: true
  });
  let data = await getData({
    protocol: 'http',
    host: 'localhost',
    port: 11111
  })
  assert((data as any).list[0]==='spec');
  await removeRule({
    name: 'spec',
    protocol: 'http',
    host: 'localhost',
    port: 11111
  });
  data = await getData({
    protocol: 'http',
    host: 'localhost',
    port: 11111
  })
  assert((data as any).list.length===0);
  await setValue({
    protocol: 'http',
    host: 'localhost',
    port: 11111,
    name: '123',
    value: 'abc',
  })
  let values = await getValues({
    protocol: 'http',
    host: 'localhost',
    port: 11111
  })
  assert((values as any)[0].name==='123');
  assert((values as any)[0].data==='abc');
  await removeValue({
    protocol: 'http',
    host: 'localhost',
    port: 11111,
    name: '123'
  })
  values = await getValues({
    protocol: 'http',
    host: 'localhost',
    port: 11111
  })
  assert((values as any).length===0);
  stopServerSync({
    baseDir: './temp',
    identifier: 'spec'
  });
}

main();
