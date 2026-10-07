const tutorialSteps = [
    {
        title: "🏹 Kéo cung",
        text:
            "Giữ và kéo trên màn hình để ngắm."
    },

    {
        title: "🎯 Ngắm bia",
        text:
            "Đưa tâm ngắm vào vòng điểm."
    },

    {
        title: "🔥 Tăng lực",
        text:
            "Giữ lâu hơn để tăng lực bắn."
    },

    {
        title: "🎯 Bullseye",
        text:
            "Bắn chính giữa để nhận điểm cao."
    },

    {
        title: "🌬️ Gió",
        text:
            "Hãy điều chỉnh hướng bắn theo gió."
    }
];

let currentStep = 0;


export function startTutorial() {

    currentStep = 0;

    showStep();
}


function showStep() {

    const step =
        tutorialSteps[currentStep];

    if (!step) {

        finishTutorial();

        return;
    }

    let panel =
        document.getElementById(
            "tutorialPanel"
        );

    if (!panel) {

        panel =
            document.createElement("div");

        panel.id =
            "tutorialPanel";

        panel.innerHTML = `
            <div id="tutorialBox">

                <h2 id="tutorialTitle"></h2>

                <p id="tutorialText"></p>

                <button id="tutorialNext">
                    TIẾP
                </button>

            </div>
        `;

        document.body.appendChild(panel);

        document
            .getElementById("tutorialNext")
            .addEventListener(
                "click",
                nextStep
            );
    }

    document
        .getElementById("tutorialTitle")
        .textContent =
        step.title;

    document
        .getElementById("tutorialText")
        .textContent =
        step.text;
}


function nextStep() {

    currentStep++;

    showStep();
}


function finishTutorial() {

    const panel =
        document.getElementById(
            "tutorialPanel"
        );

    if (panel) {
        panel.remove();
    }

    localStorage.setItem(
        "archery3d_tutorial",
        "done"
    );
}


export function shouldShowTutorial() {

    return (
        localStorage.getItem(
            "archery3d_tutorial"
        ) !== "done"
    );
}