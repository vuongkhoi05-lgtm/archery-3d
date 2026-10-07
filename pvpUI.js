import {
    submitPvPScore,
    getPvPScores
} from "./pvpScore.js";
import {
    createRoom,
    joinRoom,
    getRoom,
    leaveRoom
} from "./pvp.js";

import {
    getPvPScores
} from "./pvpScore.js";

import {
    watchRoom,
    stopWatching
} from "./pvpRealtime.js";

let currentRoom = null;
let realtimeChannel = null;

export function createPvPUI() {
    const box = document.createElement("div");

    box.id = "pvp-panel";

    box.innerHTML = `
        <div class="pvp-box">

            <h2>🏹 PvP Online</h2>

            <button id="pvp-create">
                🎮 Tạo phòng
            </button>

            <div class="pvp-divider">
                hoặc
            </div>

            <input
                id="pvp-code"
                maxlength="6"
                placeholder="Nhập mã phòng"
            >

            <button id="pvp-join">
                🔗 Tham gia
            </button>

            <div id="pvp-status">
                Chưa tham gia phòng
            </div>

            <div id="pvp-room"></div>

            <div id="pvp-score">
                <div>👤 Bạn: <span id="my-score">0</span></div>
                <div>⚔️ Đối thủ: <span id="enemy-score">0</span></div>
            </div>

            <button
                id="pvp-leave"
                style="display:none"
            >
                🚪 Rời phòng
            </button>

        </div>
    `;

    document.body.appendChild(box);

    document
        .getElementById("pvp-create")
        .addEventListener(
            "click",
            handleCreateRoom
        );

    document
        .getElementById("pvp-join")
        .addEventListener(
            "click",
            handleJoinRoom
        );

    document
        .getElementById("pvp-leave")
        .addEventListener(
            "click",
            handleLeaveRoom
        );
}

async function handleCreateRoom() {
    setStatus("Đang tạo phòng...");

    const result =
        await createRoom();

    if (!result.ok) {
        setStatus(result.message);
        return;
    }

    currentRoom = result.room;

    showRoom(currentRoom);

    realtimeChannel =
        watchRoom(
            currentRoom.id,
            handleRealtime
        );

    setStatus(
        "⏳ Đang chờ đối thủ..."
    );
}

async function handleJoinRoom() {
    const input =
        document.getElementById(
            "pvp-code"
        );

    const code =
        input.value.trim();

    if (!code) {
        setStatus(
            "Hãy nhập mã phòng."
        );
        return;
    }

    setStatus(
        "Đang tham gia..."
    );

    const result =
        await joinRoom(code);

    if (!result.ok) {
        setStatus(result.message);
        return;
    }

    currentRoom = result.room;

    showRoom(currentRoom);

    realtimeChannel =
        watchRoom(
            currentRoom.id,
            handleRealtime
        );

    setStatus(
        "⚔️ Đã vào trận!"
    );
}

async function handleLeaveRoom() {
    if (!currentRoom) return;

    await leaveRoom(
        currentRoom.id
    );

    if (realtimeChannel) {
        await stopWatching(
            realtimeChannel
        );
    }

    currentRoom = null;
    realtimeChannel = null;

    document
        .getElementById("pvp-leave")
        .style.display = "none";

    document
        .getElementById("pvp-room")
        .textContent = "";

    setStatus(
        "Đã rời phòng."
    );
}

async function handleRealtime(
    type,
    payload
) {
    if (type === "room") {
        const room =
            payload.new;

        if (!room) return;

        currentRoom = room;

        showRoom(room);

        if (
            room.status ===
            "playing"
        ) {
            setStatus(
                "⚔️ Trận PvP bắt đầu!"
            );
        }
    }

    async function updateScores() {
    if (!currentRoom) return;

    const scores =
        await getPvPScores(
            currentRoom.id
        );

    const myScore =
        document.getElementById(
            "my-score"
        );

    const enemyScore =
        document.getElementById(
            "enemy-score"
        );

    if (!myScore || !enemyScore)
        return;

    const mine =
        scores.find(
            item => item.isMe
        );

    const enemy =
        scores.find(
            item => !item.isMe
        );

    myScore.textContent =
        mine?.score || 0;

    enemyScore.textContent =
        enemy?.score || 0;
}
    }


async function updateScores() {
    if (!currentRoom) return;

    const scores =
        await getPvPScores(
            currentRoom.id
        );

    const myScore =
        document.getElementById(
            "my-score"
        );

    const enemyScore =
        document.getElementById(
            "enemy-score"
        );

    if (!myScore || !enemyScore)
        return;

    const values =
        scores.map(
            item => item.score
        );

    myScore.textContent =
        values[0] || 0;

    enemyScore.textContent =
        values[1] || 0;
}

function showRoom(room) {
    const roomElement =
        document.getElementById(
            "pvp-room"
        );

    if (!roomElement) return;

    roomElement.innerHTML = `
        <div class="room-code">
            MÃ PHÒNG
            <strong>
                ${room.room_code}
            </strong>
        </div>

        <div>
            Trạng thái:
            ${room.status}
        </div>
    `;

    document
        .getElementById("pvp-leave")
        .style.display = "block";
}

function setStatus(message) {
    const element =
        document.getElementById(
            "pvp-status"
        );

    if (element) {
        element.textContent =
            message;
    }
}