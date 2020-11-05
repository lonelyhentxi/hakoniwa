import {searchReactNode} from '../../hack/react';

export interface ReactNodeIdentifierOptions {
  el: string | HTMLElement | any;
}

export interface ReactNodeMethodOptions extends ReactNodeIdentifierOptions {
  method: string;
}

export interface ReactNodeInvokeOptions extends ReactNodeMethodOptions {
  args?: any[];
}

declare global {
  namespace Cypress {
    export interface Chainable<Subject> {
      reactGet(options: ReactNodeIdentifierOptions): Chainable<any>;
      reactInvoke(options: ReactNodeInvokeOptions): Chainable<any>;
    }
  }
}

Cypress.Commands.add('reactGet', (options: ReactNodeIdentifierOptions) => {
  if (typeof options.el === 'string') {
    return cy.get(options.el).then(el => {
      const reactNode = searchReactNode(el);
      return cy.wrap(reactNode);
    });
  } else {
    const reactNode = searchReactNode(options.el);
    return cy.wrap(reactNode);
  }
});

Cypress.Commands.add('reactInvoke', (options: ReactNodeInvokeOptions) => {
  const config = Object.assign(
    {
      args: [],
    },
    options,
  );
  return cy.reactGet(config).then(reactNode => {
    return cy.wrap(reactNode[config.method](...config.args));
  });
});
