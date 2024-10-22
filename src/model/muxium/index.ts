/*<$
For the asynchronous graph programming framework Stratimux, define the Muxium model file.
This file dictates the creation of the Muxium itself and engages all necessary parts to ensure its functionality
as a provably recursive terminating function.
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