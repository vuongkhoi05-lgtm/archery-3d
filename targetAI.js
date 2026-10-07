export const targetTypes = {

    normal: {
        speed: 1,
        range: 4
    },

    fast: {
        speed: 2.5,
        range: 6
    },

    zigzag: {
        speed: 2,
        range: 7
    },

    flying: {
        speed: 1.5,
        range: 5
    }
};

export function updateTargetAI(
    target,
    type,
    time
) {
    const data =
        targetTypes[type]
        || targetTypes.normal;

    if (type === "normal") {

        target.position.x =
            Math.sin(
                time * data.speed
            ) * data.range;
    }

    if (type === "fast") {

        target.position.x =
            Math.sin(
                time * data.speed
            ) * data.range;
    }

    if (type === "zigzag") {

        target.position.x =
            Math.sin(
                time * data.speed
            ) * data.range;

        target.position.y =
            5 +
            Math.sin(
                time * data.speed * 2
            ) * 2;
    }

    if (type === "flying") {

        target.position.x =
            Math.sin(
                time * data.speed
            ) * data.range;

        target.position.y =
            5 +
            Math.sin(
                time * 1.5
            ) * 3;
    }
}