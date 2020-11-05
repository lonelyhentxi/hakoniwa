import {EventCancellationOptions} from './event';
import './event';

export type ViewSetScrollbarOptions = {styles?: string};
export type ViewAutoSetScrollbarOptions = Partial<EventCancellationOptions> & ViewSetScrollbarOptions;

declare global {
  namespace Cypress {
    export interface Chainable<Subject> {
      viewSetScrollbar(options?: ViewSetScrollbarOptions): Chainable<void>;
      viewAutoSetScrollbar(options?: ViewAutoSetScrollbarOptions): Chainable<void>;
    }
  }
}

const setScrollbar = (options: ViewSetScrollbarOptions = {}) => {
  const styles = options.styles || '0px';
  const $head = Cypress.$('head');
  $head.append(`<style>
  body::-webkit-scrollbar {
    width: ${styles};
  }
  
  body {
    -ms-overflow-style: ${styles};
    scrollbar-width: ${styles};
  }
  </style>`);
};

Cypress.Commands.add('viewSetScrollbar', setScrollbar);

Cypress.Commands.add('viewAutoSetScrollbar', (options: ViewAutoSetScrollbarOptions = {}) => {
  const config = Object.assign(
    {
      cancellationToken: 'autoSetScrollbar',
    },
    options,
  );
  cy.eventAddAutoHandler({
    cancellationToken: config.cancellationToken,
    name: 'window:before:load',
    handler: () => setScrollbar(config),
  });
});
