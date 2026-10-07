import {
    bows,
    arrows
} from "./weapons.js";

export function buyBow(
    save,
    id
) {

    const bow = bows[id];

    if (!bow) return false;

    if (
        save.ownedBows.includes(id)
    ) {
        return true;
    }

    if (
        save.totalCoins < bow.price
    ) {
        return false;
    }

    save.totalCoins -=
        bow.price;

    save.ownedBows.push(id);

    return true;
}


export function selectBow(
    save,
    id
) {

    if (
        save.ownedBows.includes(id)
    ) {

        save.selectedBow =
            id;

        return true;
    }

    return false;
}
import {
    characterSkins
} from "./skins.js";


export function buySkin(
    save,
    id
) {

    const skin =
        characterSkins[id];

    if (!skin) {

        return {
            ok: false,
            message: "Không tìm thấy skin."
        };
    }

    if (
        save.ownedSkins
            .includes(id)
    ) {

        return {
            ok: false,
            message: "Đã sở hữu."
        };
    }

    if (
        save.coins <
        skin.price
    ) {

        return {
            ok: false,
            message: "Không đủ coin."
        };
    }

    save.coins -=
        skin.price;

    save.ownedSkins.push(
        id
    );

    return {
        ok: true,
        message:
            `Đã mua ${skin.name}`
    };
}


export function selectSkin(
    save,
    id
) {

    if (
        !save.ownedSkins
            .includes(id)
    ) {

        return {
            ok: false,
            message:
                "Chưa sở hữu skin."
        };
    }

    save.selectedSkin =
        id;

    return {
        ok: true,
        message:
            "Đã chọn skin."
    };
}