/**
 * @author son87.lengoc@gmail.com
 * Created by Ngoc Son Le.
 */
import ListMember from './ListMember';
import AVLTreeNode from './AVLTreeNode';
import {CompareFunction, DoubleLinkedListInfo, ModificationResult} from './types';
import * as DebugModule from 'debug';

const debug = DebugModule('SortedDoubleLinkedList');

export default class SortedDoubleLinkedList<T> {

    private info: DoubleLinkedListInfo<T>;

    private avlTreeRootNode: AVLTreeNode<T> | undefined

    private asList: SortedDoubleLinkedList<T>;

    private currentMember: ListMember<T> | undefined;

    /**
     * The function used to compare values
     */
    private valueCompare: CompareFunction<T>;

    constructor(valueCompare?: CompareFunction<T>) {

        this.info = {

            first: undefined,

            last: undefined

        };

        this.asList = this as SortedDoubleLinkedList<T>;

        if(valueCompare){

            this.valueCompare = valueCompare;

        }
        else {

            this.valueCompare = (one: T, other: T) => {

                if(one === other){

                    return 0;

                }

                if(one > other){

                    return 1;

                }

                return -1;

            }

        }

    }

    /**
     * Return the current value of this list
     *
     * @return {T}
     */
    current(): T {

        if(this.currentMember){

            return this.currentMember.getValue();

        }

        throw new Error('the list is empty');

    }

    /**
     * Delete a `valueToRemove` from list
     *
     * @param {T} valueToRemove
     * @return {this}
     */
    delete(valueToRemove: T): this {

        if(this.avlTreeRootNode){

            const result: boolean | AVLTreeNode<T>  = this.avlTreeRootNode.delete(valueToRemove);

            if(result instanceof AVLTreeNode){ //root was deleted

                if(this.currentMember === this.avlTreeRootNode){

                    this.currentMember = this.avlTreeRootNode.next();

                }

                this.avlTreeRootNode = result;

                return this;

            }
            else if(result){

                if(this.info.first === undefined){

                    this.avlTreeRootNode = undefined;

                }

            }

        }

        return this;

    }

    /**
     * Return true if this list has next element
     *
     * @return {boolean}
     */
    hasNext(): boolean {

        if(this.currentMember && this.currentMember.next() != undefined){

            return true;

        }

        return false;

    }

    /**
     * Return true if the list is empty
     *
     * @return {boolean}
     */
    isEmpty(): boolean {

        if(this.info.first){

            return false;

        }

        return true;

    }

    /**
     * Insert a `newValue` in to the list
     *
     * @param {T} newValue
     * @return {this}
     */
    insert(newValue: T): this {

        if(!this.avlTreeRootNode){

            this.avlTreeRootNode = new AVLTreeNode<T>(this.info, newValue, undefined, this.valueCompare);

            this.info.first = this.avlTreeRootNode;

            this.info.last = this.avlTreeRootNode;

            this.currentMember = this.info.first;

        }
        else {

            const possibleNewRootNode: AVLTreeNode<T> | ModificationResult = this.avlTreeRootNode.insert(newValue);

            if(possibleNewRootNode instanceof AVLTreeNode && possibleNewRootNode !== this.avlTreeRootNode){

                this.avlTreeRootNode = possibleNewRootNode;

            }

        }

        return this;

    }

    /**
     * Return the minimal value of this list
     *
     * @return {T}
     */
    min(): T {

        if(this.info.first){

            return this.info.first.getValue();

        }

        throw new Error('can not get min of an empty list');

    }

    /**
     * Return the max value of this list
     *
     * @return {T}
     */
    max(): T {

        if(this.info.last){

            return this.info.last.getValue();

        }

        throw new Error('can not get max of an empty list');

    }

    /**
     * Return the next bigger value of this list.
     *  You have to make sure that the list has the next element with hasNext(),
     *  otherwise there will be an error
     *
     * @return {T}
     */
    next(): T {

        this.currentMember = this.currentMember!.next();

        return this.currentMember!.getValue();

    }

    /**
     * Reset the current value to the min value.
     *
     * @return {this}
     */
    reset(): this {

        this.currentMember = this.info.first;

        return this;
    }

}