import { supabase } from "./supabase.js";

export async function submitScore(
    score,
    combo,
    level
) {

    const {
        data: {
            user
        }
    } =
        await supabase.auth.getUser();

    if (!user) return false;

    const { error } =
        await supabase
            .from("leaderboard")
            .upsert({
                user_id: user.id,
                score: Math.floor(score),
                combo: Math.floor(combo),
                level: Math.floor(level),
                updated_at:
                    new Date().toISOString()
            }, {
                onConflict: "user_id"
            });

    return !error;
}

export async function getLeaderboard(
    limit = 50
) {

    const {
        data,
        error
    } =
        await supabase
            .from("leaderboard")
            .select(`
                user_id,
                score,
                combo,
                level,
                updated_at
            `)
            .order(
                "score",
                {
                    ascending: false
                }
            )
            .limit(limit);

    if (error) return [];

    return data;
}