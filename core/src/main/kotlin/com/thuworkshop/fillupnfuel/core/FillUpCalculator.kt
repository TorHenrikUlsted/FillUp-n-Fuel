package com.thuworkshop.fillupnfuel.core

/** A fuel gauge reading in sixteenths of a tank, from [EMPTY] to [FULL]. */
@JvmInline
value class FuelLevel(val step: Int) {
    init {
        require(step in 0..STEPS) { "Fuel level step $step is outside 0..$STEPS" }
    }

    val fraction: Double get() = step.toDouble() / STEPS

    /** The reading as a reduced fraction, such as "3/8"; "0" when empty. */
    val label: String
        get() {
            if (step == 0) return "0"
            val divisor = gcd(step, STEPS)
            return "${step / divisor}/${STEPS / divisor}"
        }

    fun lower(): FuelLevel = FuelLevel((step - 1).coerceAtLeast(0))
    fun higher(): FuelLevel = FuelLevel((step + 1).coerceAtMost(STEPS))

    companion object {
        const val STEPS = 16
        val EMPTY = FuelLevel(0)
        val HALF = FuelLevel(STEPS / 2)
        val FULL = FuelLevel(STEPS)

        fun fromStep(step: Int?): FuelLevel = step?.takeIf { it in 0..STEPS }?.let(::FuelLevel) ?: HALF

        private tailrec fun gcd(a: Int, b: Int): Int = if (b == 0) a else gcd(b, a % b)
    }
}

data class FillUpCost(
    /** Litres or gallons, in the tank size's unit. */
    val fuelNeeded: Double,
    val cost: Double,
)

/** How much fuel tops the tank up from [level], and what it costs. */
fun calculateFillUp(tankSize: Double, fuelPrice: Double, level: FuelLevel): FillUpCost {
    val needed = (tankSize * (1 - level.fraction)).orZeroIfInvalid()
    return FillUpCost(fuelNeeded = needed, cost = (needed * fuelPrice).orZeroIfInvalid())
}
