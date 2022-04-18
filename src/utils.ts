export function isFunction(func): func is AnyFunction {
  return typeof func === 'function' && func.length <= 1;
}

export interface AnyFunction {
  (...args: any[]): any;
}

export type Observer = {
  next: AnyFunction;
  error?: AnyFunction;
  complete?: AnyFunction;
};

export type SubscriberFunction = (observer: Observer) => void;
export type Subscription = {
  unsubscribe(): boolean;
};
