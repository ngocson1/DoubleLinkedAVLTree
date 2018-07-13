/**
 * @author son87.lengoc@gmail.com
 * Created by Ngoc Son Le.
 */

import * as DebugModule from 'debug';

const debug = DebugModule('SortedDoubleLinkedList:ListMember');
/**
 * Represents a member in a double linked list
 */
export default class ListMember<T> {

    /**
     * The next sibling of this member in the list.
     * It's value is always smaller or equal the value of this member.
     */
    protected _next: ListMember<T> | undefined;

    /**
     * The prev sibling of this member in the list.
     * It's value is always greater the value of this member.
     */
    protected _prev: ListMember<T> | undefined;

    /**
     * The value of type T
     */
    protected value: T;

    constructor(value: T) {

        this.value = value;

    }

    /**
     * Return the value of this member
     *
     * @return {T}
     */
    getValue(): T {

        return this.value;

    }

    /**
     * Return the next sibling of this member
     *
     * @return {ListMember}
     */
    next(): ListMember<T> | undefined {

        return this._next;

    }

    /**
     * Return the previous sibling of this member
     *
     * @return {ListMember}
     */
    prev(): ListMember<T> | undefined {

        return this._prev;

    }

    /**
     * Append the `newMember` as next sibling.
     *
     * @param {ListMember<T>} newMember
     * @return {this}
     */
    protected append(newMember: ListMember<T>): this {

        debug(`append new member with value ${newMember.value} after this node ${this.toString()}`);

        newMember._prev = this as ListMember<T>;

        if(this._next){

            newMember._next = this._next;

            this._next._prev = newMember;

        }

        this._next = newMember;

        return this;

    }

    /**
     * Prepend the `newMember` as prev sibling
     *
     * @param {ListMember} newNextSibling
     * @return {this}
     */
    protected prepend(newMember: ListMember<T>): this {

        debug(`prepend new member with value ${newMember.value} before this node ${this.toString()}`);

        newMember._next = this as ListMember<T>;

        if(this._prev){

            newMember._prev = this._prev;

            this._prev._next = newMember;

        }

        this._prev = newMember;

        return this;

    }

    /**
     * Remove itself from the list
     */
    protected remove(): void {

        debug(`remove this node ${this.toString()} from the list`);

        if(this._next){

            this._next._prev = this._prev;

        }

        if(this._prev){

            this._prev._next = this._next;

        }

        this._prev = undefined;

        this._next = undefined;

    }

}