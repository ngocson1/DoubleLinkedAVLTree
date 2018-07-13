/**
 * @author son87.lengoc@gmail.com
 * Created by Ngoc Son Le.
 */

import ListMember from './ListMember';
import {DoubleLinkedListInfo, ModificationResult, CompareFunction} from './types';
import * as DebugModule from 'debug';

const debug = DebugModule('SortedDoubleLinkedList:AVLTreeNode');

/**
 * Represents a node in the AVL tree and also a member of a double linked list
 */
export default class AVLTreeNode<T> extends ListMember<T> {

    /**
     * The left child of this node. It's value is always smaller or equal the value of this node
     */
    protected _leftChild: AVLTreeNode<T> | undefined;

    /**
     * The right child of this node. It's value is always greater the value of this node
     */
    protected _rightChild: AVLTreeNode<T> | undefined;

    /**
     * The number of edges on the longest path from this node to a leaf
     */
    private height: number;

    /**
     * The function used to compare the value of 2 nodes
     */
    private valueCompare: CompareFunction<T>;

    private asNode: AVLTreeNode<T>;

    /**
     *
     * @param {DoubleLinkedListInfo} doubleLinkedListInfo
     * @param {T} value
     * @param {CompareFunction<T>} valueCompare
     * @constructor
     */
    constructor(private readonly doubleLinkedListInfo: DoubleLinkedListInfo<T>, value: T, protected parent: AVLTreeNode<T> | undefined, valueCompare: CompareFunction<T>) {

        super(value);

        this.valueCompare = valueCompare;

        this.height = 0;

        this.asNode = this as AVLTreeNode<T>;

    }

    getValue(): T {

        return this.value;

    }

    getHeight(): number {

        return this.height;

    }

    /**
     * Insert the `valueToInsert` in to the tree having this node as root.
     * If `valueToInsert` was directly inserted as child of this node, the tree is balanced.
     * Otherwise re-balance the tree if necessary.
     * After re-balancing return the new node taking this node's place in the tree.
     * If no re-balancing happens, return itself.
     *
     * @param {T} valueToInsert
     * @return { ModificationResult | AVLTreeNode<T>}
     */
    insert(valueToInsert: T): ModificationResult | AVLTreeNode<T> {

        debug(`insert ${valueToInsert} as child of this node ${this.toString()}`);

        let insertionResult: ModificationResult;

        let insertionResultInChildNode: ModificationResult | AVLTreeNode<T>;

        const compareResult: number = this.valueCompare(valueToInsert, this.value);

        if(compareResult === 0){

            //nothing to do

            //this node already has the `valueToInsert`

            debug(`${valueToInsert} is already the value of this node ${this.toString()}. No insertion`);

            return ModificationResult.DIRECT;

        }

        if(compareResult === 1){ // valueToInsert > this.value

            if(this._rightChild){

                debug(`right child insert ${valueToInsert}`);

                insertionResultInChildNode = this._rightChild.insert(valueToInsert);

                if(AVLTreeNode.isReBalancingHappened(insertionResultInChildNode)){ //

                    return this.asNode;

                }

                insertionResult = ModificationResult.MODIFICATION_IN_RIGHT_CHILD;

            }
            else {

                debug(`insert ${valueToInsert} direct as right child of this node ${this.toString()}`);

                const newChildNode: AVLTreeNode<T> = new AVLTreeNode<T>(this.doubleLinkedListInfo, valueToInsert, this.asNode, this.valueCompare);

                this._rightChild = newChildNode;

                this.append(newChildNode);

                if(this.doubleLinkedListInfo.last === <AVLTreeNode<T>>this){

                    this.doubleLinkedListInfo.last = newChildNode;

                }

                this.updateHeight();

                return ModificationResult.MODIFICATION_IN_RIGHT_CHILD;

            }

        }
        else { //valueToInsert < this.value

            if(this._leftChild){

                debug(`left child insert ${valueToInsert}`);

                insertionResultInChildNode = this._leftChild.insert(valueToInsert);

                if(AVLTreeNode.isReBalancingHappened(insertionResultInChildNode)){

                    return this.asNode;

                }

                insertionResult = ModificationResult.MODIFICATION_IN_LEFT_CHILD;

            }
            else {

                debug(`insert ${valueToInsert} direct as left child of this node ${this.toString()}`);

                const newChildNode: AVLTreeNode<T> = new AVLTreeNode<T>(this.doubleLinkedListInfo, valueToInsert, this.asNode, this.valueCompare);

                this._leftChild = newChildNode;

                this.prepend(newChildNode);

                if(this.doubleLinkedListInfo.first === <AVLTreeNode<T>>this){

                    this.doubleLinkedListInfo.first = newChildNode;

                }

                this.updateHeight();

                return ModificationResult.MODIFICATION_IN_LEFT_CHILD;

            }

        }

        if(!this.isBalanced()){

            debug(`this tree having this node ${this.toString()} as root is unbalanced`);

            this.re_balance(insertionResult, insertionResultInChildNode as ModificationResult);

            return this.parent!;

        }

        this.updateHeight();

        return insertionResult;

    }

    /**
     * Delete a node with the `valueToRemove` from the tree having this node as root
     *
     * @param {T} valueToRemove
     * @return {this}
     */

    /**
     * Delete a node with the `valueToRemove` from the tree having this node as root.
     * Re-balance the tree if necessary.
     * After re-balancing return the new node taking this node's place in the tree.
     *
     * @param {T} valueToRemove
     * @return {boolean | AVLTreeNode<T>}
     */
    delete(valueToRemove: T): AVLTreeNode<T> | boolean {

        debug(`delete ${valueToRemove} from tree having this node ${this.toString()} as root`);

        let didDeletionHappen: boolean | AVLTreeNode<T>;

        let deletionResult: AVLTreeNode<T> | boolean;

        const compareResult: number = this.valueCompare(valueToRemove, this.value);

        if(compareResult === 0){

            debug(`${valueToRemove} is the value of the tree having this node ${this.toString()} as root`);

            deletionResult = this._delete();

            if(deletionResult instanceof AVLTreeNode){

                const replacementNode: AVLTreeNode<T> = deletionResult as AVLTreeNode<T>;

                return replacementNode;

            }
            else {

                return true;

            }

        }
        else if(compareResult === 1){

            debug(`${valueToRemove} is bigger the value of this node ${this.toString()}. Remove it from right sub tree`);

            if(this._rightChild){

                didDeletionHappen = this._rightChild.delete(valueToRemove);

                if(didDeletionHappen === false){ // no deletion

                    return false;

                }

            }
            else {

                return false;

            }

        }
        else {

            debug(`${valueToRemove} is smaller the value of this node ${this.toString()}. Remove it from left sub tree`);

            if(this._leftChild){

                didDeletionHappen = this._leftChild.delete(valueToRemove);

                if(didDeletionHappen === false){ // no deletion

                    return false;

                }

            }
            else {

                return false;

            }

        }

        if(!this.isBalanced()){

            debug(`this tree having this node ${this.toString()} as root is unbalanced`);

            this.re_balanceAfterDeletion();

            return this.parent!;

        }
        else {

            this.updateHeight();

            return true;

        }

    }

    toString(): string {

        return `[${this.value.toString()}]`

    }

    protected isChildWithGreaterHeightLeft(): boolean {

        if(AVLTreeNode.calculateHeight(this._leftChild) >= AVLTreeNode.calculateHeight(this._rightChild)){

            return true;

        }

        return false;

    }

    /**
     * Return true if the tree having this node as root is balanced. It means the balance factor = 0, 1 or -1
     *
     * @return {boolean}
     */
    protected isBalanced(): boolean {

        const balanceFactor: number = AVLTreeNode.calculateHeight(this._rightChild) - AVLTreeNode.calculateHeight(this._leftChild);

        debug(`calculated balance factor for this node: ${this.toString()} is ${balanceFactor}`);

        if(balanceFactor > 1 || balanceFactor < -1){

            return false;

        }

        return true;

    }

    protected re_balanceAfterDeletion(): void {

        debug(`this tree having this node ${this.toString()} as root is unbalanced`);

        let modificationResult: ModificationResult;

        let childModificationResult: ModificationResult;

        if(this.isChildWithGreaterHeightLeft()){

            modificationResult = ModificationResult.MODIFICATION_IN_LEFT_CHILD;

            if(this._leftChild!.isChildWithGreaterHeightLeft()){

                childModificationResult = ModificationResult.MODIFICATION_IN_LEFT_CHILD;

            }
            else {

                childModificationResult = ModificationResult.MODIFICATION_IN_RIGHT_CHILD;

            }

        }
        else {

            modificationResult = ModificationResult.MODIFICATION_IN_RIGHT_CHILD;

            if(this._rightChild!.isChildWithGreaterHeightLeft()){

                childModificationResult = ModificationResult.MODIFICATION_IN_LEFT_CHILD;

            }
            else {

                childModificationResult = ModificationResult.MODIFICATION_IN_RIGHT_CHILD;

            }

        }

        this.re_balance(modificationResult, childModificationResult);
    }

    /**
     * Set `rightChild` as right child of this node
     *
     * @param {AVLTreeNode<T> | undefined} rightChild
     * @return {this}
     */
    protected setRightChild(rightChild: AVLTreeNode<T> | undefined): this {

        this._rightChild = rightChild;

        if(rightChild){

            rightChild.parent = this.asNode;

        }

        return this;

    }

    /**
     * Set `leftChild` as left child of this node
     *
     * @param {AVLTreeNode<T> | undefined} leftChild
     * @return {this}
     */
    protected setLeftChild(leftChild: AVLTreeNode<T> | undefined): this {

        this._leftChild = leftChild;

        if(leftChild){

            leftChild.parent = this.asNode;

        }

        return this;

    }

    protected updateHeight(): void {

        const beforeUpdate: number = this.height;

        this.height = 1 + Math.max(AVLTreeNode.calculateHeight(this._leftChild), AVLTreeNode.calculateHeight(this._rightChild));

        const afterUpdate = this.height;

        debug(`update the height of this node ${this.toString()} from ${beforeUpdate} to ${afterUpdate}`);

    }

    /**
     * Calculate the height of a tree having `node` as root
     *
     * @param {AVLTreeNode<U> | undefined} node
     * @return {number}
     */
    public static calculateHeight<U>(node: AVLTreeNode<U> | undefined): number {

        if(node){

            return node.getHeight();

        }

        return -1;

    }

    /**
     * Find out based on the returned value from child node if the re-balancing already happened
     *
     * @param {ModificationResult | AVLTreeNode<U>} returnedValueFromChildNode
     * @return {boolean}
     */
    private static isReBalancingHappened<U>(returnedValueFromChildNode: ModificationResult | AVLTreeNode<U>): boolean {

        if(returnedValueFromChildNode instanceof AVLTreeNode){

            return true;

        }

        return false;

    }

    /**
     * Switch the `originalChild` with the `newChild` in the parent-child-relationship
     *
     * @param {AVLTreeNode<T> | undefined} parent
     * @param {AVLTreeNode<T>} originalChild
     * @param {AVLTreeNode<T>} newChild
     */
    private replaceParentChild(parent: AVLTreeNode<T> | undefined, originalChild: AVLTreeNode<T>, newChild: AVLTreeNode<T> | undefined): void {

        if(parent){

            if(parent._leftChild === originalChild){

                parent.setLeftChild(newChild);

            }
            else {

                parent.setRightChild(newChild);

            }

            return;
        }

        if(newChild){ // new child become sroot

            debug(`${newChild.toString()} becomes root`);

            newChild.parent = undefined;

        }

    }

    /**
     * Return the new node taking this node's place in the tree after deletion.
     * If this node has no children return true;
     *
     * @return {AVLTreeNode<T> | boolean}
     * @private
     */
    private _delete(): AVLTreeNode<T> | boolean {

        debug(`this node ${this.toString()} deletes itself`);

        const nextMember: AVLTreeNode<T> | undefined = this.next() as AVLTreeNode<T>;

        const prevMember: AVLTreeNode<T> | undefined = this.prev() as AVLTreeNode<T>;

        if(!this._prev){

            this.doubleLinkedListInfo.first = this._next;

        }

        if(!this._next){

            this.doubleLinkedListInfo.last = this._prev

        }

        this.remove(); //remove from list

        if(this.hasNoChildren()){

            debug(`this node ${this.toString()} has no children. Delete and change parent-child-relationship`);

            this.replaceParentChild(this.parent, this.asNode, undefined);

            return true;

        }

        const onlyChild: AVLTreeNode<T> | undefined = this.onlyChild();

        if(onlyChild){

            debug(`this node ${this.toString()} has only one child. Delete and change parent-child-relationship`);

            this.replaceParentChild(this.parent, this.asNode, onlyChild);

            return onlyChild;

        }

        const leftChild: AVLTreeNode<T> = this._leftChild!;

        const rightChild: AVLTreeNode<T> = this._rightChild!;

        if(leftChild.height >= rightChild.height){

            debug(`the replacement node ${prevMember.toString()} is the node with the max value of the left sub tree`);

            const prevMemberParent: AVLTreeNode<T> = prevMember.parent!;

            const prevMemberLeftChild: AVLTreeNode<T> | undefined = prevMember._leftChild;

            if(this._leftChild !== prevMember){

                prevMemberParent.setRightChild(prevMemberLeftChild);

                prevMember.setLeftChild(this._leftChild);
            }

            this.replaceParentChild(this.parent, this.asNode, prevMember);

            prevMember.setRightChild(this._rightChild);

            if(!prevMemberParent.isBalanced()){

                prevMemberParent.re_balanceAfterDeletion();

            }

            return prevMember;

        }
        else {

            debug(`the replacement node ${nextMember.toString()} is the node with the min value of the right sub tree`);

            const nextMemberParent: AVLTreeNode<T> = nextMember.parent!;

            const nextMemberRightChild: AVLTreeNode<T> | undefined = nextMember._rightChild;

            if(this._rightChild !== nextMember){

                nextMemberParent.setLeftChild(nextMemberRightChild);

                nextMember.setLeftChild(this._leftChild);
            }

            this.replaceParentChild(this.parent, this.asNode, nextMember);

            nextMember.setRightChild(this._rightChild);

            if(!nextMemberParent.isBalanced()){

                nextMemberParent.re_balanceAfterDeletion();

            }

            return nextMember;

        }

    }

    private hasNoChildren(): boolean {

        return !this._leftChild && !this._rightChild;

    }

    /**
     * Return the only child of this node.
     * Return `undefined` if this node has both children or none.
     *
     * @return {AVLTreeNode<T> | undefined}
     */
    private onlyChild(): AVLTreeNode<T> | undefined {

        if(!this._leftChild && !this._rightChild){ //none

            return;

        }

        if(this._leftChild && this._rightChild){ // both

            return;
        }

        return this._rightChild || this._leftChild;

    }

    /**
     * Re-balance the tree having this node as root
     *
     * @param {ModificationResult} modificationResult
     * @param {ModificationResult} childModificationResult
     */
    private re_balance(modificationResult: ModificationResult, childModificationResult: ModificationResult): void {

        if(modificationResult === ModificationResult.MODIFICATION_IN_LEFT_CHILD){

            if(childModificationResult === ModificationResult.MODIFICATION_IN_RIGHT_CHILD){

                debug('left right case');

                //additionally rotate left child left
                this._leftChild!.rotateLeft();

            }
            else {

                debug('left left case');

            }

            //always rotate right
            this.rotateRight();

        }
        else { // right case

            if(childModificationResult === ModificationResult.MODIFICATION_IN_LEFT_CHILD){

                debug('right left case');

                //additionally rotate right child right
                this._rightChild!.rotateRight();

            }
            else {

                debug('right right case');

            }

            //always rotate left
            this.rotateLeft()

        }

    }

    /**
     * Rotate the tree having this as root node clockwise with center being it's left child
     *
     * @return {this}
     */
    private rotateRight(): this {

        debug(`rotate this node ${this.toString()} right`);

        const ancestor: AVLTreeNode<T> | undefined = this.parent;

        const leftChild: AVLTreeNode<T> = this._leftChild!;

        const leftRightDescendant: AVLTreeNode<T> | undefined = leftChild._rightChild;

        this.replaceParentChild(ancestor, this.asNode, leftChild);

        leftChild.setRightChild(this.asNode);

        this.setLeftChild(leftRightDescendant);

        this.updateHeight();

        leftChild.updateHeight();

        return this;

    }

    /**
     * Rotate the tree having this as root node anticlockwise with center being it's right child
     *
     * @return {this}
     */
    private rotateLeft(): this {

        debug(`rotate this node ${this.toString()} left`);

        const ancestor: AVLTreeNode<T> | undefined = this.parent;

        const rightChild: AVLTreeNode<T> = this._rightChild!;

        const rightLeftDescendant: AVLTreeNode<T> | undefined = rightChild._leftChild;

        this.replaceParentChild(ancestor, this.asNode, rightChild);

        rightChild.setLeftChild(this.asNode);

        this.setRightChild(rightLeftDescendant);

        this.updateHeight();

        rightChild.updateHeight();

        return this;

    }

}