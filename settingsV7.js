export const settingsV7 = {

    graphics: "high",

    shadows: true,

    particles: true,

    vibration: true,

    sensitivity: 1,

    aimAssist: true,

    showFPS: false
};


export function loadV7Settings() {

    const data =
        localStorage.getItem(
            "archery3d_v7_settings"
        );

    if (!data) {

        return {
            ...settingsV7
        };
    }

    return {
        ...settingsV7,
        ...JSON.parse(data)
    };
}


export function saveV7Settings(
    settings
) {

    localStorage.setItem(
        "archery3d_v7_settings",

        JSON.stringify(
            settings
        )
    );
}


export function setV7Setting(
    settings,
    key,
    value
) {

    settings[key] = value;

    saveV7Settings(
        settings
    );
}