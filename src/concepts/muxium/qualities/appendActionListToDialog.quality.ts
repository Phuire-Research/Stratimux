/*<$
For the asynchronous graph programming framework Stratimux and Muxium Concept, generate a quality that appends a complete strategies action list
into the dialog state property.
$>*/
/*<#*/
import { MuxiumState } from '../muxium.concept';
import { createQualityCardWithPayload } from '../../../model/quality';
import { AppendActionListToDialogPayload } from '.';
import { LoadConcepts } from '../../../model/concept/concept.type';

export const muxiumAppendActionListToDialog =
  createQualityCardWithPayload<MuxiumState<unknown, LoadConcepts>, AppendActionListToDialogPayload>({
    type: 'Muxium Append Action List To Dialog',
    reducer: (state, action) => {
      const payload = action.payload;
      let newDialog = '';
      if (state.storeDialog) {
        payload.actionList.forEach(str => {newDialog += str + ' ';});
        if (state.logging) {
          console.log(newDialog);
        }
        return {
          dialog: state.dialog + newDialog,
          lastStrategy: payload.strategyTopic,
          lastStrategyActionList: payload.actionList,
          lastStrategyData: payload.strategyData,
          lastStrategyDialog: newDialog
        };
      }
      return {
        lastStrategy: payload.strategyTopic,
        lastStrategyActionList: payload.actionList,
        lastStrategyData: payload.strategyData,
      };
    }
  });
/*#>*/