import { supabase } from "./supabase.js";

export async function register(email, password) {

    const { data, error } =
        await supabase.auth.signUp({
            email,
            password
        });

    if (error) {
        return {
            ok: false,
            message: error.message
        };
    }

    return {
        ok: true,
        data
    };
}

export async function login(email, password) {

    const { data, error } =
        await supabase.auth.signInWithPassword({
            email,
            password
        });

    if (error) {
        return {
            ok: false,
            message: error.message
        };
    }

    return {
        ok: true,
        data
    };
}

export async function logout() {

    const { error } =
        await supabase.auth.signOut();

    return {
        ok: !error,
        message: error?.message || ""
    };
}

export async function getUser() {

    const {
        data,
        error
    } = await supabase.auth.getUser();

    if (error) return null;

    return data.user;
}

export function onAuthChange(callback) {

    return supabase.auth.onAuthStateChange(
        (event, session) => {
            callback(event, session);
        }
    );
}