/*<$
For the asynchronous graph programming framework Stratimux, define the Muxium Index model file.
This file defines the muxium bundled object that provides access to associated muxium functions.
$>*/
/*<#*/
import { muxification } from './muxium';
import { getMuxiumState, isMuxiumOpen } from './muxiumHelpers';

export const muxium = ({
  create: muxification,
  getState: getMuxiumState,
  isOpen: isMuxiumOpen
});
/*#>*/