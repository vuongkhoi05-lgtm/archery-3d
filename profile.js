import { supabase } from "./supabase.js";

export async function createProfile(
    username
) {

    const {
        data: {
            user
        }
    } =
        await supabase.auth.getUser();

    if (!user) return null;

    const { data, error } =
        await supabase
            .from("profiles")
            .upsert({
                id: user.id,

                username:
                    username ||
                    `Player_${user.id.slice(0, 6)}`,

                avatar: "🏹",

                updated_at:
                    new Date().toISOString()
            }, {
                onConflict: "id"
            })
            .select()
            .single();

    if (error) return null;

    return data;
}

export async function getProfile() {

    const {
        data: {
            user
        }
    } =
        await supabase.auth.getUser();

    if (!user) return null;

    const { data } =
        await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .maybeSingle();

    return data || null;
}

export async function updateProfile(
    username,
    avatar
) {

    const {
        data: {
            user
        }
    } =
        await supabase.auth.getUser();

    if (!user) return null;

    const { data, error } =
        await supabase
            .from("profiles")
            .update({
                username,
                avatar,
                updated_at:
                    new Date().toISOString()
            })
            .eq("id", user.id)
            .select()
            .single();

    if (error) return null;

    return data;
}