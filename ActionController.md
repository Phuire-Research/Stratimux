# Action Controller
This was the original inspiration for the STRX Principle concept. Except here we decomposed and recomposed the concept into two parts. Here the ActionController in contrast to its original is an subject that fires once and has an expiration. This streamlines the difficulty of working with this concept, as originally to make it wholly responsible for itself, it would require an additional subscription to determine whether it should be open or closed. But now with the additional refinement of each action having an expiration, we can define the expiration as the limit to the lifespan of each action. And would be the second point of failure that an ActionStrategy would move into a failure state.

The purpose of the ActionController is to perform singular actions that effect one thing asynchronously. For example in a FileSystem concept, it would be the literal Method, that would allow for manipulation of files. As each operation can have a failure state that is outside of the control of STRX. Such as a file being open by a user, or the lack of permission allotted to the run time.

In order to have the ActionController work within STRX we must set up the Method in a specific manner to ensure type safety. Note the usage of the "switchMap," as we are changing the context of the stream from an Action to a specific subject that will later return an Action.
## Example
``` typescript
const createSomeMethodCreator: MethodCreator = () => {
  const logSubject = new Subject<Action>();
  const logMethod: Method = logSubject.pipe(
    switchMap((act: Action) => {
      return createActionController$(act, (controller, action) => {
        const payload = selectPayload<SomePayload>(action);
        if (action.strategy) {
          someAsyncFunction.then(value => {
            const strategy = action.strategy as ActionStrategy;
            if (value) {
              const newStrategy =
                  strategySuccess(
                    strategy,
                    strategyData_unifyData(strategy, {some: value})
                  );
              controller.fire(newStrategy);
            } else {
              const newStrategy =
                  strategyFailed(
                    strategy,
                    strategyData_appendFailure(strategy, 'Some Async function failed.')
                  );
              controller.fire(newStrategy);
            }
          }
          );
        } else {
          controller.fire(axiumConclude());
        }
      });
    }),
  );
  return [
    logMethod,
    logSubject
  ];
};
```
In the above we are likewise paying attention to the possibility of failure within the Asynchronous Function. Then informing the type of failure that occurred. It is advisable if you know these failures modes in advance. To create an enum that can store such. As the failureCondition is just some enum holding a set of strings. Then use this enum to inform your next decision from your FailureNode. Note here that in classical game ai systems that they would ordinarily restrict the amount of successive actions that an ai might make to 2. This pattern of design of informing some failure demonstrates the inherit higher order reasoning within STRX's design. Complexity classically has been seen as a poor design choice, but the goal within STRX is to fully decompose intelligent systems as the unfortunate truth is that higher order logic is complex by default. But may be made less complex via logical determinism, wherein we decision with failure modes in mind. Versus leaving that decision to some probability.

The easiest example of such is living with room mates and wanting to have a bowl of cereal before going to work. The entire strategy involves the confirmation that the room mate did not drink the rest of the milk the previous night. Therefore the strategy that we impose accounts for this possibility via changing the meal, or forgoing it entirely to get to work on time. But likewise if we forgo our breakfast and get to work. We should take into account the possibility of grabbing a snack from the break room, but if all the snacks are gone. Then in the last ditch effort can have some coworker or delivery service bring in some food. If none of these options are available, then we will have to wait till lunch.

Note here that while we are doing so seamlessly. In a video game context this would be considered to be too complex to design. As classically in order to create this behavior it would be the generation of smaller steps to achieve some short sighted goal or interaction. But in the scope of planning, in order to make it through to the end of the day. We are having to make decisions in line with our overall goals to successfully make it back to bed at a reasonable hour. As we not only take into account that day, but know that if we go out and play. We likewise can hamper our own next work the next day, if we don't get home on time. This demonstrates the purpose of identifying "Time" and "Space" as a "Universal Concepts." Where time is the limiter to our ability to perform some action, depending on other strategies we are required to perform. And space the locality and availability of some concept to successfully perform some action. That you may sleep at the office if working late, but then you would need some clothes in your car. And if your work has a clean shave policy, then likewise you would need a method of shaving available to match the requirements that your workspace has set you for you to meet each day.