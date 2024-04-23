/*<$
For the asynchronous graph programming framework Stratimux, define the Action Strategy Data model file.
This file is what allows for the ActionStrategy data pattern to be a Universal Transformer of Data.
As each strategy is able to carry with it some set of attributes in its data field that may be
a combination of any number of properties. Creating a final data output that is the cumulation of all
or some properties. That may utilized within a method, reducer, principle, and even in the lastStrategyData property
if being observed via a plan or subscription.
$>*/
/*<#*/
// eslint-disable-next-line no-shadow
import { ActionStrategy } from './actionStrategy';

// eslint-disable-next-line no-shadow
export enum failureConditions {
  ownershipExpired = 'ownershipExpired',
  ownershipBlocked = 'ownershipBlocked',
  controllerExpired = 'controllerExpired',
  axiumExpired = 'axiumExpired',
  axiumBadGeneration = 'axiumBadGeneration'
}

export const strategyData_appendFailure = (strategy: ActionStrategy, condition: failureConditions | string): Record<string, unknown> => {
  if (strategy.data) {
    return {
      ...strategy.data,
      failureCondition: condition
    };
  } else {
    return {
      failureCondition: condition
    };
  }
};

export const strategyData_selectFailureCondition = (strategy: ActionStrategy): failureConditions | string | undefined => {
  if (strategy.data) {
    if (Object.keys(strategy.data).includes('failureCondition')) {
      const data = strategy.data as Record<string, unknown>;
      return data['failureCondition'] as failureConditions | string;
    }
  }
  return undefined;
};

export const strategyData_clearFailureCondition = (strategy: ActionStrategy): Record<string, unknown> | undefined => {
  const condition = strategyData_selectFailureCondition(strategy);
  const data = strategyData_select<Record<string, unknown>>(strategy);
  if (condition && data) {
    const newData: Record<string, unknown> = {};
    for (const entry of Object.keys(data)) {
      if (entry !== 'failureCondition') {
        newData[entry] = data[entry];
      }
    }
    return newData;
  } else if (data && Object.keys(data).length > 0) {
    return data;
  } else {
    return undefined;
  }
};

export const strategyData_select = <T>(strategy: ActionStrategy): T | undefined => {
  if (strategy.data) {
    return strategy.data as T;
  } else {
    return undefined;
  }
};

export const strategyData_unifyData =
  <T extends Record<string, unknown>>(strategy: ActionStrategy, data: Record<string,unknown> | T): Record<string,unknown> => {
    if (strategy.data) {
      return {
        ...strategy.data,
        ...data
      };
    } else {
      return {...data};
    }
  };

export const strategyData = ({
  appendFailure: strategyData_appendFailure,
  selectFailureCondition: strategyData_selectFailureCondition,
  clearFailureCondition: strategyData_clearFailureCondition,
  select: strategyData_select,
  unifyData: strategyData_unifyData,
});
/*#>*/