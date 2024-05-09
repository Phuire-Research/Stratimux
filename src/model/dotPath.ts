/*<$
For the asynchronous graph programming framework Stratimux, define the DotPath model file.
$>*/
/*<#*/
type Key = string | number | symbol;

type Join<L extends Key | undefined, R extends Key | undefined> = L extends
  | string
  | number
  ? R extends string | number
    ? `${L}.${R}`
    : L
  : R extends string | number
  ? R
  : undefined;

type Union<
  L extends unknown | undefined,
  R extends unknown | undefined
> = L extends undefined
  ? R extends undefined
    ? undefined
    : R
  : R extends undefined
  ? L
  : L | R;

// Use this type to define object types you want to skip (no path-scanning)
type ObjectsToIgnore = { new(...parms: any[]): any } | Date | Array<any>

type ValidObject<T> =  T extends object
  ? T extends ObjectsToIgnore
    ? false & 1
    : T
  : false & 1;

export type DotPath<
  T extends object,
  Prev extends Key | undefined = undefined,
  Path extends Key | undefined = undefined,
  PrevTypes extends object = T
> = string &
  {
    [K in keyof T]:
    // T[K] is a type already checked?
    T[K] extends PrevTypes | T
      //  Return all previous paths.
      ? Union<Union<Prev, Path>, Join<Path, K>>
      : // T[K] is an object?.
      Required<T>[K] extends ValidObject<Required<T>[K]>
      ? // Continue extracting
        DotPathOne<Required<T>[K], Union<Prev, Path>, Join<Path, K>, PrevTypes | T>
      :  // Return all previous paths, including current key.
      Union<Union<Prev, Path>, Join<Path, K>>;
  }[keyof T];

type DotPathOne<
  T extends object,
  Prev extends Key | undefined = undefined,
  Path extends Key | undefined = undefined,
  PrevTypes extends object = T
> = string &
  {
    [K in keyof T]:
    T[K] extends PrevTypes | T
      ? Union<Union<Prev, Path>, Join<Path, K>>
      :
      Required<T>[K] extends ValidObject<Required<T>[K]>
      ?
        DotPathTwo<Required<T>[K], Union<Prev, Path>, Join<Path, K>, PrevTypes | T>
      :
      Union<Union<Prev, Path>, Join<Path, K>>;
  }[keyof T];

type DotPathTwo<
  T extends object,
  Prev extends Key | undefined = undefined,
  Path extends Key | undefined = undefined,
  PrevTypes extends object = T
> = string &
  {
    [K in keyof T]:
    T[K] extends PrevTypes | T
      ? Union<Union<Prev, Path>, Join<Path, K>>
      :
      Required<T>[K] extends ValidObject<Required<T>[K]>
      ?
        DotPathThree<Required<T>[K], Union<Prev, Path>, Join<Path, K>, PrevTypes | T>
      :
      Union<Union<Prev, Path>, Join<Path, K>>;
  }[keyof T];

type DotPathThree<
  T extends object,
  Prev extends Key | undefined = undefined,
  Path extends Key | undefined = undefined,
  PrevTypes extends object = T
> = string &
  {
    [K in keyof T]:
    T[K] extends PrevTypes | T
      ? Union<Union<Prev, Path>, Join<Path, K>>
      :
      Required<T>[K] extends ValidObject<Required<T>[K]>
      ?
        DotPathFour<Required<T>[K], Union<Prev, Path>, Join<Path, K>, PrevTypes | T>
      :
      Union<Union<Prev, Path>, Join<Path, K>>;
  }[keyof T];

type DotPathFour<
  T extends object,
  Prev extends Key | undefined = undefined,
  Path extends Key | undefined = undefined,
  PrevTypes extends object = T
> = string &
  {
    [K in keyof T]:
    T[K] extends PrevTypes | T
      ? Union<Union<Prev, Path>, Join<Path, K>>
      :
      Required<T>[K] extends ValidObject<Required<T>[K]>
      ?
        DotPathFive<Required<T>[K], Union<Prev, Path>, Join<Path, K>, PrevTypes | T>
      :
      Union<Union<Prev, Path>, Join<Path, K>>;
  }[keyof T];

type DotPathFive<
  T extends object,
  Prev extends Key | undefined = undefined,
  Path extends Key | undefined = undefined,
  PrevTypes extends object = T
> = string &
  {
    [K in keyof T]:
    T[K] extends PrevTypes | T
      ? Union<Union<Prev, Path>, Join<Path, K>>
      :
      Required<T>[K] extends ValidObject<Required<T>[K]>
      ?
        DotPathSix<Required<T>[K], Union<Prev, Path>, Join<Path, K>, PrevTypes | T>
      :
      Union<Union<Prev, Path>, Join<Path, K>>;
  }[keyof T];

type DotPathSix<
  T extends object,
  Prev extends Key | undefined = undefined,
  Path extends Key | undefined = undefined,
  PrevTypes extends object = T
> = string &
  {
    [K in keyof T]:
    T[K] extends PrevTypes | T
      ? Union<Union<Prev, Path>, Join<Path, K>>
      :
      Required<T>[K] extends ValidObject<Required<T>[K]>
      ?
        DotPathSevenEnd<Required<T>[K], Union<Prev, Path>, Join<Path, K>, PrevTypes | T>
      :
      Union<Union<Prev, Path>, Join<Path, K>>;
  }[keyof T];

// Beyond this point will trigger TS excessively deep error or circular reference.
type DotPathSevenEnd<
  T extends object,
  Prev extends Key | undefined = undefined,
  Path extends Key | undefined = undefined,
  PrevTypes extends object = T
> = string &
  {
    [K in keyof T]:
    T[K] extends PrevTypes | T
      ? Union<Union<Prev, Path>, Join<Path, K>>
      :
      Required<T>[K] extends ValidObject<Required<T>[K]>
      ?
      Union<Union<Prev, Path>, Join<Path, K>>
      :
      Union<Union<Prev, Path>, Join<Path, K>>;
  }[keyof T];
/*#>*/