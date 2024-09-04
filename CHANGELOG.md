### *Consistency Update* v0.1.72
* Added a new Axium Quality: **axiumRegisterTimeOut**, that accepts an action and specified timeout that will run the axiumTimeOut function then succeed an incoming strategy if present.
  * This likewise fulfills the original purpose of buffer, even in a complex scenario.
### v0.1.71 5/16/2024
* Finally removed the need to add "as Subject<Concepts> | MuxifiedSubject" when creating methods that access state or concepts.
* Added then **removed** a new Buffer Method Creator Series. See branch Stash-Buffer for details.
### v0.1.69 5/15/2024
* Added priority to axium strategies.
* Improved consistency of logic due the above change.
* Exported **isAxiumOpen** helper function.
### Strategy Priority v0.1.68 5/15/2024
* Added priority to strategies, this priority will be assigned to each step issued by such.
  * With this change you may now have strategies jump all lines upon creation, ensuring some change prior to other action's taking effect.
  * Unless a ActionNode or incoming Action created by createActionNode has its own priority, then that takes precedents. But does not effect the Strategy's overall priority.
### **BREAKING** v0.1.67 5/13/2024
* Revamped the Action Creator Functions to follow behind the current creator with an **options** parameter design choice.
  * Note pure action creators will not provide an option for payload
* Cascaded priority to ActionStrategies to allow for planning priority ahead of time.
* Updated the PrincipleFunction documentation to have the semaphore parameter to now be conceptSemaphore. This allows for an easy drop in into the options parameter.
* Made createAxium utilize the same **options** design pattern.
### v0.1.65 5/13/2024
* Removed one more level of deepness from DotPath(6 levels now), projects should now compile without the excessively deep error.
### v0.1.64 5/13/2024
* Added Action Priority: This will allow action's assigned a priority of not 0 to be placed accordingly into the action ques.
* Adjusted DotPath type to improve type checking performance. Massively degrades with an additional level.
* Updated documentation to reflect recent changes
### Patch v0.1.62 5/09/2024
* Restored DotPath, a type used in the selector creators used to guide the creation of a dot path string.
### **BREAKING** Strong Fast Lock Step v0.1.62 5/08/2024
* Devised a means to ensure a lock step execution of incoming actions
  * Due to each stage being ran once regardless of their selector being changed, some plans may receive the wrong value if not determining if that stage has been ran for the first time. See priority.test.ts for the example: if (changes.length > 0) {//}
  * This also impacted the *axiumWaitForOpenThenIterate* helper function, but now works as intended via no longer checking for the latest lastStrategy change.
  * [*Note* Removed CI checks for 14.x and 16.x due to updating dependencies.](https://github.com/Phuire-Research/Stratimux/pull/213/commits/6b93c57fa2dab8869f1508970c44a8300ef444be)
### Strong Fast Time v0.1.61
* Created the new *axiumTimeOut* helper function
  * This will add a specified action to the axium tail property after some specified time.
  * This is used internally to handle the majority of asynchronous interactions
### Strong Fast **BREAKING** v0.1.59 5/06/24
* Removed the setTimeout trick in favor of a new tail property added to the axium concept, this paves the way for this pattern to be completely responsible for its own implementation.
  * **BREAKING** Method Subjects are now a tuple of [action: Action, async: Boolean]. This allows for the old setTimeout trick to be used in case the action stream isn't kicked into gear.
    * This change is only breaking if you have implemented your own custom methods, please see src/model/method.ts for reference.
* Ensured that plans that conclude with an active beat, will have their timers removed.
### v0.1.58 5/03/24
* Ensured that changes that happen between a stage's beat interval are accumulated
### v0.1.57 5/02/24
* Added the ability to set specific stages of their selectors, priority, and beat values.
  * Note that by setting these values, this will not force the internal priority selector cache mechanism to trigger. Use set for stages your are iterating to or changing due to some circumstance. The new stage options will force the priority selector cache to trigger.
* Quick pass updating the StagePlanner documentation in regards to stage selectors/priority/beat properties.
### v0.1.56 5/01/24
* May now properly update each plans intended KeyedSelectors to control when they are ran.
### v0.1.55 4/24/24
* Changed ActionNodeOptions to allow for successNode and failureNode to be left absent. Continued effort towards decreasing boilerplate.
* Refined original paper.
* Properly exporting the new ActionCreator and ActionCreatorWithPayload for specific createQualityCardX creator functions
### v0.1.53 4/23/24
* Added createQualityCard and createQualityCardWithPayload to reduce some boilerplate.
### v0.1.52 Patch 4/03/24
* Quick pass updating documentation
* Synced up createAxium, etc... To properly allow for the axium to log actions incoming in the action stream if set.
### **BREAKING Update v0.1.5** 4/02/24
* Muxified the internal concept streams and created a new dedicated stream to inform most recent concepts
  * Note if you are assembling plans within a method, be sure to grab the **concepts$** from *getAxiumState*
* It is now a requirement you use the **stageWaitForOpenThenIterate(() => action)** helper function in your plans if you are depending on the last strategyTopic property on the axium concept.
* Added an addition logging property to reveal the internal action stream that can be set when creating your axium. This is separate from the prior logging feature.
* Method now utilize an internal actionConcept$ stream of type Subject<Concepts>. Method creators that utilize the MuxifiedSubject will throw a type error and will need to be updated.
* **PATCH v0.1.51** Removed debugging console.logs
### **BREAKING Update v0.1.4** 3/28/24
* Removed the "on.expected" option from dispatch to reduce inner complexity of your stages
* Renamed **axium.stage** to **axium.plan** to be in line with industry terminology
  * The new plan set up requires a staging entity or the return from the new createStage helper function
    * This new entity enables you to change the priority in which your stages are informed per state change
  * You may now assign each stage its own separate beat versus the entire plan
    * Removes beat from the overall plan and now needs to be performed atomically
  * This overall change trims the total plans that are checked per state, but may still supply plans that trigger on all changes via empty array in entity or outright ignoring the value field via the createStage function
* Added nullReducer to disallow excessive observations from being triggered
* First pass updating StagePlanner documentation
### 3/05/24
* Minor DX release, properly exporting Axium type for inclusion in other frameworks.
### 12/14/23
* Set Stage can now properly be set to 0.
### 11/29/23
* Official Release
* Stage Planner Beat - No longer experimental, have fun! It's Stratimux is now a dancing algorithm recursive function.
### 11/27/23
* Added a new experimental parameter to staging. Beat, which is a duration that will "Throttle and debounce," state notifications to that specific plan.
### 11/26/23
* Updated naming conventions throughout. Counter is now CounterState. Strategies now export with their associated concept's prepended.
* Added parsing tokens. If curious about this functionality see the Huirth project. These tokens in combination with that project will upon its release. Allow for the ease of parsing Stratimux or other TypeScript projects into high quality training data.
### 11/17/23
* selectSlice now performing deep selections.
### 11/15/23
* Action Payloads must extend type: Record<string, unknown>  
   * This change is to provide a guarantee of advanced functionality in the current UI Proof of Concept.