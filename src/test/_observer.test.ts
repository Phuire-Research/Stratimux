// Safe Keeping
import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";

export interface Observable<T> {
    subscribe: (observer: Observer<T>) => void
    unsubscribe: (observer: Observer<T>) => void
    notify(...args: unknown[]): void
}
export interface Observer<T> {
    notify(...args: unknown[]): void
}

export function createSubject<T>(): Observable<T> {
    const _observers: Set<Observer<T>> = new Set();
    return {
        subscribe: (observer: Observer<T>) => {
            _observers.add(observer);
        },
        unsubscribe: (observer: Observer<T>) => {
            _observers.delete(observer);
        },
        notify: (...args: unknown[]) => {
            _observers.forEach((obs: Observer<T>) => {
                obs.notify(...args);
            })
        } 
    }
}

export function createObserver<T>(observable: Observable<T>): Observer<T> {
    const observer: Observer<T> = {
        notify(...args: unknown[]) {
            console.log(args);
        }
    }
    observable.subscribe(observer);
    return observer;
}

const subject = createSubject();
const obs1 = createObserver(subject);
const obs2 = createObserver(subject);

subject.notify('TEST');
subject.unsubscribe(obs2);
subject.notify('TEST 2');

// Deno.test("Observer Test", () => {

//     assertEquals(1,1);
// });
