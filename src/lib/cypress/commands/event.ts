import './env';

export interface EventCancellationOptions {
  cancellationToken: string;
}

export interface EventAutoHandlerOptions extends EventCancellationOptions {
  name: string;
  handler: (...args: any[]) => void;
}

declare global {
  namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    export interface Chainable<Subject> {
      eventAddAutoHandler(options: EventAutoHandlerOptions): Chainable<void>;
      eventCancelAutoHandler(options: EventCancellationOptions): Chainable<void>;
    }
  }
}

Cypress.Commands.add('eventCancelAutoHandler', (options: EventCancellationOptions) => {
  cy.emit(`eventCancelAutoHandler:${options.cancellationToken}`, true);
});

Cypress.Commands.add('eventAddAutoHandler', (options: EventAutoHandlerOptions) => {
  cy.once(`eventCancelAutoHandler:${options.cancellationToken}`, () => {
    cy.removeListener(options.name, options.handler);
  });
  cy.on(options.name, options.handler);
});
