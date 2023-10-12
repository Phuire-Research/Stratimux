import { KeyedSelector } from '../../model/selector';

export const ownershipSelectLedger: KeyedSelector = {
  conceptName: 'ownership',
  stateKeys: 'ownershipLedger'
};

export const ownershipSelectInitialized: KeyedSelector = {
  conceptName: 'ownership',
  stateKeys: 'initialized'
};