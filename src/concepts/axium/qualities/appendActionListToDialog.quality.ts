/*<$
For the asynchronous graph programming framework Stratimux and Axium Concept, generate a quality that appends a complete strategies action list
into the dialog state property.
$>*/
/*<#*/
import { AxiumState } from '../axium.concept';
import { createQualityCardWithPayload } from '../../../model/quality';
import { AppendActionListToDialogPayload } from '.';

export const axiumAppendActionListToDialog = createQualityCardWithPayload<AxiumState<unknown, unknown>, AppendActionListToDialogPayload>({
  type: 'append Action List to Axium\'s Dialog',
  reducer: (state, action) => {
    const payload = action.payload;
    let newDialog = '';
    if (state.storeDialog) {
      payload.actionList.forEach(str => {newDialog += str + ' ';});
      if (state.logging) {
        console.log(newDialog);
      }
      return {
        ...state,
        dialog: state.dialog + newDialog,
        lastStrategy: payload.strategyTopic,
        lastStrategyData: payload.strategyData,
        lastStrategyDialog: newDialog
      };
    }
    return {
      ...state,
      lastStrategy: payload.strategyTopic,
      lastStrategyData: payload.strategyData,
    };
  }
});
/*#>*/