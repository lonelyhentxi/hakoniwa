import './env';
import 'cypress-wait-until';
import {
  TrackingLogger,
  DefaultTimelineTrackingLogger,
  TimelineTrackingLogger,
  TimelineTrackingLoggerChecker,
} from '../../qc/tracking';
import {isIterable} from '../../hack/meta';
import {some, every, isMatch} from 'lodash';

export class TrackingTimelineHTTPTrackingLogger<Mark = any> extends DefaultTimelineTrackingLogger<
  Cypress.WaitXHR,
  Mark
> {}
export type TrackingTimelineTrackingLoggerChecker = TimelineTrackingLoggerChecker<Cypress.WaitXHR>;

export interface TrackingRegisterHTTPLoggerOptions<TL extends TrackingLogger<Cypress.WaitXHR>>
  extends Partial<Cypress.RouteOptions> {
  trackingLogger: TL;
}

export interface TrackingGetHTTPLoggerOptions<TL extends TrackingLogger<Cypress.WaitXHR>> {
  trackingLogger: TL;
}

export interface TrackingMarkHTTPLoggerOptions<TL extends TimelineTrackingLogger<Cypress.WaitXHR>> {
  trackingLogger: TL;
  mark: any;
}

export interface TrackingWaitHTTPLoggerOptions<Subject, TL extends TimelineTrackingLogger<Cypress.WaitXHR>>
  extends WaitUntilOptions<Subject> {
  trackingLogger: TL;
  checker: (logs: Cypress.WaitXHR[]) => boolean;
  mark?: any;
}

export interface TrackingCheckHTTPLoggerOptions<Subject, TL extends TimelineTrackingLogger<Cypress.WaitXHR>>
  extends TrackingWaitHTTPLoggerOptions<Subject, TL> {
  f: () => Cypress.Chainable<any> | any;
}

export interface TrackingThrottleHTTPLoggerOptions<Subject, TL extends TimelineTrackingLogger<Cypress.WaitXHR>>
  extends WaitUntilOptions<Subject> {
  trackingLogger: TL;
}

export interface TrackingRegisterMethodLoggerOptions {
  obj: any;
  method: string;
}

export interface TrackingAddHTTPLoggerOptions<
  TL extends TrackingLogger<Cypress.WaitXHR> = TrackingTimelineHTTPTrackingLogger<any>
> extends Partial<Cypress.RouteOptions> {
  trackingLogger?: TL;
  routeAction?: (router: ReturnType<typeof cy.route>) => Cypress.Chainable<void>;
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
      trackingRegisterHTTPLogger<TL extends TrackingLogger<Cypress.WaitXHR>>(
        options: TrackingRegisterHTTPLoggerOptions<TL>,
      ): ReturnType<typeof cy.route>;
      trackingGetHTTPLogger<TL extends TrackingLogger<Cypress.WaitXHR>>(
        options: TrackingGetHTTPLoggerOptions<TL>,
      ): Chainable<TL>;
      trackingMarkHTTPLogger<TL extends TimelineTrackingLogger<Cypress.WaitXHR>>(
        options: TrackingMarkHTTPLoggerOptions<TL>,
      ): Chainable<TL>;
      trackingWaitHTTPLogger<TL extends TimelineTrackingLogger<Cypress.WaitXHR>>(
        options: TrackingWaitHTTPLoggerOptions<Subject, TL>,
      ): Chainable<TL>;
      trackingThrottleHTTPLogger<TL extends TimelineTrackingLogger<Cypress.WaitXHR>>(
        options: TrackingThrottleHTTPLoggerOptions<Subject, TL>,
      ): Chainable<TL>;
      trackingCheckHTTPLogger<TL extends TimelineTrackingLogger<Cypress.WaitXHR>>(
        options: TrackingCheckHTTPLoggerOptions<Subject, TL>,
      ): Chainable<TL>;
      trackingRegisterMethodLogger(options: TrackingRegisterMethodLoggerOptions): ReturnType<typeof cy.spy>;
    }
  }
}

Cypress.Commands.add(
  'trackingRegisterHTTPLogger',
  (options: TrackingRegisterHTTPLoggerOptions<TrackingLogger<Cypress.WaitXHR>>) => {
    const logger = options.trackingLogger;
    return cy.route({
      ...options,
      onRequest: xhr => {
        logger.track(xhr);
      },
    });
  },
);

Cypress.Commands.add(
  'trackingGetHTTPLogger',
  (options: TrackingGetHTTPLoggerOptions<TrackingLogger<Cypress.WaitXHR>>) => {
    return cy.wrap(options.trackingLogger);
  },
);

Cypress.Commands.add(
  'trackingMarkHTTPLogger',
  (options: TrackingMarkHTTPLoggerOptions<TimelineTrackingLogger<Cypress.WaitXHR>>) => {
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
  (options: TrackingWaitHTTPLoggerOptions<any, TimelineTrackingLogger<Cypress.WaitXHR>>) => {
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
  (options: TrackingThrottleHTTPLoggerOptions<any, TimelineTrackingLogger<Cypress.WaitXHR>>) => {
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
  (options: TrackingCheckHTTPLoggerOptions<any, TimelineTrackingLogger<Cypress.WaitXHR>>) => {
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
  TL extends TrackingLogger<Cypress.WaitXHR> = TrackingTimelineHTTPTrackingLogger<any>
>(options: TrackingAddHTTPLoggerOptions<TL> = {}) {
  const config = Object.assign(
    {
      trackingLogger: new TrackingTimelineHTTPTrackingLogger(),
      routeAction: (route: ReturnType<typeof cy.route>) => route,
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
  return (logs: Cypress.WaitXHR[]) => {
    return some(logs, l => {
      return every(regs, r => l.requestBody.match(r));
    });
  };
}

export function trackingGenerateHTTPReqJSONBodyCheck(body: TrackingHTTPResJSONBody) {
  return (logs: Cypress.WaitXHR[]) => {
    return some(logs, l => {
      return isMatch(l.requestBody as any, body);
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
  return (logs: Cypress.WaitXHR[]) => {
    return some(logs, l => {
      const queriesString = l.url.split('?').slice(1).join('?');
      return every(regs, r => queriesString.match(r));
    });
  };
}
