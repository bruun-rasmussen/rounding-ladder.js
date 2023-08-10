import { describe, expect, it } from '@jest/globals'
import Rounder, { BANKERS_ROUNDING } from './index'

describe('rounding ladder', () => {
	const decade = [10, 11, 13, 15, 17, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90]
	const ladder = new Rounder(decade)

	describe('construction', () => {
		it('throws an error if the decade is empty', () => {
			expect(() => new Rounder([], 10)).toThrowError('Decade must contain at least one step')
		})

		it('throws an error if the last step of the decade is larger than or equal to the first step multiplied by the base', () => {
			expect(() => new Rounder([1, 2], 2)).toThrowError(
				'The last step of the decade must be smaller than the first step multiplied by the base'
			)
		})
	})

	describe('if the number is zero', () => {
		it('floors to zero', () => {
			expect(ladder.floor(0)).toBe(0)
		})

		it('ceils to zero', () => {
			expect(ladder.ceil(0)).toBe(0)
		})

		it('rounds to zero', () => {
			expect(ladder.round(0)).toBe(0)
		})
	})

	describe('if the number is less than the first step', () => {
		it('rounds to the nearest step that is a base root of a step in the decade', () => {
			expect(ladder.round(2.2)).toEqual(2)
		})
	})

	describe('if the number is equal to a step', () => {
		it('floors to the step', () => {
			expect(ladder.floor(10)).toEqual(10)
		})

		it('ceils to the step', () => {
			expect(ladder.ceil(10)).toEqual(10)
		})

		it('rounds to the step', () => {
			expect(ladder.round(10)).toEqual(10)
		})
	})

	describe('if the number is between two steps', () => {
		describe('and the number is closer to the lower step', () => {
			it('rounds down', () => {
				expect(ladder.round(18)).toEqual(17)
			})
		})

		describe('and the number is closer to the higher step', () => {
			it('rounds up', () => {
				expect(ladder.round(19)).toEqual(20)
			})
		})

		describe('and the number is exactly halfway between the two steps', () => {
			describe("when using banker's rounding", () => {
				const evenLadder = new Rounder([10, 20, 40, 60], 10, BANKERS_ROUNDING)

				it('it rounds towards plus infinity if the index of the step is even, and towards minus infinity if the index of the step is odd', () => {
					expect(evenLadder.round(8)).toBe(6)
					expect(evenLadder.round(15)).toBe(20)
					expect(evenLadder.round(30)).toBe(20)
					expect(evenLadder.round(50)).toBe(60)
					expect(evenLadder.round(80)).toBe(60)
					expect(evenLadder.round(150)).toBe(200)
				})

				describe('a ladder with an odd numbered steps in the decade, behaves like a ladder with an even number of steps in the decade', () => {
					const oddDecade = [10, 30, 60]
					const oddLadder = new Rounder(oddDecade, 10, BANKERS_ROUNDING)
					const evenDecade = [10, 30, 60, 100, 300, 600]
					const evenLadder = new Rounder(evenDecade, 100, BANKERS_ROUNDING)

					it('behaves like it would if it were expressed as a ladder with an even number of steps in the decade and the base squared', () => {
						;[5, 20, 45, 80, 200, 450, 800].forEach((number) => {
							expect(oddLadder.round(number)).toBe(evenLadder.round(number))
						})
					})
				})
			})
		})

		describe('when the number is exactly between the last step of the decade, and the first step of the next decade', () => {
			it('floors to the last step of the decade', () => {
				expect(ladder.floor(95)).toBe(90)
			})

			it('ceils to the first step of the next decade', () => {
				expect(ladder.ceil(95)).toBe(100)
			})
		})
	})
})
