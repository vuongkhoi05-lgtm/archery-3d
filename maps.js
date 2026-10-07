import * as THREE from "three";

export function createMap(scene, type = "forest") {
    const group = new THREE.Group();

    const groundColors = {
        forest: 0x3f7138,
        mountain: 0x687070,
        desert: 0xc99b52,
        castle: 0x46484d
    };

    const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(180, 180),
        new THREE.MeshStandardMaterial({
            color: groundColors[type] || 0x3f7138
        })
    );

    ground.rotation.x = -Math.PI / 2;
    group.add(ground);

    if (type === "forest") {
        createForest(group);
    }

    if (type === "mountain") {
        createMountains(group);
    }

    if (type === "desert") {
        createDesert(group);
    }

    if (type === "castle") {
        createCastle(group);
    }

    scene.add(group);

    return group;
}

function createForest(group) {
    for (let i = 0; i < 40; i++) {
        const tree = new THREE.Group();

        const trunk = new THREE.Mesh(
            new THREE.CylinderGeometry(.3, .45, 3, 8),
            new THREE.MeshStandardMaterial({
                color: 0x70452a
            })
        );

        trunk.position.y = 1.5;

        const leaves = new THREE.Mesh(
            new THREE.ConeGeometry(2, 5, 8),
            new THREE.MeshStandardMaterial({
                color: 0x1e6935
            })
        );

        leaves.position.y = 5;

        tree.add(trunk, leaves);

        tree.position.set(
            (Math.random() - .5) * 100,
            0,
            -Math.random() * 100
        );

        group.add(tree);
    }
}

function createMountains(group) {
    for (let i = 0; i < 12; i++) {
        const mountain = new THREE.Mesh(
            new THREE.ConeGeometry(
                8 + Math.random() * 10,
                20 + Math.random() * 20,
                6
            ),
            new THREE.MeshStandardMaterial({
                color: 0x59605d
            })
        );

        mountain.position.set(
            (Math.random() - .5) * 130,
            10,
            -70 - Math.random() * 60
        );

        group.add(mountain);
    }
}

function createDesert(group) {
    for (let i = 0; i < 15; i++) {
        const rock = new THREE.Mesh(
            new THREE.DodecahedronGeometry(
                1 + Math.random() * 2
            ),
            new THREE.MeshStandardMaterial({
                color: 0x987040
            })
        );

        rock.position.set(
            (Math.random() - .5) * 100,
            1,
            -Math.random() * 100
        );

        group.add(rock);
    }
}

function createCastle(group) {
    const castle = new THREE.Group();

    const wall = new THREE.Mesh(
        new THREE.BoxGeometry(25, 8, 4),
        new THREE.MeshStandardMaterial({
            color: 0x555555
        })
    );

    wall.position.set(0, 4, -80);

    castle.add(wall);

    for (const x of [-12, 12]) {
        const tower = new THREE.Mesh(
            new THREE.CylinderGeometry(3, 3, 14, 8),
            new THREE.MeshStandardMaterial({
                color: 0x777777
            })
        );

        tower.position.set(x, 7, -80);

        castle.add(tower);
    }

    group.add(castle);
}