## Spatial Ownership aka Ownership
### Abstract
The Spatial Ownership design pattern is designed to allow for multiple ActionStrategies to be ran concurrently on the Axium or off premise in some network. This is accomplished via a ticket and stub system creating an indirect union relationship between the ActionStrategies and an OwnershipLedger. Where each ledger is only required to be loaded on location of the values you are intending to be locked. This is in contrast to current paradigms that would share the locking state across the entire network. But here we take advantage of the universal concept of space and position. Where the only responsible party for that relationship would be the location of that value. While allowing for the ActionStrategy that "owns," that value to carry a ticket stub noting a number, and key that corresponds to the locked value. This has an additional level of handling as each action and OwnershipTicket share the same expiration. Dictated upon the creation of the action that would be requesting this relationship, that has a default of 5 seconds, but may be modified by an agreement value set at the time of that actions creation.

What this accomplishes is a form of soft locking within an environment that would not be able to accomplish such ordinarily. While noting that even if we were to implement this relationship directly, it would still have the same flow even in low level code. The benefit of this system is a performant massively parallel network that may scale dynamically. As this is the original intention of STRX, but likewise not all Nodes within its network would require the Ownership concept, nor would each value require a lock. Therefore the strength of this system is that it is opt in and not a hard restriction. But must instead be logically determined alongside the scale and complexities of your orchestrations.

## Working with the Ownership Concept
The ownership concept must be explicitly loaded and introduces an additional mode that further transforms the functionality of the axium. Which allows for the locking of values, that other actions or strategies may be dependent upon. And if that strategy, or action with a KeyedSelector has taken a TicketStub of ownership of that value. Any quality or action that would transform such are added to a pendingActions until that block is cleared.

But if a strategy is dependent on that value, that strategy will fail by default. Thus a specific case must be attached to the ActionNode's failureNode that governs how to handle that specific Case. If so, such will be added to a pendingActions that can later be dispatched alongside with their TicketStubs and expiration times intact.

If an action that has an attached blocking quality specified by a KeySelector, but does not hold a KeyedSelectors on itself while holding an ActionStrategy. The ownershipLedger will block and append that action to the pendingActions list if it holds a ticket of that KeyedSelector. If an additional action is dispatched it will replace that action in place and update its expiration to the most recent action's. There these actions will only be dispatched if there is no current lock on that value and only one may exist in the pendingActions at a time.

However if an action has a KeyedSelector and an ActionStrategy. Ownership will validate if it should be blocked and will do so if there is a preexisting OwnershipTicket and that strategy does not hold the first position for each KeyedSelector it holds on the current action. Or if it holds the required stubs and all are first in position. These stubs will only be cleared from the strategy upon conclusion or via the associated ownership quality that can be placed directly into that strategy. Otherwise that action will be added into the pendingActions que and will be later dispatched by first in first out if its stubs are first in line. Noting that both the stubs and action may expire and will be dispatched and stored via the axium's badAction quality.

This is to allow actions in this system to move off premise and was the inspiration for the design of this system. That such can be a server, web worker, client, etc... To correlate all as an abstract graph computer. That can further be enhanced to used in the within the context of literal graph computers themselves. As we find new means of extending moors law of computational density. This paradigm was designed with specialization of computation in mind. To perform such where best suited. Noting that the internals of a Neural Network are likewise a graph computer of a certain kind and we are ourselves.

Note that the pendingActions list, if there is no action dispatched will check via timer to either invalidate the actions, stubs, or to instead dispatch them into the stream if they are ready. The expiration here is what is allowing for this system to still be considered to be halting complete. And that one could by design set some actions expiration out to years in advance assuming that the holding axium is still running at that time. As such will halt any at any time in the future, so long as there are pendingActions contains such and has not depleted such via virtue of the first in first out pattern.

## Moving Actions off Premise
Note that the only mechanism in play that allows for locks to be cleared are if a strategy hits its conclusion as it enters the ownershipMode, or if explicitly removed via the associated ownership quality. Thus in order to move these actions off premise we must counter to the inspiring strategy design pattern. Have quality without a method, and instead utilize its reducer to add that action to a que that a principle is subscribed to. Once populated, that principle is in control of that actionStrategy, noting expiration.

This allows for the principle to perform calculations safely on the state of other concepts. Note that this should only be in play, if the intention is to transform that value that actions or strategies would depend upon. Otherwise a clone of that value suffices and should not have a KeyedSelector upon that action. From here actions may move off premises via whatever mechanism is required to satisfy that calculation.

Originally this approach was created to satisfy the handling of the FileSystem and manipulation of its contents. Summarily such is the best means transforming binary files not written in plain text while STRX exists within the confounds of Typescript. As the paths to those files, would act as a KeyedSelector lock within this pattern of design.

## Ownership Internals
``` typescript
export type OwnershipState = {
  initialized: boolean;
  ownershipLedger: OwnershipLedger;
  pendingActions: Action[],
  isResponsibleForMode: boolean;
}
```
* initialized - Value to control when your principles or external subscriptions should engage with the Ownership Concept. It simply notes when the principles are active.
* ownershipLedger - Is a simple map that use a key that is informed by a KeyedSelector and value that is a populated ownership ticket.
* isResponsibleForMode - The just in case your choose to implement your own mode that would require ownership, and can be set to false via the createOwnershipConcept function. Note that you must create your own initialization strategy to set your own Mode.

### Useful Ownership Qualities
* backTrack - To be used within an ActionStrategy's failureNode. This will allow your strategy to return to the previous node while appending the designated failure message to the action list, without setting its own.
* clearPayloadStubs - To be used within your own qualities and utilized within a strategy if it no longer requires a specific lock. Setting some stubs to the payload of this action will clear those stubs from the ownershipLedger. Note that you would have to clear these stubs from your strategy if present.
* clearStrategyStubsFromLedgerAndSelf - To be used within a strategy, this will clear the current strategies stubs from the ledger and set its current stubs to undefined.
* clearPendingActions - Will simply clear the pendingAction list. Note that the stubs would still exist and one should use this in combination with clearPayloadStubs to avoid having to wait for expiration.
* clearPendingActionsOfStrategyTopic - Will clear any ActionStrategies of a set payload topic string from pendingAction.
* resetOwnershipLedger - This will do a dumb reset of the currently loaded ownershipLedger

### Internal Ownership Qualities
* initializeOwnership - Will simply set initialized to True for the Ownership concept.
