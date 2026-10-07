import { supabase } from "./supabase.js";

export function watchRoom(
    roomId,
    callback
) {
    const channel =
        supabase
            .channel(`pvp-room-${roomId}`)
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "pvp_rooms",
                    filter: `id=eq.${roomId}`
                },
                payload => {
                    callback(
                        "room",
                        payload
                    );
                }
            )
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "pvp_scores",
                    filter: `room_id=eq.${roomId}`
                },
                payload => {
                    callback(
                        "score",
                        payload
                    );
                }
            )
            .subscribe();

    return channel;
}

export async function stopWatching(channel) {
    if (!channel) return;

    await supabase.removeChannel(
        channel
    );
}