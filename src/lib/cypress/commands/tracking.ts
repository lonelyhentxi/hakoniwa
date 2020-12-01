import './env';
import 'cypress-wait-until';
import { RouteMatcherOptions, CyHttpMessages } from 'cypress/types/net-stubbing'
import {
  TrackingLogger,
  DefaultTimelineTrackingLogger,
  TimelineTrackingLogger,
  TimelineTrackingLoggerChecker,
} from '../../qc/tracking';
import {isIterable} from '../../hack/meta';
import {some, every, isMatch} from 'lodash';

export type IncomingHttpRequest = CyHttpMessages.IncomingHttpRequest;

export class TrackingTimelineHTTPTrackingLogger<Mark = any> extends DefaultTimelineTrackingLogger<
  IncomingHttpRequest,
  Mark
> {}
export type TrackingTimelineTrackingLoggerChecker = TimelineTrackingLoggerChecker<IncomingHttpRequest>;

export interface TrackingRegisterHTTPLoggerOptions<TL extends TrackingLogger<IncomingHttpRequest>>
  extends Partial<RouteMatcherOptions> {
  trackingLogger: TL;
}

export interface TrackingGetHTTPLoggerOptions<TL extends TrackingLogger<IncomingHttpRequest>> {
  trackingLogger: TL;
}

export interface TrackingMarkHTTPLoggerOptions<TL extends TimelineTrackingLogger<IncomingHttpRequest>> {
  trackingLogger: TL;
  mark: any;
}

export interface TrackingWaitHTTPLoggerOptions<Subject, TL extends TimelineTrackingLogger<IncomingHttpRequest>>
  extends WaitUntilOptions<Subject> {
  trackingLogger: TL;
  checker: (logs: IncomingHttpRequest[]) => boolean;
  mark?: any;
}

export interface TrackingCheckHTTPLoggerOptions<Subject, TL extends TimelineTrackingLogger<IncomingHttpRequest>>
  extends TrackingWaitHTTPLoggerOptions<Subject, TL> {
  f: () => Cypress.Chainable<any> | any;
}

export interface TrackingThrottleHTTPLoggerOptions<Subject, TL extends TimelineTrackingLogger<IncomingHttpRequest>>
  extends WaitUntilOptions<Subject> {
  trackingLogger: TL;
}

export interface TrackingRegisterMethodLoggerOptions {
  obj: any;
  method: string;
}

export interface TrackingAddHTTPLoggerOptions<
  TL extends TrackingLogger<IncomingHttpRequest> = TrackingTimelineHTTPTrackingLogger<any>
> extends Partial<RouteMatcherOptions> {
  trackingLogger?: TL;
  routeAction?: (router: ReturnType<typeof cy.intercept>) => ReturnType<typeof cy.intercept>;
}

export type TrackingHTTPResJSONBody = {
  [key: string]: any;
  [index: number]: any;
};

export type TrackingHTTPResPlainBody =
  | {
      [key: string]: any;
      [index: number]: any;
    }
  | Iterable<[any, any]>
  | Iterable<any>;

declare global {
  namespace Cypress {
    export type CyRouteOptions = RouteOptions;
    export interface Chainable<Subject> {
      trackingRegisterHTTPLogger<TL extends TrackingLogger<IncomingHttpRequest>>(
        options: TrackingRegisterHTTPLoggerOptions<TL>,
      ): ReturnType<typeof cy.intercept>;
      trackingGetHTTPLogger<TL extends TrackingLogger<IncomingHttpRequest>>(
        options: TrackingGetHTTPLoggerOptions<TL>,
      ): Chainable<TL>;
      trackingMarkHTTPLogger<TL extends TimelineTrackingLogger<IncomingHttpRequest>>(
        options: TrackingMarkHTTPLoggerOptions<TL>,
      ): Chainable<TL>;
      trackingWaitHTTPLogger<TL extends TimelineTrackingLogger<IncomingHttpRequest>>(
        options: TrackingWaitHTTPLoggerOptions<Subject, TL>,
      ): Chainable<TL>;
      trackingThrottleHTTPLogger<TL extends TimelineTrackingLogger<IncomingHttpRequest>>(
        options: TrackingThrottleHTTPLoggerOptions<Subject, TL>,
      ): Chainable<TL>;
      trackingCheckHTTPLogger<TL extends TimelineTrackingLogger<IncomingHttpRequest>>(
        options: TrackingCheckHTTPLoggerOptions<Subject, TL>,
      ): Chainable<TL>;
      trackingRegisterMethodLogger(options: TrackingRegisterMethodLoggerOptions): ReturnType<typeof cy.spy>;
    }
  }
}

Cypress.Commands.add(
  'trackingRegisterHTTPLogger',
  (options: TrackingRegisterHTTPLoggerOptions<TrackingLogger<IncomingHttpRequest>>) => {
    const logger = options.trackingLogger;
    return cy.intercept(options, req => {
      logger.track(req);
    });
  },
);

Cypress.Commands.add(
  'trackingGetHTTPLogger',
  (options: TrackingGetHTTPLoggerOptions<TrackingLogger<IncomingHttpRequest>>) => {
    return cy.wrap(options.trackingLogger);
  },
);

Cypress.Commands.add(
  'trackingMarkHTTPLogger',
  (options: TrackingMarkHTTPLoggerOptions<TimelineTrackingLogger<IncomingHttpRequest>>) => {
    const config = options;
    const trackingLogger = config.trackingLogger;
    const mark = config.mark;
    cy.trackingGetHTTPLogger({
      trackingLogger,
    }).then(tl => {
      tl.mark(mark);
    });
    return cy.trackingGetHTTPLogger({
      trackingLogger,
    });
  },
);

Cypress.Commands.add(
  'trackingWaitHTTPLogger',
  (options: TrackingWaitHTTPLoggerOptions<any, TimelineTrackingLogger<IncomingHttpRequest>>) => {
    const fromNow = !options.mark;
    return cy
      .wrap(() => Date.now())
      .then(g => {
        const config = Object.assign(
          {
            mark: g(),
          },
          options,
        );
        const trackingLogger = config.trackingLogger;
        const checker = config.checker;
        const mark = config.mark;
        if (fromNow) {
          cy.trackingMarkHTTPLogger({
            trackingLogger,
            mark,
          });
        }
        cy.waitUntil(() => checker(trackingLogger.when({froms: [mark]})), {
          ...config,
        });
        return cy.trackingGetHTTPLogger({
          trackingLogger,
        });
      });
  },
);

Cypress.Commands.add(
  'trackingThrottleHTTPLogger',
  (options: TrackingThrottleHTTPLoggerOptions<any, TimelineTrackingLogger<IncomingHttpRequest>>) => {
    const {HAKONIWA_TRACKING_HTTP_THROTTLE_TIME} = Cypress.config('env');
    const config = Object.assign(
      {
        interval: HAKONIWA_TRACKING_HTTP_THROTTLE_TIME,
      },
      options,
    );
    cy.waitUntil(() => Date.now() - config.trackingLogger.updateTime() >= config.interval, {
      ...config,
    });
    return cy.trackingGetHTTPLogger({
      trackingLogger: config.trackingLogger,
    });
  },
);

Cypress.Commands.add(
  'trackingCheckHTTPLogger',
  (options: TrackingCheckHTTPLoggerOptions<any, TimelineTrackingLogger<IncomingHttpRequest>>) => {
    const fromNow = !options.mark;
    return cy
      .wrap(() => Date.now())
      .then(g => {
        const config = Object.assign(
          {
            mark: g(),
          },
          options,
        );
        const trackingLogger = config.trackingLogger;
        const checker = config.checker;
        const mark = config.mark;
        const execAction = config.f;
        if (fromNow) {
          cy.trackingMarkHTTPLogger({
            trackingLogger,
            mark,
          });
        }
        execAction();
        cy.waitUntil(() => checker(trackingLogger.when({froms: [mark]})), {
          ...config,
        });
        return cy.trackingGetHTTPLogger({
          trackingLogger,
        });
      });
  },
);

Cypress.Commands.add('trackingRegisterMethodLogger', (options: TrackingRegisterMethodLoggerOptions) => {
  return cy.spy(options.obj, options.method) as any;
});

export function trackingAddHTTPLogger<
  TL extends TrackingLogger<IncomingHttpRequest> = TrackingTimelineHTTPTrackingLogger<any>
>(options: TrackingAddHTTPLoggerOptions<TL> = {}) {
  const config = Object.assign(
    {
      trackingLogger: new TrackingTimelineHTTPTrackingLogger(),
      routeAction: (route: ReturnType<typeof cy.intercept>) => route,
    },
    options,
  );
  cy.trackingRegisterHTTPLogger(config);
  return config.trackingLogger;
}

export function trackingGenerateHTTPReqPlainBodyCheck(body: TrackingHTTPResPlainBody) {
  const pairs: [any, any][] = [];
  if (isIterable(body)) {
    for (const p of body as any) {
      const pair: [any, any] = p instanceof Array ? [p[0], p[1]] : [p, ''];
      pairs.push(pair);
    }
  } else {
    for (const k of Object.keys(body)) {
      pairs.push([k, (body as any)[k]]);
    }
  }
  const regs = pairs.map(p => new RegExp(`${encodeURIComponent(p[0])}=${encodeURIComponent(p[1])}`));
  return (logs: IncomingHttpRequest[]) => {
    return some(logs, l => {
      return every(regs, r => l.body.match(r));
    });
  };
}

export function trackingGenerateHTTPReqJSONBodyCheck(body: TrackingHTTPResJSONBody) {
  return (logs: IncomingHttpRequest[]) => {
    return some(logs, l => {
      return isMatch(l.body as any, body);
    });
  };
}

export function trackingGenerateHTTPReqQueriesCheck(body: TrackingHTTPResPlainBody) {
  const pairs: [any, any][] = [];
  if (isIterable(body)) {
    for (const p of body as any) {
      const pair: [any, any] = p instanceof Array ? [p[0], p[1]] : [p[0], ''];
      pairs.push(pair);
    }
  } else {
    for (const k of Object.keys(body)) {
      pairs.push([k, (body as any)[k]]);
    }
  }
  const regs = pairs.map(p => new RegExp(`${encodeURIComponent(p[0])}=${encodeURIComponent(p[1])}`));
  return (logs: IncomingHttpRequest[]) => {
    return some(logs, l => {
      const queriesString = l.url.split('?').slice(1).join('?');
      return every(regs, r => queriesString.match(r));
    });
  };
}
