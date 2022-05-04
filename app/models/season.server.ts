import type { Season } from '@prisma/client';
import supabase from '~/lib/supabase.server';

export async function getSeason(name: string) {
  const { data, error } = await supabase.from('Season').select('*').eq('name', name).single();

  if (!error) {
    return data as Season;
  }

  return null;
}

// export async function createNote({
//   title,
//   body,
//   userId,
// }: Pick<Note, "body" | "title"> & { userId: User["id"] }) {
//   const { data, error } = await supabase
//     .from("notes")
//     .insert([{ title, body, profile_id: userId }])
//     .single();

//   if (!error) {
//     return data;
//   }

//   return null;
// }
