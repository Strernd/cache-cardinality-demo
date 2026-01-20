"use server";

import { revalidateTag, updateTag } from "next/cache";

export async function revalidateTagAction(tag: string) {
  revalidateTag(tag, "max");
  return { message: `revalidateTag("${tag}", "max")` };
}

export async function updateTagAction(tag: string) {
  updateTag(tag);
  return { message: `updateTag("${tag}")` };
}
