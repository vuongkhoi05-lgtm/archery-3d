export const missions = [
    {
        id: "shots",
        name: "Bắn 20 mũi tên",
        target: 20,
        reward: 300
    },

    {
        id: "bullseye",
        name: "Bắn Bullseye 5 lần",
        target: 5,
        reward: 500
    },

    {
        id: "combo",
        name: "Đạt Combo x10",
        target: 10,
        reward: 700
    }
];

export function updateMission(
    save,
    id,
    amount = 1
) {
    if (!save.missions) {
        save.missions = {};
    }

    save.missions[id] =
        (save.missions[id] || 0) + amount;
}

export function missionCompleted(
    save,
    mission
) {
    return (
        (save.missions?.[mission.id] || 0)
        >= mission.target
    );
}

export function claimMission(
    save,
    mission
) {
    if (!missionCompleted(save, mission)) {
        return false;
    }

    save.coins += mission.reward;

    save.missions[mission.id] = 0;

    return true;
}