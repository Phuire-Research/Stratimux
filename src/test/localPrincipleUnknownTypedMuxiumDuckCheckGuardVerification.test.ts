/*<$
For the asynchronous graph programming framework Stratimux, generate a test that verifies the
LocalPrinciple helper accepts an unknown-typed second argument, performs a runtime duck-check against
the canonical Muxium function surface key set, and returns true only when the input exposes those
function members. This eliminates the TypeScript friction at call sites where a Muxium with different
generic parameters is structurally compatible but nominally rejected.
$>*/
/*<#*/
import { muxification } from '../model/muxium/muxium';
import { createLocalPrinciple } from '../model/localPrinciple';
import { isMuxiumShape, muxiumCanonicalFunctionSurfaceKeySet } from '../model/muxium/muxiumHelpers';
import { createCounterConcept } from '../concepts/counter/counter.concept';

jest.setTimeout(10000);

describe('Local Principle Unknown Muxium Duck Check Guard Behavioral Verification', () => {
  test('Muxium Shaped Object Passes Guard And Returns True Enabling Typed Plan Access', (done) => {
    const muxium = muxification('local principle duck check guard pass case', {
      counter: createCounterConcept()
    }, { logging: false });

    let principleFuncInvoked = false;

    const result = createLocalPrinciple(
      'Muxium Shape Confirmed True All Canonical Keys Present',
      muxium,
      ({ plan }) => {
        principleFuncInvoked = true;
        expect(typeof plan).toBe('function');
      }
    );

    expect(result).toBe(true);

    setTimeout(() => {
      expect(principleFuncInvoked).toBe(true);
      muxium.close();
      done();
    }, 500);
  });

  test('Non Muxium Object With Missing Canonical Keys Fails Guard And Returns False', (done) => {
    let principleFuncInvoked = false;

    const nonMuxium = {
      foo: 'bar',
      subscribe: 'not-a-function',
      dispatch: undefined,
      plan: 42
    };

    const result = createLocalPrinciple(
      'Non Muxium Object False Canonical Keys Absent Or Non Function',
      nonMuxium,
      () => {
        principleFuncInvoked = true;
      }
    );

    expect(result).toBe(false);
    expect(principleFuncInvoked).toBe(false);
    expect(isMuxiumShape(nonMuxium)).toBe(false);
    done();
  });

  test('Null Or Undefined Input Fails Guard And Returns False Without Throw', (done) => {
    let principleFuncInvokedFromNull = false;
    let principleFuncInvokedFromUndefined = false;

    expect(() => {
      const nullResult = createLocalPrinciple(
        'Null Undefined Input False Early Return Guard Activated Null Case',
        null,
        () => { principleFuncInvokedFromNull = true; }
      );
      expect(nullResult).toBe(false);
    }).not.toThrow();

    expect(() => {
      const undefinedResult = createLocalPrinciple(
        'Null Undefined Input False Early Return Guard Activated Undefined Case',
        undefined,
        () => { principleFuncInvokedFromUndefined = true; }
      );
      expect(undefinedResult).toBe(false);
    }).not.toThrow();

    expect(isMuxiumShape(null)).toBe(false);
    expect(isMuxiumShape(undefined)).toBe(false);
    expect(principleFuncInvokedFromNull).toBe(false);
    expect(principleFuncInvokedFromUndefined).toBe(false);

    expect(muxiumCanonicalFunctionSurfaceKeySet).toEqual([
      'subscribe', 'unsubscribe', 'close', 'dispatch', 'plan'
    ]);

    done();
  });
});
/*#>*/
