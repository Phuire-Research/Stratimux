# Data Oriented Functional Inheritance
This can be considered to be the true goal of a Unified Turing Machine. This was the original intention with this framework back in 2018 I was referring to this as a nTuring Machine. Was a method of creating functional libraries with the ability to inherit functionality in the same way that object oriented libraries. If you are familiar with functional programming, then the majority of what you have access to are tools that enable for the programming style. Versus the sweet of libraries made available to objected oriented. And run into difficulties where functional programming acts more like glue than concrete when formalizing applications. Even "RxJs," while considered functional, its core design utilizes constructors and object oriented inheritance between different modes of functionality.

Each time you wish to implement one feature from that object, you inherit everything else that comes with it, even if you are attempting to have just one slice of that functionality. Thus the solution towards creating a function means of sharing libraries was finding a means of allowing for functionality to be composed. Enter "Concepts," and their "Qualities." Where qualities are groupings of shared functionality that transform a shared data type. Where the state of the "Concept," acts as methods of controlling the how and what is being transformed.

As all data transformations in this system are stateless if taking place solely within the "Method" of your "Concepts." The reducer is merely acting as a signal as to when to prompt for the next step in this system. As "Plans" observe these signals. Alterations to the state inform the how and what is being transformed.

# Unification over Inheritance
```typescript
export function unifyConcepts(
  concepts: Concept[],
  emergentConcept: Concept
): Concept {
  let newConcept = createConcept('', {});
  forEachConcept(concepts, (concept => {
    newConcept = unify(newConcept, concept);
  }));
  newConcept = unify(newConcept, emergentConcept);
  newConcept.name = emergentConcept.name;
  return filterSimilarQualities(newConcept);
}
//Unification under the hood.
base.qualities = [
  ...base.qualities,
  ...target.qualities,
];
```
Notice the simplicity of what is happening within the unifyConcepts function. That we are using the order of the passed array to formalize a stacked base of concepts to be unified together. Alongside a final emergent concept that enhances the qualities of these concepts to be utilized together. This is likewise a form of compositional dependency. To guarantee that your concepts will always have the required qualities necessary to perform their functionality.

As functionality is not defined solely by the Actions that each "Quality" describes. But their utilization within an ActionStrategy. In the current form of Stratimux, what is missing is a final compilation that determines the exact strategies utilized within your application. Once this is implemented, not only are you inheriting functionality in the same manner of object oriented programming. But the functionality that is not currently being utilized within your application can be pruned. As "ActionStrategies" effectively map the entire operation of your application. This would be accomplished via its own set of concepts that formalize a proper interface to interact with this non-linear method of functional programming.

What is interesting to note within this system is likewise the ability to directly inherit plans via your concepts principles. That you can have a base server concept that expands itself. Via a compositional quality of tried and tested implementations. Such as attaching a static endpoint to a server, database, and user interface. As this likewise affords for those individual units to be load balanced and separated into their own processes.

The difference between Object Oriented Programming. And this Data Oriented Functional approach. Is that functionality itself can exist within a solved state and that is what is composed. Versus the recomposition of objects to again formalize a concept that is simply being redesigned over and over again. The majority of applications that exist, are nothing more than catalogs with an item view.

Therefore what this system is seeking to do. Is to not just be the store, database, and user interface to access a catalog. But the creation and orchestration of the catalog itself. As each item within the catalog is likewise composed of concepts. What this method of programming is proving is that this is a logical fact. Something that can be described in programming and tested to formalize any application or thing in existence.

As everything is just data. And data is merely the most important qualities that we have written down. What we are as people are transformers of that data and this system of programming is merely the method of transforming using the basest form of abstraction. Concepts. To perform those transformations.

# Accessing your Unified State and Functionality
```typescript
export function selectUnifiedState<T>(concepts: Concepts, semaphore: number): T {
  return concepts[semaphore].state as T;
}
```
This directly relays to the functionality within your "Methods" and "Principles." As by default your Reducer is already based its state upon each successive call. What is orienting the state of your concepts is the same universal concept of spacial location that actions use to call their qualities within Stratimux. This "selectUnifiedState," merely accesses the concept as it is loaded into the Axium. And is handled automatically within the provided helper method functions. Thus the only true place where this would need to be implemented by the developer is the principles themselves, which also are supplied the current location by semaphore in that creation function.

Therefore this allows for each of your concepts to have their own counter functionality, but this likewise limits the implementation of Unified Concepts. That these concepts are only functional via their principles due to the guarantee of a supplied concept semaphore. As such, when creating actions or strategies for a "Unified Concept." Be sure to supply this value to the necessary action creator or action node.

The benefit of this approach. Is that we can determine responsible concepts that only function only via its internal specification, including being responsible for its spatial location within any loaded Axium. Allows for these responsible concepts to be "Unified" without worry of interacting with "Concepts" that may use some functionality it others would depend upon. Therefore the "Axium" can be seen in current terms as a "Composition of Applications" that have a shared interface that is the "Axium" itself.
