export function calculateCritical(
    baseScore,
    distance,
    radius
) {

    const ratio =
        distance / radius;

    if (ratio <= 0.08) {

        return {
            critical: true,
            multiplier: 3,
            score: baseScore * 3
        };
    }

    if (ratio <= 0.18) {

        return {
            critical: true,
            multiplier: 2,
            score: baseScore * 2
        };
    }

    return {
        critical: false,
        multiplier: 1,
        score: baseScore
    };
}