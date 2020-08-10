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