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

## RoadMap

### Version 0.2.0

- [ ] Advanced proxy functions
    - [ ] Proxy values supports 
    - [ ] Https supports
    - [x] Enable HTTP2
- [ ] Tracking logging validation
- [ ] Release helper
    - [ ] Release observer
    - [ ] Auto remove console and debugger when releasing
- [ ] Debugging mode
    - [ ] Bundle version checker
- [ ] Advanced signing in and authentication
- [ ] Better command line tools

### Version 0.1.0

- [x] Basic signing in and authentication
- [x] Basic proxy controlling
    - [x] Start/Stop proxy service
    - [x] Edit literal proxy rule
    - [x] Get proxy data info
    - [x] Clear proxy rules
    - [x] Enable multi-rules
    - [x] Proxy switching
- [x] Basic rules controlling
- [x] Auto hide scrollbar - to simulate a mobile phone