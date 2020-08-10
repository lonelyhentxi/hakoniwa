import { searchReactNode } from '../../hack/react';

export interface ReactNodeIdentifierOptions {
  searchSelector: string;
}

export interface ReactNodeInvokeOptions extends ReactNodeIdentifierOptions {
  method: string;
  args?: any[];
}

declare global {
  namespace Cypress {
    export interface Chainable<Subject> {
      reactInvoke(options: ReactNodeInvokeOptions): Chainable<any>;
    }
  }
}

Cypress.Commands.add('reactInvoke', (options: ReactNodeInvokeOptions) => {
  const config = Object.assign({
    args: []
  }, options);
  return cy.get(config.searchSelector)
    .then((el)=>{
      const reactNode = searchReactNode(el);
      return cy.wrap(reactNode[config.method](...config.args));
    });
})