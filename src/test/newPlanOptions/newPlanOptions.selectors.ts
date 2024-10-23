/*<$
For the asynchronous graph programming framework Stratimux and a Experiment PlanOptions Concept, generate the possible selectors based on
the state declared in the concept file.
$>*/
/*<#*/
import { experimentName } from '../../concepts/experiment/experiment.concept';
import { select } from '../../model/selector';
import { KeyedSelector } from '../../model/selector/selector.type';
import { ExperimentPlanOptionsState } from './newPlanOptions.concept';

export const experimentPlanOptionsReadySelector: KeyedSelector =
  select.createConceptKeyedSelector<ExperimentPlanOptionsState>(experimentName, 'ready');

export const experimentPlanOptionsValueSelector: KeyedSelector =
  select.createConceptKeyedSelector<ExperimentPlanOptionsState>(experimentName, 'value');

const experimentSelectOne = select.createConceptKeyedSelector<ExperimentPlanOptionsState>(experimentName, 'one');

const experimentSelectTwo = select.createConceptKeyedSelector<ExperimentPlanOptionsState>(experimentName, 'two');

const experimentSelectThree = select.createConceptKeyedSelector<ExperimentPlanOptionsState>(experimentName, 'three');

const experimentSelectFour = select.createConceptKeyedSelector<ExperimentPlanOptionsState>(experimentName, 'four');

const experimentSelectFive = select.createConceptKeyedSelector<ExperimentPlanOptionsState>(experimentName, 'five');

const experimentSelectSix = select.createConceptKeyedSelector<ExperimentPlanOptionsState>(experimentName, 'six');

const experimentSelectSeven = select.createConceptKeyedSelector<ExperimentPlanOptionsState>(experimentName, 'seven');

export const planOptionsSelect = {
  one: experimentSelectOne,
  two: experimentSelectTwo,
  three: experimentSelectThree,
  four: experimentSelectFour,
  five: experimentSelectFive,
  six: experimentSelectSix,
  seven: experimentSelectSeven
};
/*#>*/