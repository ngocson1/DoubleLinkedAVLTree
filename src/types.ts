/**
 * @author son87.lengoc@gmail.com
 * Created by Ngoc Son Le.
 */

import ListMember from './ListMember';

/**
 * Type of a function taking 2 parameters of type `T`.
 * It return 0 if both parameters are equal.
 * It returns 1 if `one` is greater than `other`
 * It returns -1 if `one` is smaller than `other`
 */
export type CompareFunction<T> = (one: T, other: T) => number;

/**
 * Used internally to track modifications  happening when insert or remove, which effects the order of the list
 */
export type DoubleLinkedListInfo<T> = {

    first: ListMember<T> | undefined;

    last: ListMember<T> | undefined;

}

export enum ModificationResult {

    DIRECT,

    MODIFICATION_IN_LEFT_CHILD,

    MODIFICATION_IN_RIGHT_CHILD

}