import Observable from './index';
let observer = {
    next: jest.fn(),
    error: jest.fn(),
    complete: jest.fn(),
};
beforeEach(() => {
    observer = { ...observer };
});
describe('Observable', () => {
    test('should be a class', () => {
        expect(new Observable(() => { })).toBeInstanceOf(Observable);
    });
    test('should run successfully', () => {
        let observable = new Observable(ob => {
            ob.next(1);
            ob.next(2);
            ob.next(3);
        });
        observable.subscribe(observer);
        expect(observer.next).toBeCalledTimes(3);
    });
    test('observer next should not be called after complete or error triggered', () => {
        let observable = new Observable(ob => {
            ob.next(1);
            ob.next(2);
            ob.next(3);
            ob.error();
            ob.next(1);
        });
        observable.subscribe(observer);
        expect(observer.next).toBeCalledTimes(3);
        expect(observer.error).toBeCalledTimes(1);
        observable = new Observable(ob => {
            ob.next(1);
            ob.next(2);
            ob.next(3);
            ob.complete();
            ob.next(1);
        });
        observable.subscribe(observer);
        expect(observer.next).toBeCalledTimes(6);
        expect(observer.complete).toBeCalledTimes(1);
    });
    test('should be fine in aync function', () => {
        const observable = new Observable(subscriber => {
            subscriber.next(1);
            subscriber.next(2);
            setTimeout(() => {
                subscriber.next(3);
                subscriber.next(4);
                subscriber.complete();
            }, 100);
        });
        observable.subscribe(observer);
        expect(observer.next).toBeCalledTimes(4);
        expect(observer.complete).toBeCalledTimes(1);
        expect(observer.next.mock.calls).toEqual([[1], [2], [3], [4]]);
        expect(observer.complete.mock.calls).toEqual([[undefined]]);
    });
});
