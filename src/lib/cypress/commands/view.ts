import { CancellationOptions } from './event';
import './event';

export type SetScrollbarOptions = { styles?: string };
export type AutoSetScrollbarOptions = Partial<CancellationOptions> & SetScrollbarOptions;

declare global {
  namespace Cypress {
    export interface Chainable<Subject> {
      setScrollbar(options?: SetScrollbarOptions): Chainable<void>;
      autoSetScrollbar(options: AutoSetScrollbarOptions): Chainable<void>;
    }
  }
}

const setScrollbar = (options: SetScrollbarOptions = {}) => {
  const styles = options.styles || '0px';
  const $head = Cypress.$('head');
  ($head).append(`<style>
  body::-webkit-scrollbar {
    width: ${styles};
  }
  
  body {
    -ms-overflow-style: ${styles};
    scrollbar-width: ${styles};
  }
  </style>`);
}

Cypress.Commands.add('setScrollbar', setScrollbar);

Cypress.Commands.add('autoSetScrollbar', (options: AutoSetScrollbarOptions) => {
  const config = Object.assign({
    cancellationToken: 'autoSetScrollbar'
  }, options);
  cy.addAutoHandler({
    cancellationToken: config.cancellationToken,
    name: 'window:before:load',
    handler: () => setScrollbar(config),
  })
});