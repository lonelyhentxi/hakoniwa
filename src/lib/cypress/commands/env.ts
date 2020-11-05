import * as constants from '../../../constants/constants.browser';

const env = Object.assign(
  {
    ...constants,
  },
  Cypress.config('env'),
);

Cypress.config('env', env);
