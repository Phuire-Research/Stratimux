import { experimentName } from '../../concepts/experiment/experiment.concept';
import { select } from '../../model/selector';
import { ExperimentPlanOptionsState } from './newPlanOptions.concept';

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
