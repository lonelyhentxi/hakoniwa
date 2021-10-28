# Hakoniwa

Miniature wonder toolbox for front-end development.

**Warning: Early stage of development now!**

## Initial Design

1. can works with or contains a proxy that proxy the requests and the responses of your program.
2. can define schema to test that:
    - contains mock data or other development resources.
    - defines api pattern, such as protocol, host, port, path, body, etc, or pattern of other resources.
    - contains one or more test scripts (e2e or unit)
3. controller that can input test schema, recognize the api pattern and cooperate with the proxy to feed mock data when your program needs, then run test scripts to test your program

## Install

```shell
npm install --save-dev hakoniwa cypress cross-env webpack typescript ts-loader @cypress/webpack-preprocessor
hakoniwa-cli init
```

## Run

```shell
hakoniwa-cli open
```

## RoadMap

### Version 0.2.0

- [ ] Advanced proxy functions
    - [x] Proxy values supports 
    - [ ] HTTPS supports
    - [x] Enable HTTP2
	- [x] Simple empty response and binary response support
- [ ] Tracking logging validation
    - [x] Basic tools
    - [ ] Advance validation
- [ ] Release helper
    - [ ] Release observer
    - [ ] Auto remove console and debugger when releasing
- [ ] Debugging mode
    - [ ] Bundle version checker
    - [ ] invoke, spy and stub of libraries such as react
        - [ ] React support
            - [x] Basic
        - [ ] Vue support
        - [ ] Angular support
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