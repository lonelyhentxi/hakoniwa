export interface TrackingLogger<Log> {
  track(log: Log): void;
}

export interface TimelineTrackingLoggerWhenOptions<Mark = any> {
  froms?: Mark[];
  tos?: Mark[];
}

export interface TimelineTrackingLogger<Log, Mark = any> extends TrackingLogger<Log> {
  mark(mark: Mark): void;
  when(options?: TimelineTrackingLoggerWhenOptions<Mark>): Log[];
  updateTime(): number;
}

export type TimelineTrackingLoggerChecker<Log> = (logs: Log[]) => boolean;

export class DefaultTimelineTrackingLogger<Log, Mark = any> implements TimelineTrackingLogger<Log, Mark> {
  lastUpdateTime = Date.now();
  logs: Log[] = [];
  marks = new Map<Mark, number>();
  mark(mark: Mark) {
    this.marks.set(mark, this.logs.length);
  }
  track(log: Log) {
    this.logs.push(log);
    this.lastUpdateTime = Date.now();
  }
  when({ froms, tos }: TimelineTrackingLoggerWhenOptions<Mark> = {}): Log[] {
    const from = Math.max(0, ...(froms ?? []).map(m => this.marks.get(m) ?? 0));
    const to = Math.min(this.logs.length, ...(tos ?? []).map(m => this.marks.get(m) ?? this.logs.length));
    return this.logs.slice(from, to);
  }
  updateTime(): number {
    return this.lastUpdateTime;
  }
}