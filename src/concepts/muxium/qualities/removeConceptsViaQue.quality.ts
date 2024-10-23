/*<$
For the asynchronous graph programming framework Stratimux and Muxium Concept,
generate a quality that will remove concepts that are currently loaded in the Muxium.
Will concluding plans and closing active subscriptions associated with the removed concepts.
$>*/
/*<#*/
import { defaultMethodCreator } from '../../../model/quality';
import { NamedSubscription } from '../muxium.concept';
import { MuxiumState } from '../muxium.concept';
import { NamedStagePlanner } from '../../../model/stagePlanner/stagePlanner.type';
import { createQualityCard } from '../../../model/quality';
import { LoadConcepts } from '../../../model/concept/concept.type';

export const muxiumRemoveConceptsViaQue = createQualityCard<MuxiumState<unknown, LoadConcepts>>({
  type: 'remove Concepts via Muxium\'s Removal Concept Que',
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
      generalSubscribers: newGeneralSubscribers,
      stagePlanners: newStagePlanners,
      removeConceptQue: {}
    };
  },
  methodCreator: defaultMethodCreator
});
/*#>*/