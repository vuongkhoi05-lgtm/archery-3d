const dailyRewards = [
    { coins: 100, gems: 0 },
    { coins: 200, gems: 0 },
    { coins: 300, gems: 1 },
    { coins: 500, gems: 2 },
    { coins: 800, gems: 3 },
    { coins: 1200, gems: 5 },
    { coins: 2000, gems: 10 }
];

function getToday() {
    return new Date()
        .toISOString()
        .slice(0, 10);
}

export function canClaimDaily(save) {
    return save.daily?.lastClaim !== getToday();
}

export function claimDaily(save) {
    if (!canClaimDaily(save)) {
        return null;
    }

    if (!save.daily) {
        save.daily = {
            lastClaim: "",
            streak: 0
        };
    }

    save.daily.streak++;

    if (save.daily.streak > 7) {
        save.daily.streak = 1;
    }

    const reward =
        dailyRewards[
            save.daily.streak - 1
        ];

    save.coins += reward.coins;
    save.gems += reward.gems;

    save.daily.lastClaim =
        getToday();

    return reward;
}

export function getNextReward(save) {
    const day =
        Math.min(
            (save.daily?.streak || 0) + 1,
            7
        );

    return dailyRewards[day - 1];
}