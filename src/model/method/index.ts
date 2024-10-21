/*<$
For the asynchronous graph programming framework Stratimux, define the Method model file.
This file hold a series of helper functions that enable users to quickly create specific provably terminating methods
within their own defined qualities.
$>*/
/*<#*/
import { createMethod, createMethodWithConcepts, createMethodWithState } from './method';
import {
  createAsyncMethod,
  createAsyncMethodWithState,
  createAsyncMethodWithConcepts
} from './methodAsync';
import {
  createAsyncMethodDebounce,
  createAsyncMethodDebounceWithConcepts,
  createAsyncMethodDebounceWithState
} from './methodAsyncDebounce';
import {
  createAsyncMethodThrottle,
  createAsyncMethodThrottleWithConcepts,
  createAsyncMethodThrottleWithState
} from './methodAsyncThrottle';
import {
  createMethodDebounce,
  createMethodDebounceWithState,
  createMethodDebounceWithConcepts
} from './methodDebounce';
import {
  createMethodThrottle,
  createMethodThrottleWithState,
  createMethodThrottleWithConcepts
} from './methodThrottle';

export const method = ({
  create: createMethod,
  createWithState: createMethodWithState,
  createWithConcepts: createMethodWithConcepts,
  createDebounce: createMethodDebounce,
  createDebounceWithState: createMethodDebounceWithState,
  createDebounceWithConcepts: createMethodDebounceWithConcepts,
  createThrottle: createMethodThrottle,
  createThrottleWithState: createMethodThrottleWithState,
  createThrottleWithConcepts: createMethodThrottleWithConcepts,
  createAsync: createAsyncMethod,
  createAsyncWithState: createAsyncMethodWithState,
  createAsyncWithConcepts: createAsyncMethodWithConcepts,
  createAsyncDebounce: createAsyncMethodDebounce,
  createAsyncDebounceWithState: createAsyncMethodDebounceWithState,
  createAsyncDebounceWithConcepts: createAsyncMethodDebounceWithConcepts,
  createAsyncThrottle: createAsyncMethodThrottle,
  createAsyncThrottleWithState: createAsyncMethodThrottleWithState,
  createAsyncThrottleWithConcepts: createAsyncMethodThrottleWithConcepts,
});
/*#>*/