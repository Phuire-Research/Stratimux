/*<$
For the asynchronous graph programming framework Stratimux and Axium Concept,
generate a quality that will remove concepts that are currently loaded in the Axium.
Will concluding plans and closing active subscriptions associated with the removed concepts.
$>*/
/*<#*/
import { defaultMethodCreator } from '../../../model/quality';
import { NamedSubscription } from '../axium.concept';
import { AxiumState } from '../axium.concept';
import { NamedStagePlanner } from '../../../model/stagePlanner';
import { createQualityCard } from '../../../model/quality';

export const axiumRemoveConceptsViaQue = createQualityCard<AxiumState<unknown, unknown>>({
  type: 'remove Concepts via Axium\'s Removal Concept Que',
  reducer: (state) => {
    const principleSubscribers = state.methodSubscribers;
    const newPrincipleSubscribers = [] as NamedSubscription[];
    const generalSubscribers = state.methodSubscribers;
    const newGeneralSubscribers = [] as NamedSubscription[];
    const stagePlanners = state.stagePlanners;
    const newStagePlanners = [] as NamedStagePlanner[];
    const removeConceptQue = state.removeConceptQue;
    const removeKeys = Object.keys(removeConceptQue);

    principleSubscribers.forEach(named => {
      let exists = false;
      removeKeys.forEach(key => {
        if (removeConceptQue[key].name === named.name) {
          exists = true;
        }
      });
      if (!exists) {
        newPrincipleSubscribers.push(named);
      } else {
        named.subscription.unsubscribe();
      }
    });

    generalSubscribers.forEach(named => {
      let exists = false;
      removeKeys.forEach(key => {
        if (removeConceptQue[key].name === named.name) {
          exists = true;
        }
      });
      if (!exists) {
        newGeneralSubscribers.push(named);
      } else {
        named.subscription.unsubscribe();
      }
    });

    stagePlanners.forEach(named => {
      let exists = false;
      removeKeys.forEach(key => {
        if (removeConceptQue[key].name === named.name) {
          exists = true;
        }
      });
      if (!exists) {
        newStagePlanners.push(named);
      } else {
        named.conclude();
      }
    });

    return {
      ...state,
      generalSubscribers: newGeneralSubscribers,
      stagePlanners: newStagePlanners,
      removeConceptQue: {}
    };
  },
  methodCreator: defaultMethodCreator
});
/*#>*/