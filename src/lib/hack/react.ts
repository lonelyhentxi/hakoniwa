import {searchMatching, searchMatchings} from './search';

export function elToReactNode(el: any) {
  if (!el) {
    return null;
  }
  const keys = Object.keys(el);
  if (keys.length === 0) {
    return null;
  }
  for (const key of keys) {
    if (key.startsWith('__reactInternalInstance$')) {
      return (el as any)[key];
    }
  }
  return null;
}

export function searchReactNode(searchRoot: any) {
  const reactEl = searchMatching(searchRoot, curr => elToReactNode(curr) !== null);
  return elToReactNode(reactEl);
}

export function searchReactNodes(searchRoot: any) {
  const reactEls = searchMatchings(searchRoot, curr => elToReactNode(curr) !== null);
  return reactEls.map(el => elToReactNode(el));
}
