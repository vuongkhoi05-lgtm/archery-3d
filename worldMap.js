export const worldMap = [

    {
        id: 1,
        name: "🌳 Forest",
        unlocked: true,

        levels: [
            1,
            2,
            3,
            4,
            5
        ]
    },

    {
        id: 2,
        name: "🏔️ Mountain",
        unlocked: false,

        levels: [
            6,
            7,
            8,
            9,
            10
        ]
    },

    {
        id: 3,
        name: "🏜️ Desert",
        unlocked: false,

        levels: [
            11,
            12,
            13,
            14,
            15
        ]
    },

    {
        id: 4,
        name: "🏰 Castle",
        unlocked: false,

        levels: [
            16,
            17,
            18,
            19,
            20
        ]
    }
];


export function isWorldUnlocked(
    save,
    world
) {

    if (world.id === 1) {
        return true;
    }

    const previous =
        worldMap[
            world.id - 2
        ];

    if (!previous) {
        return false;
    }

    const requiredLevel =
        previous.levels[
            previous.levels.length - 1
        ];

    return (
        save.completedLevels?.includes(
            requiredLevel
        )
    );
}


export function getWorld(
    id
) {

    return worldMap.find(
        world => world.id === id
    );
}