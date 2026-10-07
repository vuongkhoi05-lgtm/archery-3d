import * as THREE from "three";

export function hitEffect(
    scene,
    position,
    color = 0xffff00
) {
    const particles = [];

    for (let i = 0; i < 20; i++) {
        const particle = new THREE.Mesh(
            new THREE.SphereGeometry(
                .05,
                6,
                6
            ),
            new THREE.MeshBasicMaterial({
                color
            })
        );

        particle.position.copy(position);

        particle.userData.velocity =
            new THREE.Vector3(
                (Math.random() - .5) * 6,
                Math.random() * 6,
                (Math.random() - .5) * 6
            );

        scene.add(particle);

        particles.push(particle);
    }

    const start =
        performance.now();

    function animate(time) {
        const elapsed =
            (time - start) / 1000;

        particles.forEach(p => {
            p.position.addScaledVector(
                p.userData.velocity,
                .016
            );

            p.userData.velocity.y -= .2;

            p.scale.multiplyScalar(.96);
        });

        if (elapsed < .8) {
            requestAnimationFrame(animate);
        } else {
            particles.forEach(p => {
                scene.remove(p);
            });
        }
    }

    requestAnimationFrame(animate);
}