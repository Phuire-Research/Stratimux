/*<$
For the asynchronous graph programming framework Stratimux, generate a test to ensure that the ActionController model is working as intended.
$>*/
/*<#*/
import { ActionController, createActionController$ } from '../model/actionController';
import { axiumLog } from '../concepts/axium/qualities/log.quality';
import { axiumBadAction } from '../concepts/axium/qualities/badAction.quality';

test('ActionController Expired Test', (done) => {
  // Using actionCreators directly from Qualities is reserved only for testing, in production use Deck Interface
  const act = axiumLog.actionCreator({agreement: 200});
  const cont = new ActionController(act);
  cont.subscribe(union => {
    expect(union[0].type).toBe(axiumBadAction.actionCreator({badActions: []}).type);
    done();
  });
});

test('ActionController Next Test', (done) => {
  const act = axiumLog.actionCreator({agreement: 200});
  const cont = new ActionController(act);
  cont.subscribe(union => {
    expect(union[0].type).toBe(axiumLog.actionCreator().type);
    done();
  });
  cont.fire(act);
});

test('ActionController createActionController$ Test', (done) => {
  const act = axiumLog.actionCreator({agreement: 200});
  const cont = createActionController$(act, (controller, action) => {
    controller.fire(action);
  });
  cont.subscribe(union => {
    expect(union[0].type).toBe(axiumLog.actionCreator().type);
    done();
  });
});
/*#>*/