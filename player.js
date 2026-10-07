import * as THREE from "three";

export function createPlayer() {
    const player =
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

    player.add(
        body,
        head
    );

    return player;
}