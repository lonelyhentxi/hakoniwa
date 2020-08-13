export function isIterable (target: any) {
  return target!==null && typeof(Object(target)[Symbol.iterator])==='function';
}