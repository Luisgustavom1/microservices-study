import { BaseEvent } from "@event-bus/events/base.event";

export class Reducer<S = unknown> {
  constructor() {}

  public reduce(state: S, events: Array<BaseEvent<unknown, S>>) {
    return events.reduce((state, event) => {
      return event.commit(state, event);
    }, state)
  }
}