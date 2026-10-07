import { supabase } from "./supabase.js";

export async function submitPvPScore(roomId, score) {
    const {
        data: { user }
    } = await supabase.auth.getUser();

    if (!user || !roomId) return false;

    const { error } =
        await supabase
            .from("pvp_scores")
            .upsert(
                {
                    room_id: roomId,
                    user_id: user.id,
                    score: Math.floor(score),
                    updated_at:
                        new Date().toISOString()
                },
                {
                    onConflict: "room_id,user_id"
                }
            );

    if (error) {
        console.error(
            "PvP score error:",
            error
        );

        return false;
    }

    return true;
}

export async function getPvPScores(roomId) {
    const {
        data: { user }
    } = await supabase.auth.getUser();

    if (!roomId) return [];

    const { data, error } =
        await supabase
            .from("pvp_scores")
            .select(
                "user_id, score, updated_at"
            )
            .eq("room_id", roomId)
            .order("score", {
                ascending: false
            });

    if (error) {
        console.error(error);
        return [];
    }

    return data.map(item => ({
        ...item,
        isMe:
            item.user_id === user?.id
    }));
}