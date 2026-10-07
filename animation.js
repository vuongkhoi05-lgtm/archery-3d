export function updatePlayerAnimation(
    player,
    state,
    time
) {
    if (!player) return;

    switch (state) {

        case "idle":
            player.rotation.y =
                Math.sin(time * 2) * 0.02;
            break;

        case "aim":
            player.rotation.y = 0;
            break;

        case "shoot":
            player.rotation.y = -0.15;
            break;

        case "victory":
            player.rotation.z =
                Math.sin(time * 5) * 0.08;
            break;
    }
}