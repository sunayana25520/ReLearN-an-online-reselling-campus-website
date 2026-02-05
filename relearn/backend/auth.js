import { supabase } from "./supabase.js";

export async function signupUser({
  email,
  password,
  fullname,
  regno,
  department,
  semester
}) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) throw error;

  // Save extra profile data
  const { error: profileError } = await supabase
    .from("profiles")
    .insert({
      id: data.user.id,
      fullname,
      regno,
      department,
      semester
    });

  if (profileError) throw profileError;

  return data;
}

export async function loginUser(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;
  return data;
}