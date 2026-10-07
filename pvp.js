import { supabase } from "./supabase.js";

export async function createRoom() {
    const {
        data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
        return {
            ok: false,
            message: "Bạn chưa đăng nhập."
        };
    }

    const roomCode =
        Math.random()
            .toString(36)
            .substring(2, 8)
            .toUpperCase();

    const { data, error } =
        await supabase
            .from("pvp_rooms")
            .insert({
                room_code: roomCode,
                host_id: user.id,
                status: "waiting"
            })
            .select()
            .single();

    if (error) {
        console.error(error);

        return {
            ok: false,
            message: error.message
        };
    }

    return {
        ok: true,
        room: data
    };
}

export async function joinRoom(roomCode) {
    const {
        data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
        return {
            ok: false,
            message: "Bạn chưa đăng nhập."
        };
    }

    const { data: room, error } =
        await supabase
            .from("pvp_rooms")
            .select("*")
            .eq("room_code", roomCode.toUpperCase())
            .eq("status", "waiting")
            .maybeSingle();

    if (error || !room) {
        return {
            ok: false,
            message: "Không tìm thấy phòng."
        };
    }

    if (room.host_id === user.id) {
        return {
            ok: false,
            message: "Bạn đã là chủ phòng."
        };
    }

    const { data, error: updateError } =
        await supabase
            .from("pvp_rooms")
            .update({
                guest_id: user.id,
                status: "playing"
            })
            .eq("id", room.id)
            .select()
            .single();

    if (updateError) {
        return {
            ok: false,
            message: updateError.message
        };
    }

    return {
        ok: true,
        room: data
    };
}

export async function getRoom(roomId) {
    const { data, error } =
        await supabase
            .from("pvp_rooms")
            .select("*")
            .eq("id", roomId)
            .maybeSingle();

    if (error) return null;

    return data;
}

export async function leaveRoom(roomId) {
    const {
        data: { user }
    } = await supabase.auth.getUser();

    if (!user) return false;

    const { error } =
        await supabase
            .from("pvp_rooms")
            .delete()
            .eq("id", roomId)
            .or(
                `host_id.eq.${user.id},guest_id.eq.${user.id}`
            );

    return !error;
}