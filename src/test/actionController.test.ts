/*<$
For the asynchronous graph programming framework Stratimux, generate a test to ensure that the ActionController model is working as intended.
$>*/
/*<#*/
import { ActionController, createActionController$ } from '../model/actionController';
import { axiumBadActionType  } from '../concepts/axium/qualities/badAction.quality';
import { axiumLog, axiumLogType } from '../concepts/axium/qualities/log.quality';

test('ActionController Expired Test', (done) => {
  const act = axiumLog({agreement: 200});
  const cont = new ActionController(act);
  cont.subscribe(union => {
    expect(union[0].type).toBe(axiumBadActionType);
    done();
  });
});

test('ActionController Next Test', (done) => {
  const act = axiumLog({agreement: 200});
  const cont = new ActionController(act);
  cont.subscribe(union => {
    expect(union[0].type).toBe(axiumLogType);
    done();
  });
  cont.fire(act);
});

test('ActionController createActionController$ Test', (done) => {
  const act = axiumLog({agreement: 200});
  const cont = createActionController$(act, (controller, action) => {
    controller.fire(action);
  });
  cont.subscribe(union => {
    expect(union[0].type).toBe(axiumLogType);
    done();
  });
});
/*#>*/