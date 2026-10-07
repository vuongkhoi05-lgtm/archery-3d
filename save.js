const SAVE_KEY = "archery3d_v3";

const defaultSave = {
    highScore: 0,
    totalCoins: 0,

    selectedBow: "wood",
    selectedArrow: "normal",

    ownedBows: ["wood"],
    ownedArrows: ["normal"],

    bowLevels: {
        wood: 1,
        steel: 0,
        gold: 0,
        legendary: 0
    },

    arrowLevels: {
        normal: 1,
        fire: 0,
        ice: 0,
        lightning: 0
    },

    // =========================
    // V8 - CHARACTER
    // =========================

    selectedSkin: "default",

    ownedSkins: [
        "default"
    ],

    equipment: {
        bow: null,
        arrow: null,
        helmet: null,
        armor: null,
        gloves: null,
        boots: null
    }
};

export function loadSave() {
    const data =
        localStorage.getItem(SAVE_KEY);

    if (!data) {
        return structuredClone(defaultSave);
    }

    return {
        ...structuredClone(defaultSave),
        ...JSON.parse(data)
    };
}

export function saveGame(data) {
    localStorage.setItem(
        SAVE_KEY,
        JSON.stringify(data)
    );
}