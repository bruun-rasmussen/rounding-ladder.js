type RoundingStrategy = (
	amount: number,
	stepBelow: number,
	stepAbove: number,
	index: number
) => number
/**
 * Always round towards plus infinity
 */
export declare const CEIL: (amount: number, stepBelow: number, stepAbove: number) => number
/**
 * Always round towards minus infinity
 */
export declare const FLOOR: (amount: number, stepBelow: number, stepAbove: number) => number
/**
 * Rounds to the nearest step in the ladder, but if the number is exactly between two steps, it rounds towards
 * plus infinity.
 */
export declare const HALF_UP: (val: number, stepBelow: number, stepAbove: number) => number
/**
 * Banker's rounding is a way of rounding intended to minimize the bias in the rounding process.
 * To accomplish this, it rounds towards the nearest even-indexed step if the number is exactly between two steps.
 */
export declare const BANKERS_ROUNDING: (
	amount: number,
	stepBelow: number,
	stepAbove: number,
	stepIndex: number
) => number
/**
 * Rounds positive numbers to the nearest step on a logarithmic ladder of numbers
 */
export default class Rounder {
	private readonly decade
	private readonly base
	private readonly roundingStrategy
	/**
	 * Constructs a new Rounder
	 *
	 * @param decade the steps for the first segment of the ladder, in ascending order
	 * @param base the base of the logarithmic ladder. Each segment of the ladder is equal to the previous segment multiplied with this number.
	 * @param roundingStrategy the strategy used when the number is between two steps to select which of the two
	 * steps to use. Defaults to BANKERS_TIE_BREAKER.
	 */
	constructor(decade: number[], base?: number, roundingStrategy?: RoundingStrategy)
	/**
	 * Rounds to the nearest step in the ladder using the configured rounding strategy to break ties.
	 */
	round(amount: number): number
	/**
	 * Finds the step in the ladder closest to plus infinity that is smaller than or equal to the given number.
	 */
	floor(amount: number): number
	/**
	 * Finds the step in the ladder closest to minus infinity that is larger than or equal to the given number.
	 */
	ceil(amount: number): number
	private search
	private findMultiplier
}
export {}
