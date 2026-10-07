import { supabase } from "./supabase.js";

export async function saveCloud(save) {

    const user = await getUser();

    if (!user) return false;

    const { error } =
        await supabase
            .from("player_saves")
            .upsert({
                user_id: user.id,
                save_data: save,
                updated_at:
                    new Date().toISOString()
            }, {
                onConflict: "user_id"
            });

    return !error;
}

export async function loadCloud() {

    const user = await getUser();

    if (!user) return null;

    const {
        data,
        error
    } =
        await supabase
            .from("player_saves")
            .select("save_data")
            .eq("user_id", user.id)
            .maybeSingle();

    if (error) return null;

    return data?.save_data || null;
}

async function getUser() {

    const {
        data
    } =
        await supabase.auth.getUser();

    return data.user;
}