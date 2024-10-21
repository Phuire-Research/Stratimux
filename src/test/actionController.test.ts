/*<$
For the asynchronous graph programming framework Stratimux, generate a test to ensure that the ActionController model is working as intended.
$>*/
/*<#*/
import { muxiumLog } from '../concepts/muxium/qualities/log.quality';
import { muxiumBadAction } from '../concepts/muxium/qualities/badAction.quality';
import { Deck } from '../model/deck';
import { ActionDeck } from '../model/concept/concept';
import { ActionController, createActionController$ } from '../model/action/actionController';

test('ActionController Expired Test', (done) => {
  // Using actionCreators directly from Qualities is reserved only for testing, in production use Deck Interface
  const act = {action: muxiumLog.actionCreator({agreement: 200}), deck: {}} as unknown as ActionDeck<any, any>;
  const cont = new ActionController(act);
  cont.subscribe(union => {
    expect(union[0].type).toBe(muxiumBadAction.actionCreator({badActions: []}).type);
    done();
  });
});

test('ActionController Next Test', (done) => {
  const act = {action: muxiumLog.actionCreator({agreement: 200}), deck: {}} as unknown as ActionDeck<any, any>;
  const cont = new ActionController(act);
  cont.subscribe(union => {
    expect(union[0].type).toBe(muxiumLog.actionCreator().type);
    done();
  });
  cont.fire(act.action);
});

test('ActionController createActionController$ Test', (done) => {
  const act = {action: muxiumLog.actionCreator({agreement: 200}), deck: {} as unknown as Deck<void>, self: muxiumLog.actionCreator};
  const cont = createActionController$(act, ({controller, action}) => {
    controller.fire(action);
  });
  cont.subscribe(union => {
    expect(union[0].type).toBe(muxiumLog.actionCreator().type);
    done();
  });
});
/*#>*/