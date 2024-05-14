/**
 * A rounding strategy is a function that takes an amount and two adjacent steps in a ladder that
 * form a closed interval which includes the amount, as well as an index that represents the position
 * of the interval in the ladder. The function should return one of the two steps, which will be the
 * rounded value.
 */
type RoundingStrategy = (
	amount: number,
	stepBelow: number,
	stepAbove: number,
	index: number
) => number

/**
 * Always round towards plus infinity
 */
export const CEIL = (amount: number, stepBelow: number, stepAbove: number): number => {
	if (stepBelow === amount) {
		return stepBelow
	} else {
		return stepAbove
	}
}

/**
 * Always round towards minus infinity
 */
export const FLOOR = (amount: number, stepBelow: number, stepAbove: number): number => {
	if (stepAbove === amount) {
		return stepAbove
	} else {
		return stepBelow
	}
}

/**
 * Rounds to the nearest step in the ladder, but if the number is exactly between two steps, it rounds towards
 * plus infinity.
 */
export const HALF_UP = (val: number, stepBelow: number, stepAbove: number): number => {
	if (Math.abs(val - stepBelow) < Math.abs(val - stepAbove)) {
		return stepBelow
	} else {
		return stepAbove
	}
}

/**
 * Banker's rounding is a way of rounding intended to minimize the bias in the rounding process.
 * To accomplish this, it rounds towards the nearest even-indexed step if the number is exactly between two steps.
 */
export const BANKERS_ROUNDING = (
	amount: number,
	stepBelow: number,
	stepAbove: number,
	stepIndex: number
): number => {
	const halfway = (stepBelow + stepAbove) / 2
	if (amount < halfway) return stepBelow
	if (amount > halfway) return stepAbove

	if (stepIndex % 2 === 0) {
		return stepBelow
	} else {
		return stepAbove
	}
}

/**
 * Rounds positive numbers to the nearest step on a logarithmic ladder of numbers
 */
export default class Rounder {
	private readonly decade: number[]
	private readonly base: number
	private readonly roundingStrategy: RoundingStrategy

	/**
	 * Constructs a new Rounder
	 *
	 * @param decade the steps for the first segment of the ladder, in ascending order
	 * @param base the base of the logarithmic ladder. Each segment of the ladder is equal to the previous segment multiplied with this number.
	 * @param roundingStrategy the strategy used when the number is between two steps to select which of the two
	 * steps to use. Defaults to BANKERS_TIE_BREAKER.
	 */
	constructor(decade: number[], base = 10, roundingStrategy: RoundingStrategy = BANKERS_ROUNDING) {
		if (decade.length === 0) throw new Error('Decade must contain at least one step')

		// If the last step of the decade is larger than or equal to the first step multiplied by the base, it would
		// break the invariant that each step on the ladder must be larger than the prior step.
		if (decade[decade.length - 1] >= decade[0] * base) {
			throw new Error(
				'The last step of the decade must be smaller than the first step multiplied by the base'
			)
		}

		this.decade = decade
		this.base = base
		this.roundingStrategy = roundingStrategy
	}

	/**
	 * Rounds to the nearest step in the ladder using the configured rounding strategy to break ties.
	 */
	round(amount: number): number {
		return this.search(amount, this.roundingStrategy)
	}

	/**
	 * Finds the step in the ladder closest to plus infinity that is smaller than or equal to the given number.
	 */
	floor(amount: number): number {
		return this.search(amount, FLOOR)
	}

	/**
	 * Finds the step in the ladder closest to minus infinity that is larger than or equal to the given number.
	 */
	ceil(amount: number): number {
		return this.search(amount, CEIL)
	}

	private search(
		amount: number,
		roundingStrategy: RoundingStrategy = this.roundingStrategy
	): number {
		if (amount === 0) return 0

		const [multiplier, segmentIndex] = this.findMultiplier(amount)

		const currentDecade = [
			...this.decade.map((step) => step * multiplier),
			this.decade[0] * multiplier * this.base
		]
		let i = 0
		while (i < currentDecade.length) {
			i += 1
			if (amount <= currentDecade[i]) {
				break
			}
		}

		return roundingStrategy(
			amount,
			currentDecade[i - 1],
			currentDecade[i],
			i + segmentIndex * this.decade.length
		)
	}

	private findMultiplier(amount: number): [number, number] {
		let multiplier = 1
		let segmentIndex = 0
		let nextMultiplier = this.base
		let previousMultiplier = 1

		while (amount < this.decade[0] * multiplier) {
			multiplier = previousMultiplier
			previousMultiplier /= this.base
			segmentIndex -= 1
		}

		while (amount >= nextMultiplier * this.decade[0]) {
			multiplier = nextMultiplier
			nextMultiplier *= this.base
			segmentIndex += 1
		}

		return [multiplier, segmentIndex]
	}
}
