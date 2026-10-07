export function createLocalLeaderboard(
    save
) {

    const data =
        JSON.parse(
            localStorage.getItem(
                "archery3d_leaderboard"
            ) || "[]"
        );

    data.push({
        score:
            save.stats?.highestScore || 0,

        combo:
            save.stats?.highestCombo || 0,

        date:
            new Date().toISOString()
    });

    data.sort(
        (a, b) =>
            b.score - a.score
    );

    const top =
        data.slice(0, 20);

    localStorage.setItem(
        "archery3d_leaderboard",
        JSON.stringify(top)
    );

    return top;
}

export function getLeaderboard() {

    return JSON.parse(
        localStorage.getItem(
            "archery3d_leaderboard"
        ) || "[]"
    );
}