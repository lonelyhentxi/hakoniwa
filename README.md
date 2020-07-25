# Hakoniwa

Miniature wonder toolbox for front-end development.

## Design

1. can works with or contains a proxy that proxy the requests and the responses of your program.
2. can define schema to test that:
    - contains mock data or other development resources.
    - defines api pattern, such as protocol, host, port, path, body, etc, or pattern of other resources.
    - contains one or more test scripts (e2e or unit)
3. controller that can input test schema, recognize the api pattern and cooperate with the proxy to feed mock data when your program needs, then run test scripts to test your program

## Install

```shell
npm install --save-dev hakoniwa cypress cross-env webpack typescript ts-loader @cypress/webpack-preprocessor
# or
yarn install --dev hakoniwa cypress cross-env webpack typescript ts-loader @cypress/webpack-preprocessor
```