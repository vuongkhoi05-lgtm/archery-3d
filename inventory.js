export function createInventory() {

    return {

        materials: {
            wood: 0,
            iron: 0,
            gold: 0,
            crystal: 0
        },

        specialArrows: {
            fire: 0,
            ice: 0,
            lightning: 0
        },

        items: []
    };
}

export function addMaterial(
    save,
    material,
    amount = 1
) {

    if (
        !save.inventory.materials[
            material
        ]
    ) {
        save.inventory.materials[
            material
        ] = 0;
    }

    save.inventory.materials[
        material
    ] += amount;
}

export function addArrow(
    save,
    type,
    amount = 1
) {

    if (
        !save.inventory.specialArrows[
            type
        ]
    ) {
        save.inventory.specialArrows[
            type
        ] = 0;
    }

    save.inventory.specialArrows[
        type
    ] += amount;
}