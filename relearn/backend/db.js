import { supabase } from "./supabase.js";

export async function createProfile(userId, username) {
  const { error } = await supabase
    .from("profiles")
    .insert([{ id: userId, username }]);

  if (error) {
    console.error(error);
  }
}