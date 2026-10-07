export const ranks = [

    {
        id: "bronze",
        name: "🥉 Bronze",
        minScore: 0
    },

    {
        id: "silver",
        name: "🥈 Silver",
        minScore: 1000
    },

    {
        id: "gold",
        name: "🥇 Gold",
        minScore: 5000
    },

    {
        id: "platinum",
        name: "💎 Platinum",
        minScore: 15000
    },

    {
        id: "diamond",
        name: "💠 Diamond",
        minScore: 30000
    },

    {
        id: "master",
        name: "👑 Master",
        minScore: 60000
    },

    {
        id: "legend",
        name: "🔥 Legend",
        minScore: 100000
    }
];

export function getRank(score) {

    let current = ranks[0];

    for (const rank of ranks) {

        if (score >= rank.minScore) {
            current = rank;
        }
    }

    return current;
}

export function getNextRank(score) {

    for (const rank of ranks) {

        if (score < rank.minScore) {
            return rank;
        }
    }

    return null;
}

export function getRankProgress(score) {

    const current =
        getRank(score);

    const next =
        getNextRank(score);

    if (!next) return 100;

    const range =
        next.minScore -
        current.minScore;

    const progress =
        score -
        current.minScore;

    return Math.min(
        100,
        Math.max(
            0,
            progress / range * 100
        )
    );
}