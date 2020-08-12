import './env';
import 'cypress-wait-until';
import { TrackingLogger, DefaultTimelineTrackingLogger, TimelineTrackingLogger, TimelineTrackingLoggerChecker } from '../../qc/tracking';

export class TrackingTimelineHTTPTrackingLogger<Mark = any> extends DefaultTimelineTrackingLogger<Cypress.WaitXHR, Mark> {}
export type TrackingTimelineTrackingLoggerChecker = TimelineTrackingLoggerChecker<Cypress.WaitXHR>;

export interface TrackingAddHTTPLoggerOptions<TL extends TrackingLogger<Cypress.WaitXHR>> extends Partial<Cypress.RouteOptions> {
  trackingLogger: TL;
}

export interface TrackingGetHTTPLoggerOptions<TL extends TrackingLogger<Cypress.WaitXHR>> {
  trackingLogger: TL;
}

export interface TrackingMarkHTTPLoggerOptions<TL extends TimelineTrackingLogger<Cypress.WaitXHR>> {
  trackingLogger: TL;
  mark: any;
}

export interface TrackingWaitHTTPLoggerOptions<Subject, TL extends TimelineTrackingLogger<Cypress.WaitXHR>> extends WaitUntilOptions<Subject> {
  trackingLogger: TL;
  checker: (logs: Cypress.WaitXHR[]) => boolean;
  mark?: any;
}

export interface TrackingThrottleHTTPLoggerOptions<Subject, TL extends TimelineTrackingLogger<Cypress.WaitXHR>> extends WaitUntilOptions<Subject> {
  trackingLogger: TL;
}

export interface TrackingAddMethodLoggerOptions {
  obj: any;
  method: string;
}

declare global {
  namespace Cypress {
    export type CyRouteOptions = RouteOptions;
    export interface Chainable<Subject> {
      trackingAddHTTPLogger<TL extends TrackingLogger<Cypress.WaitXHR>>(options: TrackingAddHTTPLoggerOptions<TL>): ReturnType<typeof cy.route>;
      trackingGetHTTPLogger<TL extends TrackingLogger<Cypress.WaitXHR>>(options: TrackingGetHTTPLoggerOptions<TL>): Chainable<TL>;
      trackingMarkHTTPLogger<TL extends TimelineTrackingLogger<Cypress.WaitXHR>>(options: TrackingMarkHTTPLoggerOptions<TL>): Chainable<TL>;
      trackingWaitHTTPLogger<TL extends TimelineTrackingLogger<Cypress.WaitXHR>>(options: TrackingWaitHTTPLoggerOptions<Subject,TL>): Chainable<TL>;
      trackingThrottleHTTPLogger<TL extends TimelineTrackingLogger<Cypress.WaitXHR>>(options: TrackingThrottleHTTPLoggerOptions<Subject, TL>): Chainable<TL>;
      trackingAddMethodLogger(options: TrackingAddMethodLoggerOptions): ReturnType<typeof cy.spy>;
    }
  }
}

Cypress.Commands.add('trackingAddHTTPLogger',(options: TrackingAddHTTPLoggerOptions<TrackingLogger<Cypress.WaitXHR>>) => {
  const logger = options.trackingLogger;
  return cy.route({
    ...options,
    onRequest: (xhr) => {
      logger.track(xhr);
    }
  });
});

Cypress.Commands.add('trackingGetHTTPLogger',(options: TrackingGetHTTPLoggerOptions<TrackingLogger<Cypress.WaitXHR>>) => {
  return cy.wrap(options.trackingLogger);
});

Cypress.Commands.add('trackingMarkHTTPLogger', (options: TrackingMarkHTTPLoggerOptions<TimelineTrackingLogger<Cypress.WaitXHR>>) => {
  const config = options;
  const trackingLogger = config.trackingLogger;
  const mark = config.mark;
  cy.trackingGetHTTPLogger({
    trackingLogger
  }).then((tl)=>{
    tl.mark(mark);
  });
  return cy.trackingGetHTTPLogger({
    trackingLogger
  });
})

Cypress.Commands.add('trackingWaitHTTPLogger', (options: TrackingWaitHTTPLoggerOptions<any, TimelineTrackingLogger<Cypress.WaitXHR>>) => {
  const fromNow = !options.mark;
  const config = Object.assign({
    mark: Date.now(),
  }, options);
  const trackingLogger = config.trackingLogger;
  const checker = config.checker;
  const mark = config.mark;
  if(fromNow) {
    cy.trackingMarkHTTPLogger({
      trackingLogger,
      mark
    });
  }
  cy.waitUntil(()=>checker(trackingLogger.when({froms: [mark]})), {
    ...config
  });
  return cy.trackingGetHTTPLogger({
    trackingLogger
  });
})

Cypress.Commands.add('trackingThrottleHTTPLogger', (options: TrackingThrottleHTTPLoggerOptions<any, TimelineTrackingLogger<Cypress.WaitXHR>>)=>{
  const { HAKONIWA_TRACKING_HTTP_THROTTLE_TIME } = Cypress.config('env');
  const config = Object.assign({
    interval: HAKONIWA_TRACKING_HTTP_THROTTLE_TIME
  },options);
  cy.waitUntil(()=>Date.now()-config.trackingLogger.updateTime()>=config.interval, {
    ...config
  });
  return cy.trackingGetHTTPLogger({
    trackingLogger: config.trackingLogger
  });
})

Cypress.Commands.add('trackingAddMethodLogger', (options: TrackingAddMethodLoggerOptions) => {
  return cy.spy(options.obj, options.method) as any;
});