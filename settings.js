export const defaultSettings = {

    music: true,

    sound: true,

    vibration: true,

    sensitivity: 1,

    quality: "high",

    showFPS: false
};

export function loadSettings() {

    const raw =
        localStorage.getItem(
            "archery3d_settings"
        );

    if (!raw) {
        return {
            ...defaultSettings
        };
    }

    return {
        ...defaultSettings,
        ...JSON.parse(raw)
    };
}

export function saveSettings(
    settings
) {

    localStorage.setItem(
        "archery3d_settings",
        JSON.stringify(settings)
    );
}

export function toggleSetting(
    settings,
    key
) {

    if (
        typeof settings[key] ===
        "boolean"
    ) {
        settings[key] =
            !settings[key];
    }

    saveSettings(settings);
}