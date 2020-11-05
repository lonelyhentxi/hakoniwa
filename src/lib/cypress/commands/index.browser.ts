import './env';
import 'cypress-localstorage-commands';
import 'cypress-skip-and-only-ui/support';
import 'cypress-wait-until';
import 'cypress-promise/register';
import '@cypress/skip-test/support';
import './auth';
import './event';
import './proxy';
import './mock';
import './react';
import './tracking';
import './view';
import './style';
// @ts-ignore
import {skipOn, onlyOn} from '@cypress/skip-test';

declare function skipOn(condition: string | boolean, callback: () => void): void;
declare function onlyOn(condition: string | boolean, callback: () => void): void;

declare global {
  namespace Cypress {
    export interface Chainable<Subject> {
      skipOn(condition: string | boolean): Chainable<Subject>;
      onlyOn(condition: string | boolean): Chainable<Subject>;
    }
  }
}

export * as promisify from 'cypress-promise';

export * from './env';
export {skipOn, onlyOn};
export * from './auth';
export * from './event';
export * from './proxy';
export * from './mock';
export * from './react';
export * from './tracking';
export * from './view';
export * from './style';
