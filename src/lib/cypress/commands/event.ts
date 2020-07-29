import './env';

export interface CancellationOptions {
  cancellationToken: string;
}

export interface AutoHandlerOptions extends CancellationOptions {
  name: string;
  handler: (...args: any[]) => void;
}

declare global {
  namespace Cypress {
    export interface Chainable<Subject> {
      addAutoHandler(options: AutoHandlerOptions): Chainable<void>;
      cancelAutoHandler(options: CancellationOptions): Chainable<void>;
    }
  }
}

Cypress.Commands.add('cancelAutoHandler', (options: CancellationOptions) => {
  cy.emit(`cancelAutoHandler:${options.cancellationToken}`, true);
})

Cypress.Commands.add('addAutoHandler', (options: AutoHandlerOptions) => {
  cy.once(`cancelAutoHandler:${options.cancellationToken}`, () => {
    cy.removeListener(options.name, options.handler);
  })
  cy.on(options.name, options.handler);
})