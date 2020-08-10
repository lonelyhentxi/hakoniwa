import { Queue } from 'queue-typescript';

export function searchMatching(root: object, matching: (curr: any) => boolean): any | null {
  const note = new Set();
  const queue = new Queue<any>(root);
  queue.enqueue(root);
  while (queue.length > 0) {
    const current = queue.dequeue();
    note.add(current);
    if (matching(current)) {
      return current;
    }
    const children = current===null || current === undefined ? []: Object.keys(current);
    children.forEach(k => {
      try {
        const o = (current as any)[k];
        if (!note.has(o)) {
          queue.enqueue(o);
        }
      } catch (e) {

      }
    })
  }
  return null;
}


export function searchMatchings(root: object, matching: (curr: any) => boolean): any[] {
  const note = new Set();
  const queue = new Queue<any>(root);
  queue.enqueue(root);
  const res = [];
  while (queue.length > 0) {
    const current = queue.dequeue();
    note.add(current);
    if (matching(current)) {
      res.push(current);
    }
    const children = current===null || current === undefined ? []: Object.keys(current);
    children.forEach(k => {
      try {
        const o = (current as any)[k];
        if (!note.has(o)) {
          queue.enqueue(o);
        }
      } catch (e) {

      }
    })
  }
  return res;
}