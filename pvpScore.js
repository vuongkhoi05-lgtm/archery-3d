import { supabase } from "./supabase.js";

export async function submitPvPScore(
    roomId,
    score
) {
    const {
        data: { user }
    } = await supabase.auth.getUser();

    if (!user) return false;

    const { error } =
        await supabase
            .from("pvp_scores")
            .upsert({
                room_id: roomId,
                user_id: user.id,
                score: Math.floor(score),
                updated_at:
                    new Date().toISOString()
            }, {
                onConflict: "room_id,user_id"
            });

    return !error;
}

export async function getPvPScores(roomId) {
    const { data, error } =
        await supabase
            .from("pvp_scores")
            .select("*")
            .eq("room_id", roomId)
            .order("score", {
                ascending: false
            });

    if (error) return [];

    return data;
}