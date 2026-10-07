export const equipmentSlots = {

    bow: null,

    arrow: null,

    helmet: null,

    armor: null,

    gloves: null,

    boots: null
};


export function equip(
    save,
    slot,
    itemId
) {

    if (!save.equipment) {

        save.equipment = {
            ...equipmentSlots
        };
    }

    save.equipment[slot] =
        itemId;

    return true;
}


export function unequip(
    save,
    slot
) {

    if (!save.equipment) {
        return false;
    }

    save.equipment[slot] =
        null;

    return true;
}


export function getEquipment(
    save,
    slot
) {

    return (
        save.equipment?.[slot]
        || null
    );
}