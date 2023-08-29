import { Observable, Subject, Subscriber } from 'rxjs';
import { Concept } from './concept';
import { Action } from './action';

export type PrincipleFunction = (
  observer: Subscriber<Action>,
  concepts: Concept[],
  subConcept$: Subject<Concept[]>,
) => void;

export function createPrinciple$(
  principleFunc: PrincipleFunction,
  concepts: Concept[],
  concepts$: Subject<Concept[]>,
): Observable<Action> {
  return new Observable(function (obs: Subscriber<Action>) {
    principleFunc(obs, concepts, concepts$);
  });
}
