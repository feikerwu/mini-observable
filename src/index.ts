import { v4 } from 'uuid';
import {
  isFunction,
  Observer,
  AnyFunction,
  Subscription,
  SubscriberFunction,
} from './utils';

/**
 * 核心思想
 * 每次订阅时，都用一个凭证维护订阅者的订阅关系
 * 每次push信息(调用next/error/complete函数)时，都会去校验订阅关系是否存在
 */
class Observable {
  private subscribed: Map<string, Observer> = new Map();

  constructor(private subscriberFunction: SubscriberFunction) {}

  /**
   *
   * @param observer 订阅者可以是一个函数或者标准的订阅对象
   * @returns
   */
  subscribe(observer: AnyFunction | Observer): Subscription {
    const { uuid, serializedObserver } = this.serialize(observer);
    this.subscribed.set(uuid, serializedObserver);

    /**
     * 开始推送数据
     */

    this.subscriberFunction(serializedObserver);
    return {
      unsubscribe: () => this.subscribed.delete(uuid),
    };
  }

  /**
   * 标准化观察者
   * @param observer
   */
  serialize(observer) {
    // const { wrapFunction } = this;
    const uuid = v4();

    let serializedObserver = isFunction(observer)
      ? {
          next: this.wrapFunction(uuid, observer),
          complete: this.wrapFunction(uuid, () => {}, true),
          error: this.wrapFunction(uuid, () => {}, true),
        }
      : {
          next: this.wrapFunction(uuid, observer.next),
          complete: this.wrapFunction(uuid, observer.complete, true),
          error: this.wrapFunction(uuid, observer.error, true),
        };

    return { uuid, serializedObserver };
  }

  /**
   * 确保每个函数执行时，订阅关系都还在
   * @param uuid 每个订阅生成的唯一序列号
   * @param func 订阅执行函数
   * @param remove 执行订阅后是否取消这个关联关系
   * @returns
   */
  wrapFunction(uuid: string, func: AnyFunction, remove = false): AnyFunction {
    return (...args: any[]) => {
      const { subscribed } = this;
      if (!subscribed.has(uuid)) {
        return;
      }

      if (func === undefined) {
        func = () => {};
      }

      func(...args);

      if (remove) {
        subscribed.delete(uuid);
      }
    };
  }
}

export default Observable;

// const observable = new Observable(subscriber => {
//   subscriber.next(1);
//   subscriber.next(2);
//   setTimeout(() => {
//     subscriber.next(3);
//     subscriber.next(4);
//     subscriber.complete();
//   }, 100);
// });

// observable.subscribe({
//   next: value => {
//     console.log('we got a value', value);
//   },
//   error: error => {
//     console.log('we got an error', error);
//   },
//   complete: () => {
//     console.log('ok, no more values');
//   },
// });
