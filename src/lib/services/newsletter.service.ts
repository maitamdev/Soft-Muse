import { createClient } from "@/lib/supabase/client";

export const NewsletterService = {
  async subscribe(email: string): Promise<void> {
    const { error } = await createClient().rpc("subscribe_newsletter", { subscriber_email: email.trim().toLowerCase() });
    if (error) throw new Error(error.message);
  },
};
