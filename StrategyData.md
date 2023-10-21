# Strategy Data
This is the true power of the ActionStrategy design pattern as a Universal Transformer. As this system is informed by "Data Oriented Design." We are focusing explicitly on the transforming of some data over a period of time. How are doing so, is via the creation of some Record that would be unified over the lifetime of that ActionStrategy. As the act of unifying some data. Is merely decomposing those records and recomposing such into a new record with all previous parameters with the newest taking president.

What allows for the ActionStrategy paradigm to be a "Universal Transformer." Is the recognition of the most fundamental truth in computer programming. Is that via the utilization of plain text with transpilation to some native binary. Allows for all files to be modified within a plain text environment. As such this could also include the vertices within some graphical model that would be used to inform the appearance of some geometry within a simulation.

The ActionStrategy's goal would be how to transform that data over a series of steps to match the goal set out by its topic. The difficulty within this approach is that it requires specific naming conventions to handle this transformation over time. As we are matching "Universal Properties." Therefore if a parameter is not being opted in to this unifying data approach. That parameter should have some preposition that stops this process from happening. For example, "uiDivStyle," versus "style."

## Consumer Functions
``` typescript
export const strategyData_appendFailure = (strategy: ActionStrategy, condition: failureConditions | string): Record<string, unknown> => {};
export const strategyData_selectFailureCondition = (strategy: ActionStrategy): failureConditions | string | undefined => {};
export const strategyData_clearFailureCondition = (strategy: ActionStrategy): Record<string, unknown> | undefined => {};
export const strategyData_select = <T>(strategy: ActionStrategy): T | undefined => {};
export const strategyData_unifyData =
  <T extends Record<string, unknown>>(strategy: ActionStrategy, data: Record<string,unknown> | T): Record<string,unknown> => {}
```
* strategyData_appendFailure - This will append a "failureCondition," property that is informed either by the failureConditions enum or your string. This allows for your failureNodes to make intelligent decisions. Or if there is no data field present, it will create a new record with this property.
* strategyData_selectFailureCondition - This will return the failure condition or undefined if not set.
* strategyData_clearFailureCondition - This will clear such from the current record, otherwise if there are no additional properties on the record, or if no record is present at the time of clear, it will return undefined. As this forces data validation to ensure there is some data to unify given some success.
* strategyData_select - This will simply return and set the current type of the returned data. But forces type safety via the possibility of an undefined type. Note here that the strength of TypeScript allows for Records to be return or casted as a Slice of the given type, even if other Actions have added properties that would not be accounted for within your transformation context.
* strategyData_unifyData - The reason for all the undefined returns. This will take the current records, decomposed, and recompose such together with the newest data taking precedent. The generic allows for the unifying of types via the & operator. It is suggested that per strategy you create a type for that specific data, whether within your strategy or the unifying concept that will utilize such.

## The Reason for this Approach
We are using within the context your concepts the creation of consumer functions to ensure type safety even within the context of data that would be unified with other concepts. That these records might have the failureCondition property. But your logic would only care for the parameters that it is attempting to transform. This in effect allows for the creation of new emergent data if the "crossing of the streams." And in contrast to previous methods of programming, this would be similar to the creation of the assembly line within the context of programming. As classically the assembly line is generalized within the context of classic via the utilization of factories. As factories have assembly lines, but you are traditionally only caring for the output based on some input.

Therefore this approach decomposes the concept of the factory into its parts. And allows for different concepts to inform the unified output of your overall factory as the "Axium." As even if we examine the properties of some file type binary. When in the context of its informing program, that file would just be some set of properties. The decision to turn such into a binary does save on space and allows such to be condensed and represents a construct that purposefully resists decomposition from other programs. We could take advantage of this approach while having a shared standard for the binary transformation of plain text and its decomposition. Point being, it is a relative thing and what matters in the context of programming and entities is that everything is merely a list of properties. The difficulty is gaining access to those that you would otherwise transform. 

## Failure Conditions and Higher Order Logic
``` typescript
export enum failureConditions {
  ownershipExpired = 'ownershipExpired',
  ownershipBlocked = 'ownershipBlocked',
  controllerExpired = 'controllerExpired',
  axiumExpired = 'axiumExpired',
  axiumBadGeneration = 'axiumBadGeneration'
}
```
Note with the above, due to there being by default 3 different types of failure within an ActionStrategy within STRX. That being "Expiration," "Blocked," and "Bad Generation."  Expiration, which we treat as an absolute failure with no recovery. If a strategy must be recovery if it expires, please use a subscription or plan to pay attention to the badActions list on the "Axium." From there you can determine either you action's type or strategy topic to reissue such if it expired. Blocked signifies that the "Ownership" concept is currently loaded at the target transformation is temporarily being blocked, but may still expire. And finally "Bad Generation," this denotes whether the quality or governing concept is currently loaded within the Axium. As the axium is allowed to transform its functionality over time, the generation signifies the current iteration of its configuration. This is effected via the removal or concepts or the addition of such. If one wants to effect the composition of qualities on a concept, it is advised to still use these functions while providing a means to transfer the current state onto the new concept.

We have likewise introduced additional data handling functions. Specially here we are using "strategyData_appendFailure." To denote, specially what type of failure has happened within the ActionStrategy. Therefore the FailureNode, may utilize "strategyData_selectFailureCondition," to determine some decision to handle the returned property. This is where this system becomes complex. Noting that within traditional game Ai systems that would use some behavior tree or action planner. This is why those systems limit the amount of actions to just 2, and call anything more than that as overtly complex. Therefore this likewise reinforces that this system of programming is the bluntest form of higher order logic.

As the fundamental difficulty of higher order logic, is having to take into account complex state arrangements to make decisions. And the longer the strategy, or the more successive used in unison, the higher chance there will be some failure. Therefore this is higher order via the exponential factor of decision making that must be taken into account per ActionStrategy.

The advantage that STRX has over these classical game Ai systems. Is we know in advance some "Universal Concepts," that would inform the failure mode. That being you cannot have two sets of feet standing in the same position, would be "Spatial Ownership." Or in the case of computer systems, is whether you are modifying some file that is already open by another program.

The other would be "Time," or expiration paradigm within STRX that limits of lifetimes of Strategies within this System. As the createActionController function assigns a timer to the life time of that specific ActionController. That is cleared upon success or will fire the next FailureNode or conclusion if present, while appending the failure context to the data property.

*There is much more to be expanded in addition to working examples. Internally this is being used to prototype a "UserInterface" concept and will release those examples once that concept is worthy of being in a mvp state.*