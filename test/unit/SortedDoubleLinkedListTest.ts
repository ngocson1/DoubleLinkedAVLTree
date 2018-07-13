/**
 * @author son87.lengoc@gmail.com
 * Created by Ngoc Son Le.
 */

import {expect} from 'chai';
import {describe, it} from 'mocha';
import SortedDoubleLinkedList from '../../src/SortedDoubleLinkedList';

const SortedArray = require('collections/sorted-array');

describe('Sorted Double Linked List Unit Test', function () {

    describe('Insertion', function () {

        it('create empty list should be ok', function () {

            const list: SortedDoubleLinkedList<number> = new SortedDoubleLinkedList<number>();

            expect(list).not.undefined;

        });

        it('add an element to the empty list should be ok', function () {

            const list: SortedDoubleLinkedList<number> = new SortedDoubleLinkedList<number>();

            list.insert(10);

            expect(list.current()).to.be.equal(10);

        });

        it('calling min() on an empty list should throw error', function () {

            const list: SortedDoubleLinkedList<number> = new SortedDoubleLinkedList<number>();

            expect(list.min.bind(list)).to.throw('can not get min of an empty list');

        });

        it('calling min() on  a not empty list should return the smallest value', function () {

            const list: SortedDoubleLinkedList<number> = new SortedDoubleLinkedList<number>();

            list.insert(10);

            expect(list.current()).to.be.equal(10);

            expect(list.min()).to.be.equal(10);

        });

        it('add 2 elements to the empty list should be ok', function () {

            const list: SortedDoubleLinkedList<number> = new SortedDoubleLinkedList<number>();

            list.insert(10);

            list.insert(20);

            expect(list.min()).to.be.equal(10);

        });

        it('adding elements in ascending (always rotate left) order should be ok', function () {

            const list: SortedDoubleLinkedList<number> = new SortedDoubleLinkedList<number>();

            let index: number = 0;

            const base: number = 5;

            for (let i = 0; i < 100; i += base) {

                list.insert(i);

            }

            while (list.hasNext()) {

                expect(list.current() === base * index).to.be.true;

                list.next();

                index++;

            }

        });

        it('adding elements in descending (always rotate right) order should be ok', function () {

            const list: SortedDoubleLinkedList<number> = new SortedDoubleLinkedList<number>();

            let index: number = 0;

            const base: number = 5;

            const arrayOfInsertedNumbers: number[] = [];

            for (let i = 95; i > -1; i -= base) {

                arrayOfInsertedNumbers.push(i);

                list.insert(i);

            }

            while (list.hasNext()) {

                expect(list.current() === arrayOfInsertedNumbers[ index ]).to.be.true;

                list.next();

                index++;

            }

        });

        it('adding elements resulting in left right rotation case should be ok', function () {

            const list: SortedDoubleLinkedList<number> = new SortedDoubleLinkedList<number>();

            let index: number = 0;

            const base: number = 5;

            const arrayOfInsertedNumbers: number[] = [ 10, 5, 7 ];

            const sortedArrayOfInsertedNumbers: number[] = [ 5, 7, 10 ]

            for (let i = 0; i < arrayOfInsertedNumbers.length; i++) {

                list.insert(arrayOfInsertedNumbers[ i ]);

            }

            while (list.hasNext()) {

                expect(list.current() === sortedArrayOfInsertedNumbers[ index ]).to.be.true;

                list.next();

                index++;

            }

        });

        it('adding elements resulting in right left rotation case should be ok', function () {

            const list: SortedDoubleLinkedList<number> = new SortedDoubleLinkedList<number>();

            let index: number = 0;

            const base: number = 5;

            const arrayOfInsertedNumbers: number[] = [ 10, 15, 12 ];

            const sortedArrayOfInsertedNumbers: number[] = [ 10, 12, 15 ]

            for (let i  in arrayOfInsertedNumbers) {

                list.insert(arrayOfInsertedNumbers[ i ]);

            }

            while (list.hasNext()) {

                expect(list.current() === sortedArrayOfInsertedNumbers[ index ]).to.be.true;

                list.next();

                index++;

            }

        });

        it('add random elements shoudl be ok', function () {

            const list: SortedDoubleLinkedList<number> = new SortedDoubleLinkedList<number>();

            const from: number = 0;

            const to: number = 100;

            const range: number = 10000;

            const arrayOfRandomNumbers: number[] = [];

            for (let i = from; i < to; i++) {

                arrayOfRandomNumbers.push(Math.floor(Math.random() * range));

            }

            let start: number = Date.now();

            for (let i in arrayOfRandomNumbers) {

                list.insert(arrayOfRandomNumbers[ i ]);

            }

            list.reset();

            expect(list.current()).to.equal(Math.min.apply(null, arrayOfRandomNumbers));

        })

    })

    describe('Deletion', function () {

        it('remove 1 element resulting in the empty list should be ok', function () {

            const list: SortedDoubleLinkedList<number> = new SortedDoubleLinkedList<number>();

            list.insert(10);

            list.delete(10);

            expect(list.isEmpty()).to.be.true;

            list.insert(15);

            expect(list.current()).to.be.equal(15);

        });

        it('remove 1 element resulting in no rotation should be ok', function () {

            const list: SortedDoubleLinkedList<number> = new SortedDoubleLinkedList<number>();

            let index: number = 0;

            const base: number = 5;

            const arrayOfInsertedNumbers: number[] = [ 10, 12, 15 ];

            const sortedArrayOfInsertedNumbers: number[] = [ 10, 12 ];

            for (let numberToInsert of arrayOfInsertedNumbers) {

                list.insert(numberToInsert);

            }

            list.delete(15);

            while (list.hasNext()) {

                expect(list.current() === sortedArrayOfInsertedNumbers[ index ]).to.be.true;

                list.next();

                index++;

            }

            list.reset();

            list.delete(10);

            expect(list.current()).to.be.equal(12);

            expect(list.hasNext()).to.be.false;

        });

        it('remove 1 element with one child should be ok', function () {

            const list: SortedDoubleLinkedList<number> = new SortedDoubleLinkedList<number>();

            let index: number = 0;

            const base: number = 5;

            const arrayOfInsertedNumbers: number[] = [ 50, 80, 20, 10 ];

            const sortedArrayOfInsertedNumbers: number[] = [ 10, 50, 80 ];

            for (let i = 0; i < arrayOfInsertedNumbers.length; i++) {

                list.insert(arrayOfInsertedNumbers[ i ]);

            }

            list.delete(20);

            list.reset();

            while (list.hasNext()) {

                expect(list.current()).to.be.equal(sortedArrayOfInsertedNumbers[ index ]);

                list.next();

                index++;

            }

        });

        it('remove 1 element with 2 children should be ok', function () {

            const list: SortedDoubleLinkedList<number> = new SortedDoubleLinkedList<number>();

            let index: number = 0;

            const base: number = 5;

            const arrayOfInsertedNumbers: number[] = [ 50, 20, 80, 10, 30 ];

            const sortedArrayOfInsertedNumbers: number[] = [ 10, 30, 50, 80 ];

            for (let i = 0; i < arrayOfInsertedNumbers.length; i++) {

                list.insert(arrayOfInsertedNumbers[ i ]);

            }

            list.delete(20);

            list.reset();

            while (list.hasNext()) {

                expect(list.current() === sortedArrayOfInsertedNumbers[ index ]).to.be.true;

                list.next();

                index++;

            }

        });

        it('remove 1 element resulting in 1 left rotation should be ok', function () {

            const list: SortedDoubleLinkedList<number> = new SortedDoubleLinkedList<number>();

            let index: number = 0;

            const base: number = 5;

            const arrayOfInsertedNumbers: number[] = [ 50, 20, 80, 10, 60, 90, 100 ];

            const sortedArrayOfInsertedNumbers: number[] = [ 20, 50, 60, 80, 90, 100 ];

            for (let i = 0; i < arrayOfInsertedNumbers.length; i++) {

                list.insert(arrayOfInsertedNumbers[ i ]);

            }

            list.delete(10);

            list.reset();

            while (list.hasNext()) {

                expect(list.current() === sortedArrayOfInsertedNumbers[ index ]).to.be.true;

                list.next();

                index++;

            }

        });

        it('remove 1 element resulting 1 right rotation should be ok', function () {

            const list: SortedDoubleLinkedList<number> = new SortedDoubleLinkedList<number>();

            let index: number = 0;

            const base: number = 5;

            const arrayOfInsertedNumbers: number[] = [ 50, 30, 80, 90, 40, 20, 10 ];

            const sortedArrayOfInsertedNumbers: number[] = [ 10, 20, 30, 40, 50, 80 ];

            for (let i = 0; i < arrayOfInsertedNumbers.length; i++) {

                list.insert(arrayOfInsertedNumbers[ i ]);

            }

            list.delete(90);

            list.reset();

            while (list.hasNext()) {

                expect(list.current() === sortedArrayOfInsertedNumbers[ index ]).to.be.true;

                list.next();

                index++;

            }

        });

        it('remove 1 element resulting in right + left rotations should be ok', function () {

            const list: SortedDoubleLinkedList<number> = new SortedDoubleLinkedList<number>();

            let index: number = 0;

            const base: number = 5;

            const arrayOfInsertedNumbers: number[] = [ 50, 20, 80, 10, 60, 90, 70 ];

            const sortedArrayOfInsertedNumbers: number[] = [ 20, 50, 60, 70, 80, 90 ];

            for (let i = 0; i < arrayOfInsertedNumbers.length; i++) {

                list.insert(arrayOfInsertedNumbers[ i ]);

            }

            list.delete(10);

            list.reset();

            while (list.hasNext()) {

                expect(list.current() === sortedArrayOfInsertedNumbers[ index ]).to.be.true;

                list.next();

                index++;

            }

        });

        it('remove 1 element resulting in left + right rotations should be ok', function () {

            const list: SortedDoubleLinkedList<number> = new SortedDoubleLinkedList<number>();

            let index: number = 0;

            const base: number = 5;

            const arrayOfInsertedNumbers: number[] = [ 50, 30, 80, 90, 40, 20, 45 ];

            const sortedArrayOfInsertedNumbers: number[] = [ 20, 30, 40, 45, 50, 80 ];

            for (let i = 0; i < arrayOfInsertedNumbers.length; i++) {

                list.insert(arrayOfInsertedNumbers[ i ]);

            }

            list.delete(90);

            list.reset();

            while (list.hasNext()) {

                expect(list.current() === sortedArrayOfInsertedNumbers[ index ]).to.be.true;

                list.next();

                index++;

            }

        });

        it('remove 1 element resulting in changing root of avl tree should be ok', function () {

            const list: SortedDoubleLinkedList<number> = new SortedDoubleLinkedList<number>();

            let index: number = 0;

            const base: number = 5;

            const arrayOfInsertedNumbers: number[] = [ 50, 30, 80, 90, 40, 20, 10 ];

            const sortedArrayOfInsertedNumbers: number[] = [ 10, 20, 30, 40, 80, 90 ];

            for (let i = 0; i < arrayOfInsertedNumbers.length; i++) {

                list.insert(arrayOfInsertedNumbers[ i ]);

            }

            list.delete(50);

            list.reset();

            while (list.hasNext()) {

                expect(list.current() === sortedArrayOfInsertedNumbers[ index ]).to.be.true;

                list.next();

                index++;

            }

        });

    })

})

describe('Performance vs Collections Sorted Array Test', function () {

    it('Insertion numbers in the ascending in empty list/array order test', function () {

        const list: SortedDoubleLinkedList<number> = new SortedDoubleLinkedList<number>();

        const from: number = 0;

        const to: number = 100000;

        let start: number = Date.now();

        for (let i = from; i < to; i++) {

            list.insert(i);

        }

        let elapsedTime: number = Date.now() - start;

        console.log(`SortedDoubleLinkedList: ${elapsedTime} ms`);

        start = Date.now();

        const sortedArray = SortedArray();

        for (let i = from; i < to; i++) {

            sortedArray.add(i);

        }

        elapsedTime = Date.now() - start;

        console.log(`SortedArray: ${elapsedTime} ms`);

    })

    it('Insertion numbers in the descending order  in empty list/array test', function () {

        const list: SortedDoubleLinkedList<number> = new SortedDoubleLinkedList<number>();

        const from: number = 0;

        const to: number = 100000;

        let start: number = Date.now();

        for (let i = to; i > from; i--) {

            list.insert(i);

        }

        let elapsedTime: number = Date.now() - start;

        console.log(`SortedDoubleLinkedList: ${elapsedTime} ms`);

        start = Date.now();

        const sortedArray = SortedArray();

        for (let i = to; i > from; i--) {

            sortedArray.add(i);

        }

        elapsedTime = Date.now() - start;

        console.log(`SortedArray: ${elapsedTime} ms`);

    })

    it('Insertion numbers in random order  in empty list/array test', function () {

        const list: SortedDoubleLinkedList<number> = new SortedDoubleLinkedList<number>();

        const from: number = 0;

        const to: number = 100000;

        const range: number = (to - from) * 1000;

        const arrayOfRandomNumbers: number[] = [];

        for (let i = from; i < to; i++) {

            arrayOfRandomNumbers.push(Math.floor(Math.random() * range));

        }

        let start: number = Date.now();

        for (let i = 0; i < arrayOfRandomNumbers.length; i++) {

            list.insert(arrayOfRandomNumbers[ i ]);

        }

        let elapsedTime: number = Date.now() - start;

        console.log(`SortedDoubleLinkedList: ${elapsedTime} ms`);

        start = Date.now();

        const sortedArray = SortedArray();

        for (let i = 0; i < arrayOfRandomNumbers.length; i++) {

            sortedArray.add(arrayOfRandomNumbers[ i ]);

        }

        elapsedTime = Date.now() - start;

        console.log(`SortedArray: ${elapsedTime} ms`);

    })

    it('Insertion random numbers in filled list/array test', function () {

        const list: SortedDoubleLinkedList<number> = new SortedDoubleLinkedList<number>();

        const from: number = 0;

        const to: number = 100000;

        const numberOfInsertions: number = 10000;

        const range: number = (to - from) * 1000;

        const arrayOfRandomNumbers: number[] = [];

        for (let i = from; i < to; i++) {

            arrayOfRandomNumbers.push(Math.floor(Math.random() * range));

        }

        const arrayOfNumbersToInsert: number[] = [];

        for (let i = 0; i < numberOfInsertions; i++) {

            arrayOfNumbersToInsert.push(Math.floor(Math.random() * range));

        }

        let elapsedTime: number = 0;

        let start: number;

        const sortedArray = SortedArray();

        for (let i = 0; i < arrayOfRandomNumbers.length; i++) {

            list.insert(arrayOfRandomNumbers[ i ]);

            sortedArray.add(arrayOfRandomNumbers[ i ]);

        }

        start = Date.now();

        for (let i = 0; i < arrayOfNumbersToInsert.length; i++) {

            list.insert(arrayOfNumbersToInsert[ i ]);

        }

        elapsedTime = Date.now() - start;

        console.log(`SortedDoubleLinkedList: ${elapsedTime} ms`);

        start = Date.now();

        for (let i = 0; i < arrayOfNumbersToInsert.length; i++) {

            sortedArray.add(arrayOfNumbersToInsert[ i ]);

        }

        elapsedTime = Date.now() - start;

        console.log(`SortedArray: ${elapsedTime} ms`);

    })

})