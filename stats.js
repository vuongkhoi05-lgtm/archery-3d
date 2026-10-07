export function createStats() {

    return {
        shots: 0,
        hits: 0,
        misses: 0,

        bullseyes: 0,
        criticals: 0,

        highestScore: 0,
        highestCombo: 0,

        totalCoins: 0,
        totalGames: 0,

        playTime: 0
    };
}

export function recordShot(save) {

    save.stats.shots++;
}

export function recordHit(save) {

    save.stats.hits++;
}

export function recordMiss(save) {

    save.stats.misses++;
}

export function recordBullseye(save) {

    save.stats.bullseyes++;
}

export function recordCritical(save) {

    save.stats.criticals++;
}

export function updateHighestScore(
    save,
    score
) {

    if (
        score >
        save.stats.highestScore
    ) {
        save.stats.highestScore =
            score;
    }
}

export function updateHighestCombo(
    save,
    combo
) {

    if (
        combo >
        save.stats.highestCombo
    ) {
        save.stats.highestCombo =
            combo;
    }
}