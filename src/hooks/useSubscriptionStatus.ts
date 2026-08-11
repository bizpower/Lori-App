import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export interface SubscriptionStatus {
  loading: boolean;
  subscribed: boolean;
  subscription_end: string | null;
  product_id: string | null;
  // Extension fields
  extension_trial_used: boolean;
  extension_active: boolean;
  extension_trial_end_date: string | null;
  // Computed fields
  days_left: number | null;
  plan_label: string;
  status_color: "green" | "yellow" | "red" | "blue";
  can_activate_extension: boolean;
}

const FREE_TRIAL_DAYS = 30;

export function useSubscriptionStatus() {
  const { user } = useAuth();
  const [status, setStatus] = useState<SubscriptionStatus>({
    loading: true,
    subscribed: false,
    subscription_end: null,
    product_id: null,
    extension_trial_used: false,
    extension_active: false,
    extension_trial_end_date: null,
    days_left: null,
    plan_label: "Free",
    status_color: "green",
    can_activate_extension: false,
  });

  const refresh = useCallback(async () => {
    if (!user) return;

    try {
      // Fetch subscription from Stripe and extension data in parallel
      const [subRes, extRes] = await Promise.all([
        supabase.functions.invoke("check-subscription"),
        supabase
          .from("subscription_extensions")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle(),
      ]);

      const sub = subRes.data || {};
      const ext = extRes.data;

      const subscribed = !!sub.subscribed;
      const subEnd = sub.subscription_end || null;

      const extensionUsed = ext?.extension_trial_used || false;
      const extensionEndDate = ext?.extension_trial_end_date || null;

      // Calculate expiration date
      let expirationDate: Date | null = null;
      let planLabel = "Free";
      let extensionActive = false;

      if (subscribed && subEnd) {
        expirationDate = new Date(subEnd);
        planLabel = "Go";

        // Check if this is a trial subscription (extension active)
        if (extensionUsed && extensionEndDate) {
          const extEnd = new Date(extensionEndDate);
          const now = new Date();
          if (now < extEnd) {
            extensionActive = true;
            planLabel = "Estensione Gratuita";
            expirationDate = extEnd;
          }
        }
      } else {
        // Free trial based on account creation
        if (user.created_at) {
          expirationDate = new Date(
            new Date(user.created_at).getTime() + FREE_TRIAL_DAYS * 24 * 60 * 60 * 1000
          );
          planLabel = "Starter";
        }
      }

      // Calculate days left
      const daysLeft = expirationDate
        ? Math.ceil((expirationDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : null;

      // Determine status color
      let statusColor: "green" | "yellow" | "red" | "blue" = "green";
      if (extensionActive) {
        statusColor = "blue";
      } else if (daysLeft !== null) {
        if (daysLeft <= 3) statusColor = "red";
        else if (daysLeft <= 7) statusColor = "yellow";
      }

      // Can activate extension: within 5 days of expiration, not already used, not already subscribed to Go
      const canActivate =
        !extensionUsed &&
        !subscribed &&
        daysLeft !== null &&
        daysLeft <= 5 &&
        daysLeft > 0;

      setStatus({
        loading: false,
        subscribed,
        subscription_end: subEnd,
        product_id: sub.product_id || null,
        extension_trial_used: extensionUsed,
        extension_active: extensionActive,
        extension_trial_end_date: extensionEndDate,
        days_left: daysLeft,
        plan_label: planLabel,
        status_color: statusColor,
        can_activate_extension: canActivate,
      });
    } catch (err) {
      console.error("Error fetching subscription status:", err);
      setStatus((s) => ({ ...s, loading: false }));
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { ...status, refresh };
}
