import * as THREE from "three";

import {
    loadModel
} from "./modelLoader.js";

import {
    characterSkins
} from "./skins.js";

export async function createCharacter(
    skinId = "default"
) {

    const skin =
        characterSkins[skinId]
        || characterSkins.default;

    const model =
        await loadModel(
            skin.model
        );

    if (!model) {
        return createFallbackCharacter();
    }

    model.scale.set(
        1.2,
        1.2,
        1.2
    );

    model.position.set(
        0,
        0,
        8
    );

    model.userData.skin =
        skinId;

    return model;
}


function createFallbackCharacter() {

    const group =
        new THREE.Group();

    const body =
        new THREE.Mesh(
            new THREE.CapsuleGeometry(
                .45,
                1.2,
                6,
                12
            ),
            new THREE.MeshStandardMaterial({
                color: 0x3366aa
            })
        );

    body.position.y = 1.2;

    const head =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                .38,
                16,
                16
            ),
            new THREE.MeshStandardMaterial({
                color: 0xffc49a
            })
        );

    head.position.y = 2.25;

    group.add(
        body,
        head
    );

    return group;
}