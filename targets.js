import * as THREE from "three";

export function createMovingTarget(size = 1) {
    const target = new THREE.Group();

    const colors = [
        0xffffff,
        0x222222,
        0x2870d8,
        0xd92828,
        0xf5c400
    ];

    const radii = [
        3,
        2.4,
        1.8,
        1.2,
        .55
    ];

    for (let i = 0; i < radii.length; i++) {
        const mesh = new THREE.Mesh(
            new THREE.CylinderGeometry(
                radii[i] * size,
                radii[i] * size,
                .3,
                48
            ),
            new THREE.MeshStandardMaterial({
                color: colors[i]
            })
        );

        mesh.rotation.x = Math.PI / 2;

        target.add(mesh);
    }

    target.userData.radius = 3 * size;

    return target;
}

export function updateMovingTarget(
    target,
    time,
    speed = 1,
    range = 5
) {
    target.position.x =
        Math.sin(time * speed) * range;

    target.position.y =
        5 +
        Math.sin(time * speed * .7) * .8;
}

export function calculateTargetScore(
    distance,
    radius
) {
    const ratio = distance / radius;

    if (ratio <= .18) return 100;
    if (ratio <= .40) return 60;
    if (ratio <= .60) return 40;
    if (ratio <= .80) return 20;
    if (ratio <= 1) return 10;

    return 0;
}