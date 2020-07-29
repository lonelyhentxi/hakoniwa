import { isFunction } from 'lodash';

export type CyHttpMethod = string;

export interface CyRouterOptions {
  method: CyHttpMethod
  url: string | RegExp
  response: any
  status: number
  delay: number
  headers: object | null
  force404: boolean
  onRequest(...args: any[]): void
  onResponse(...args: any[]): void
  onAbort(...args: any[]): void
}

export interface CyObjectLike {
  [key: string]: any
}

export interface CyWaitXHR {
  duration: number
  id: string
  method: CyHttpMethod
  request: {
    body: string | CyObjectLike
    headers: CyObjectLike
  }
  requestBody: CyWaitXHR['request']['body']
  requestHeaders: CyWaitXHR['request']['headers']
  response: {
    body: string | CyObjectLike
    headers: CyObjectLike
  }
  responseBody: CyWaitXHR['response']['body']
  responseHeaders: CyWaitXHR['response']['headers']
  status: number
  statusMessage: string
  url: string
  xhr: XMLHttpRequest
}

export interface DetailedTrackingOptions {
  name: string;
  routerOptions?: Partial<CyRouterOptions>;
  reqChecker?: Function, 
  customChecker?: (name: string) => any
}

export interface DetailedTrackingFieldsOptions {
  name: string;
  routerOptions?: Partial<CyRouterOptions>;
  reqFields: CyObjectLike;
  customChecker?: (name: string) => any;
}

// @TODO: fix this function
export const generateTrackingChecker = (options: Partial<CyRouterOptions>) => (detailedOptions: DetailedTrackingOptions) => {
    const config = Object.assign(detailedOptions??{
      
    }, options);
    const vars = { canActivate: true };
    cy.route(config).as(detailedOptions.name);
    return () => {
      if (vars.canActivate) {
        cy.wait(`@${detailedOptions.name}`);
        if(isFunction(detailedOptions.reqChecker)) {
          detailedOptions.reqChecker(cy.get(`@${detailedOptions.name}`).its('request'));
        }
        isFunction(detailedOptions.customChecker) && detailedOptions.customChecker(detailedOptions.name);
        vars.canActivate = false;
      }
    };
}

export const generateTrackingFieldsChecker = (options: Partial<CyRouterOptions>) => (detailedOptions: DetailedTrackingFieldsOptions) => {
  return generateTrackingChecker(options)({
    name: detailedOptions.name,
    routerOptions: detailedOptions.routerOptions,
    reqChecker: (req: Cypress.Chainable<CyWaitXHR>) => {
      req.its('body').should((body: CyWaitXHR['requestBody'])=>{
        for(const k of Object.keys(detailedOptions.reqFields)) {
          expect(body).to.have.property(k).and.to.equal(detailedOptions.reqFields[k]);
        }
      });
    },
    customChecker: detailedOptions.customChecker
  })
}