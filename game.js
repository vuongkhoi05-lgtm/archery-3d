
import {
    createCharacter
} from "./character.js";

import {
    CharacterAnimation
} from "./characterAnimation.js";

import {
    equip,
    getEquipment
} from "./equipment.js";
import {
    showToast
} from "./ui.js";

import {
    startTutorial,
    shouldShowTutorial
} from "./tutorial.js";

import {
    initMobileControls
} from "./mobileControls.js";

import {
    getWorld
} from "./worldMap.js";

import {
    loadV7Settings
} from "./settingsV7.js";
import {
    updatePlayerAnimation
} from "./animation.js";

import {
    updateTargetAI
} from "./targetAI.js";

import {
    calculateCritical
} from "./critical.js";

import {
    unlockAchievement
} from "./achievements.js";

import {
    recordShot,
    recordHit,
    recordMiss,
    recordBullseye,
    recordCritical,
    updateHighestScore,
    updateHighestCombo
} from "./stats.js";

import {
    addMaterial,
    addArrow
} from "./inventory.js";

import {
    loadSettings
} from "./settings.js";
import { createMap }
    from "./maps.js";

import {
    createMovingTarget,
    updateMovingTarget,
    calculateTargetScore
} from "./targets.js";

import {
    updateMission
} from "./missions.js";

import {
    claimDaily,
    canClaimDaily,
    getNextReward
} from "./rewards.js";

import {
    shootSound,
    hitSound,
    bullseyeSound,
    missSound,
    coinSound,
    levelSound
} from "./audio.js";

import {
    hitEffect
} from "./effects.js";

import {
    createPlayer
} from "./player.js";
import * as THREE from "three";


/* =========================================================
   STORAGE
========================================================= */

const SAVE_KEY = "archery3d_v3";

function defaultSave() {
    return {
        highScore: 0,
        totalCoins: 0,

        selectedBow: "wood",
        selectedArrow: "normal",

        ownedBows: ["wood"],
        ownedArrows: ["normal"],

        bowLevels: {
            wood: 1,
            steel: 0,
            gold: 0,
            legendary: 0
        },

        arrowLevels: {
            normal: 1,
            fire: 0,
            ice: 0,
            lightning: 0
        },

        bestCombo: 0,
        totalBullseyes: 0,
        totalShots: 0,
        totalHits: 0,

        games: [],
        achievements: {}
    };
}


function loadSave() {

    try {

        const saved =
            JSON.parse(
                localStorage.getItem(
                    SAVE_KEY
                )
            );

        return {
            ...defaultSave(),
            ...saved
        };

    } catch {

        return defaultSave();
    }
}


let save =
    loadSave();


function saveGame() {

    localStorage.setItem(
        SAVE_KEY,
        JSON.stringify(save)
    );
}


/* =========================================================
   GAME STATE
========================================================= */

const MAX_LIVES = 3;

let score = 0;

let coinsThisGame = 0;

let lives = MAX_LIVES;

let combo = 0;

let level = 1;

let arrowsLeft = 10;

let power = 0;

let aiming = false;

let flying = false;

let gameRunning = false;

let pointerStartX = 0;

let pointerStartY = 0;

let cameraYaw = 0;

let cameraPitch = 0;

let currentWind = 0;

let arrow = null;

let arrowVelocity =
    new THREE.Vector3();

let target;

let bow;

let clock =
    new THREE.Clock();


/* =========================================================
   DOM
========================================================= */

const game =
    document.getElementById(
        "game"
    );

const menu =
    document.getElementById(
        "menu"
    );

const gameOver =
    document.getElementById(
        "gameOver"
    );

const historyPanel =
    document.getElementById(
        "historyPanel"
    );

const achievementPanel =
    document.getElementById(
        "achievementPanel"
    );

const scoreText =
    document.getElementById(
        "score"
    );

const coinsText =
    document.getElementById(
        "coins"
    );

const livesText =
    document.getElementById(
        "lives"
    );

const comboText =
    document.getElementById(
        "combo"
    );

const levelText =
    document.getElementById(
        "level"
    );

const windText =
    document.getElementById(
        "windValue"
    );

const power =
    document.getElementById(
        "power"
    );

const powerFill =
    document.getElementById(
        "powerFill"
    );

const message =
    document.getElementById(
        "message"
    );

const restartButton =
    document.getElementById(
        "restartButton"
    );

const menuButton =
    document.getElementById(
        "menuButton"
    );

const startButton =
    document.getElementById(
        "startButton"
    );

const historyButton =
    document.getElementById(
        "historyButton"
    );

const achievementButton =
    document.getElementById(
        "achievementButton"
    );

const historyList =
    document.getElementById(
        "historyList"
    );

const achievementList =
    document.getElementById(
        "achievementList"
    );

const finalScore =
    document.getElementById(
        "finalScore"
    );

const finalCoins =
    document.getElementById(
        "finalCoins"
    );

const finalHighScore =
    document.getElementById(
        "finalHighScore"
    );


/* =========================================================
   THREE SCENE
========================================================= */

const scene =
    new THREE.Scene();

scene.background =
    new THREE.Color(
        0x79c9ed
    );


/* =========================================================
   CAMERA
========================================================= */

const camera =
    new THREE.PerspectiveCamera(
        65,

        window.innerWidth /
        window.innerHeight,

        0.1,

        1000
    );

camera.position.set(
    0,
    2.2,
    7
);


/* =========================================================
   RENDERER
========================================================= */

const renderer =
    new THREE.WebGLRenderer({
        antialias: true
    });

renderer.setPixelRatio(
    Math.min(
        window.devicePixelRatio,
        2
    )
);

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.shadowMap.enabled =
    true;

game.appendChild(
    renderer.domElement
);


/* =========================================================
   LIGHTING
========================================================= */

const ambient =
    new THREE.HemisphereLight(
        0xffffff,
        0x446644,
        1.8
    );

scene.add(
    ambient
);


const sun =
    new THREE.DirectionalLight(
        0xffffff,
        2
    );

sun.position.set(
    10,
    20,
    10
);

sun.castShadow =
    true;

scene.add(
    sun
);


/* =========================================================
   GROUND
========================================================= */

const ground =
    new THREE.Mesh(

        new THREE.PlaneGeometry(
            120,
            120
        ),

        new THREE.MeshStandardMaterial({
            color: 0x4f9149
        })
    );

ground.rotation.x =
    -Math.PI / 2;

ground.receiveShadow =
    true;

scene.add(
    ground
);


/* =========================================================
   PATH
========================================================= */

const path =
    new THREE.Mesh(

        new THREE.PlaneGeometry(
            8,
            70
        ),

        new THREE.MeshStandardMaterial({
            color: 0xb89568
        })
    );

path.rotation.x =
    -Math.PI / 2;

path.position.z =
    -15;

path.position.y =
    .01;

scene.add(
    path
);


/* =========================================================
   TREES
========================================================= */

function createTree(
    x,
    z,
    scale = 1
) {

    const tree =
        new THREE.Group();


    const trunk =
        new THREE.Mesh(

            new THREE.CylinderGeometry(
                .22,
                .35,
                2.4,
                8
            ),

            new THREE.MeshStandardMaterial({
                color: 0x68421f
            })
        );

    trunk.position.y =
        1.2;

    trunk.castShadow =
        true;

    tree.add(
        trunk
    );


    const leaves =
        new THREE.Mesh(

            new THREE.ConeGeometry(
                1.5,
                3.5,
                8
            ),

            new THREE.MeshStandardMaterial({
                color: 0x176b35
            })
        );

    leaves.position.y =
        3.5;

    leaves.castShadow =
        true;

    tree.add(
        leaves
    );


    tree.position.set(
        x,
        0,
        z
    );

    tree.scale.setScalar(
        scale
    );

    scene.add(
        tree
    );
}


createTree(
    -7,
    -7
);

createTree(
    7,
    -10
);

createTree(
    -9,
    -17,
    1.2
);

createTree(
    9,
    -20,
    1.1
);

createTree(
    -8,
    -30
);

createTree(
    8,
    -35
);


/* =========================================================
   TARGET
========================================================= */

function createTarget() {

    const group =
        new THREE.Group();


    const pole =
        new THREE.Mesh(

            new THREE.CylinderGeometry(
                .08,
                .1,
                5,
                12
            ),

            new THREE.MeshStandardMaterial({
                color: 0x59391e
            })
        );

    pole.position.y =
        2.5;

    pole.castShadow =
        true;

    group.add(
        pole
    );


    const rings = [

        {
            radius: 2.1,
            color: 0xffffff
        },

        {
            radius: 1.65,
            color: 0x111111
        },

        {
            radius: 1.2,
            color: 0x2577c7
        },

        {
            radius: .75,
            color: 0xd62828
        },

        {
            radius: .35,
            color: 0xffd000
        }

    ];


    rings.forEach(
        (ring, index) => {

            const disc =
                new THREE.Mesh(

                    new THREE.CylinderGeometry(
                        ring.radius,
                        ring.radius,
                        .14,
                        48
                    ),

                    new THREE.MeshStandardMaterial({
                        color:
                            ring.color
                    })
                );

            disc.rotation.x =
                Math.PI / 2;

            disc.position.z =
                index * .04;

            disc.castShadow =
                true;

            group.add(
                disc
            );
        }
    );


    group.position.set(
        0,
        0,
        -25
    );

    scene.add(
        group
    );

    return group;
}


target =
    createTarget();


/* =========================================================
   BOW
========================================================= */

function createBow() {

    const group =
        new THREE.Group();


    const material =
        new THREE.MeshStandardMaterial({
            color: 0x6f3516
        });


    const upper =
        new THREE.Mesh(

            new THREE.CylinderGeometry(
                .07,
                .11,
                2.7,
                12
            ),

            material
        );

    upper.rotation.z =
        -.32;

    upper.position.y =
        1;

    group.add(
        upper
    );


    const lower =
        new THREE.Mesh(

            new THREE.CylinderGeometry(
                .07,
                .11,
                2.7,
                12
            ),

            material
        );

    lower.rotation.z =
        .32;

    lower.position.y =
        -1;

    group.add(
        lower
    );


    const grip =
        new THREE.Mesh(

            new THREE.CylinderGeometry(
                .12,
                .12,
                .8,
                12
            ),

            new THREE.MeshStandardMaterial({
                color: 0x222222
            })
        );

    group.add(
        grip
    );


    group.position.set(
        -1.6,
        2,
        5.5
    );


    scene.add(
        group
    );

    return group;
}


bow =
    createBow();


/* =========================================================
   ARROW
========================================================= */

function createArrow() {

    const group =
        new THREE.Group();


    const shaft =
        new THREE.Mesh(

            new THREE.CylinderGeometry(
                .025,
                .025,
                2.6,
                8
            ),

            new THREE.MeshStandardMaterial({
                color: 0x6b431f
            })
        );

    shaft.rotation.z =
        Math.PI / 2;

    group.add(
        shaft
    );


    const head =
        new THREE.Mesh(

            new THREE.ConeGeometry(
                .13,
                .38,
                8
            ),

            new THREE.MeshStandardMaterial({
                color: 0xbfc4c9,
                metalness: .8,
                roughness: .2
            })
        );

    head.rotation.z =
        -Math.PI / 2;

    head.position.x =
        1.48;

    group.add(
        head
    );


    const feather =
        new THREE.Mesh(

            new THREE.BoxGeometry(
                .35,
                .13,
                .05
            ),

            new THREE.MeshStandardMaterial({
                color: 0xffffff
            })
        );

    feather.position.x =
        -1.15;

    group.add(
        feather
    );


    return group;
}


function resetArrow() {

    if (arrow) {

        scene.remove(
            arrow
        );
    }


    arrow =
        createArrow();


    arrow.position.set(
        0,
        2,
        5
    );


    scene.add(
        arrow
    );
}


/* =========================================================
   GAME START
========================================================= */

function startGame() {

    score = 0;

    coinsThisGame = 0;

    lives = MAX_LIVES;

    combo = 0;

    level = 1;

    arrowsLeft = 10;

    flying = false;

    aiming = false;

    gameRunning = true;


    updateHUD();

    updateWind();

    resetArrow();


    menu.style.display =
        "none";

    gameOver.style.display =
        "none";

    historyPanel.style.display =
        "none";

    achievementPanel.style.display =
        "none";


    message.textContent =
        "Kéo để ngắm — thả để bắn";
}


/* =========================================================
   HUD
========================================================= */

function updateHUD() {

    scoreText.textContent =
        score;

    coinsText.textContent =
        coinsThisGame;

    livesText.textContent =
        lives;

    comboText.textContent =
        combo;

    levelText.textContent =
        level;
}


/* =========================================================
   WIND
========================================================= */

function updateWind() {

    const strength =
        Math.min(
            .08 + level * .025,
            .35
        );


    currentWind =
        (Math.random() * 2 - 1) *
        strength;


    const rounded =
        Math.round(
            currentWind * 100
        );


    if (rounded > 0) {

        windText.textContent =
            `+${rounded}`;

    } else {

        windText.textContent =
            rounded;
    }
}


/* =========================================================
   AIM
========================================================= */

function updateAim(
    x,
    y
) {

    const dx =
        x - pointerStartX;

    const dy =
        y - pointerStartY;


    cameraYaw =
        THREE.MathUtils.clamp(
            -dx * .003,
            -.75,
            .75
        );


    cameraPitch =
        THREE.MathUtils.clamp(
            dy * .0025,
            -.5,
            .5
        );


    power =
        THREE.MathUtils.clamp(

            Math.sqrt(
                dx * dx +
                dy * dy
            ) / 220,

            0,

            1
        );


    powerFill.style.width =
        `${power * 100}%`;


    bow.rotation.y =
        cameraYaw;

    bow.rotation.x =
        cameraPitch;
}


/* =========================================================
   SHOOT
========================================================= */

function shoot() {

    if (
        !gameRunning ||
        flying ||
        arrowsLeft <= 0
    ) {
        return;
    }


    flying = true;


    arrowsLeft--;


    save.totalShots++;


    const direction =
        new THREE.Vector3(
            cameraYaw * .9,
            cameraPitch,
            -1
        ).normalize();


    const speed =
        18 +
        power * 42;


    arrowVelocity =
        direction.multiplyScalar(
            speed
        );


    arrow.position.set(
        0,
        2,
        5
    );


    message.textContent =
        "🏹 BẮN!";


    powerBar.style.opacity =
        0;
}


/* =========================================================
   ARROW PHYSICS
========================================================= */

function updateArrow(
    delta
) {

    if (
        !flying
    ) {
        return;
    }


    arrowVelocity.y -=
        9.8 * delta;


    arrowVelocity.x +=
        currentWind * 20 *
        delta;


    arrow.position.add(

        arrowVelocity
            .clone()
            .multiplyScalar(
                delta
            )
    );


    const direction =
        arrowVelocity
            .clone()
            .normalize();


    const quaternion =
        new THREE.Quaternion();


    quaternion.setFromUnitVectors(

        new THREE.Vector3(
            1,
            0,
            0
        ),

        direction
    );


    arrow.quaternion.copy(
        quaternion
    );


    checkTargetCollision();


    if (
        arrow.position.y < 0
    ) {

        missShot();

        return;
    }


    if (
        arrow.position.z < -38
    ) {

        missShot();
    }
}


/* =========================================================
   TARGET COLLISION
========================================================= */

function checkTargetCollision() {

    const distanceZ =
        Math.abs(
            arrow.position.z -
            target.position.z
        );


    if (
        distanceZ > .65
    ) {
        return;
    }


    const local =
        target.worldToLocal(
            arrow.position.clone()
        );


    const distance =
        Math.sqrt(
            local.x * local.x +
            local.y * local.y
        );


    if (
        distance > 2.15
    ) {
        return;
    }


    hitTarget(
        distance
    );
}


/* =========================================================
   HIT
========================================================= */

function hitTarget(
    distance
) {

    flying = false;

    save.totalHits++;


    let points = 10;

    let reward = 2;


    if (
        distance <= .35
    ) {

        points = 100;

        reward = 20;

        combo++;

        save.totalBullseyes++;

        message.textContent =
            "🎯 PERFECT! +100";

    } else if (
        distance <= .75
    ) {

        points = 75;

        reward = 12;

        combo++;

        message.textContent =
            "🔥 GREAT! +75";

    } else if (
        distance <= 1.2
    ) {

        points = 50;

        reward = 8;

        combo++;

        message.textContent =
            "🎯 +50";

    } else if (
        distance <= 1.65
    ) {

        points = 25;

        reward = 5;

        combo++;

        message.textContent =
            "🎯 +25";

    } else {

        points = 10;

        reward = 2;

        combo++;

        message.textContent =
            "🎯 +10";
    }


    if (
        combo > 1
    ) {

        points *=
            Math.min(
                combo,
                5
            );
    }


    score += points;

    coinsThisGame +=
        reward;


    save.bestCombo =
        Math.max(
            save.bestCombo,
            combo
        );


    checkAchievements();


    updateHUD();


    levelCheck();


    setTimeout(
        nextShot,
        850
    );
}


/* =========================================================
   MISS
========================================================= */

function missShot() {

    if (!flying) {
        return;
    }


    flying = false;


    lives--;

    combo = 0;


    message.textContent =
        "❌ Trượt!";


    updateHUD();


    if (
        lives <= 0
    ) {

        setTimeout(
            endGame,
            600
        );

        return;
    }


    setTimeout(
        nextShot,
        650
    );
}


/* =========================================================
   NEXT SHOT
========================================================= */

function nextShot() {

    if (
        !gameRunning
    ) {
        return;
    }


    resetArrow();

    updateWind();


    message.textContent =
        "Kéo để ngắm — thả để bắn";
}


/* =========================================================
   LEVEL
========================================================= */

function levelCheck() {

    const newLevel =
        Math.floor(
            score / 500
        ) + 1;


    if (
        newLevel > level
    ) {

        level =
            newLevel;


        message.textContent =
            `🚀 LEVEL ${level}!`;


        updateWind();


        target.position.z =
            -(
                25 +
                Math.min(
                    level * 2,
                    18
                )
            );


        updateHUD();
    }
}


/* =========================================================
   END GAME
========================================================= */

function endGame() {

    gameRunning = false;

    flying = false;


    if (
        score >
        save.highScore
    ) {

        save.highScore =
            score;
    }


    save.totalCoins +=
        coinsThisGame;


    save.games.unshift({

        score,

        coins:
            coinsThisGame,

        level,

        date:
            new Date()
                .toLocaleString(
                    "vi-VN"
                )

    });


    save.games =
        save.games.slice(
            0,
            10
        );


    checkAchievements();

    saveGame();


    finalScore.textContent =
        score;

    finalCoins.textContent =
        coinsThisGame;

    finalHighScore.textContent =
        save.highScore;


    gameOver.style.display =
        "flex";
}


/* =========================================================
   ACHIEVEMENTS
========================================================= */

const achievements = [

    {
        id: "first",
        icon: "🎯",
        name: "Phát bắn đầu tiên",
        description:
            "Bắn 1 mũi tên",
        check:
            () =>
                save.totalShots >= 1
    },

    {
        id: "bullseye",
        icon: "🎯",
        name: "Bullseye",
        description:
            "Bắn trúng tâm 1 lần",
        check:
            () =>
                save.totalBullseyes >= 1
    },

    {
        id: "combo5",
        icon: "🔥",
        name: "Combo Master",
        description:
            "Đạt combo x5",
        check:
            () =>
                save.bestCombo >= 5
    },

    {
        id: "score1000",
        icon: "🏆",
        name: "Cao thủ",
        description:
            "Đạt 1.000 điểm",
        check:
            () =>
                save.highScore >= 1000
    },

    {
        id: "shots50",
        icon: "🏹",
        name: "Cung thủ",
        description:
            "Bắn 50 mũi tên",
        check:
            () =>
                save.totalShots >= 50
    },

    {
        id: "bullseye10",
        icon: "👑",
        name: "Master Archer",
        description:
            "Bullseye 10 lần",
        check:
            () =>
                save.totalBullseyes >= 10
    }

];


function checkAchievements() {

    achievements.forEach(
        achievement => {

            if (
                !save.achievements[
                    achievement.id
                ] &&
                achievement.check()
            ) {

                save.achievements[
                    achievement.id
                ] = true;
            }
        }
    );


    saveGame();
}


/* =========================================================
   SHOW ACHIEVEMENTS
========================================================= */

function showAchievements() {

    achievementList.innerHTML =
        "";


    achievements.forEach(
        achievement => {

            const unlocked =
                !!save.achievements[
                    achievement.id
                ];


            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "achievement " +
                (
                    unlocked
                        ? ""
                        : "locked"
                );


            item.innerHTML = `

                <div
                    style="
                    font-size:28px"
                    >
                    ${achievement.icon}
                </div>

                <div>

                    <strong>
                        ${achievement.name}
                    </strong>

                    <br>

                    <small>
                        ${achievement.description}
                    </small>

                </div>

            `;


            achievementList.appendChild(
                item
            );
        }
    );


    achievementPanel.style.display =
        "block";
}


/* =========================================================
   HISTORY
========================================================= */

function showHistory() {

    historyList.innerHTML =
        "";


    if (
        save.games.length === 0
    ) {

        historyList.innerHTML =
            "<p>Chưa có trận đấu.</p>";

    } else {

        save.games.forEach(
            gameData => {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "history-item";


                item.innerHTML = `

                    <span>
                        ${gameData.date}
                    </span>

                    <span>
                        🎯 ${gameData.score}
                    </span>

                    <span>
                        LV ${gameData.level}
                    </span>

                `;


                historyList.appendChild(
                    item
                );
            }
        );
    }


    historyPanel.style.display =
        "block";
}


/* =========================================================
   BUTTONS
========================================================= */

startButton.addEventListener(
    "click",
    startGame
);


restartButton.addEventListener(
    "click",
    startGame
);


menuButton.addEventListener(
    "click",
    () => {

        gameOver.style.display =
            "none";

        menu.style.display =
            "flex";

    }
);


historyButton.addEventListener(
    "click",
    showHistory
);


achievementButton.addEventListener(
    "click",
    showAchievements
);


document
    .querySelectorAll(
        ".closeButton"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    historyPanel
                        .style
                        .display =
                        "none";

                    achievementPanel
                        .style
                        .display =
                        "none";
                }
            );
        }
    );


/* =========================================================
   POINTER CONTROLS
========================================================= */

renderer.domElement.addEventListener(
    "pointerdown",
    event => {

        if (
            !gameRunning ||
            flying ||
            arrowsLeft <= 0
        ) {
            return;
        }


        aiming = true;


        pointerStartX =
            event.clientX;

        pointerStartY =
            event.clientY;


        power = 0;

document
    .getElementById("power")
    .style.opacity = "1";


        document
            .getElementById(
                "power"
            )
            .style.opacity =
            "1";


        try {

            renderer.domElement
                .setPointerCapture(
                    event.pointerId
                );

        } catch {}
    }
);


renderer.domElement.addEventListener(
    "pointermove",
    event => {

        if (!aiming) {
            return;
        }


        updateAim(
            event.clientX,
            event.clientY
        );
    }
);


renderer.domElement.addEventListener(
    "pointerup",
    event => {

        if (!aiming) {
            return;
        }


        aiming = false;


        shoot();
    }
);


renderer.domElement.addEventListener(
    "pointercancel",
    () => {

        aiming = false;

        document
            .getElementById(
                "power"
            )
            .style.opacity =
            "0";
    }
);


/* =========================================================
   CAMERA
========================================================= */

function updateCamera() {

    const targetPosition =
        new THREE.Vector3(

            cameraYaw * 3,

            2 +
            cameraPitch * 2,

            -10

        );


    camera.lookAt(
        targetPosition
    );
}


/* =========================================================
   RESIZE
========================================================= */

window.addEventListener(
    "resize",
    () => {

        camera.aspect =
            window.innerWidth /
            window.innerHeight;


        camera.updateProjectionMatrix();


        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );
    }
);


/* =========================================================
   ANIMATION
========================================================= */

function animate() {

    requestAnimationFrame(
        animate
    );


    const delta =
        Math.min(
            clock.getDelta(),
            .05
        );


    updateArrow(
        delta
    );


    updateCamera();


    renderer.render(
        scene,
        camera
    );
}


animate();


/* =========================================================
   INITIAL STATE
========================================================= */

updateHUD();

menu.style.display =
    "flex";

gameOver.style.display =
    "none";

historyPanel.style.display =
    "none";

achievementPanel.style.display =
    "none";