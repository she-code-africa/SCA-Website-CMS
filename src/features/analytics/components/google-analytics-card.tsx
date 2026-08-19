"use client";

import * as React from "react";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import { Globe, LogIn, LogOut } from "lucide-react";

import { StatCard } from "@/components/molecules/stats-card";
import { Button } from "@/components/ui/button";

const PROPERTY_ID = process.env.NEXT_PUBLIC_GA_PROPERTY_ID;

function getStoredGAToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("GA_token");
}

function setStoredGAToken(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem("GA_token", token);
}

function clearGAAuth() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("GA_token");
}

export function GoogleAnalyticsCard() {
  const [views, setViews] = React.useState<number | null>(null);
  const [loading, setLoading] = React.useState(false);

  const token = typeof window !== "undefined" ? getStoredGAToken() : null;
  const gaConnected = Boolean(token);

  const fetchViews = React.useCallback(
    async (accessToken: string) => {
      if (!PROPERTY_ID) {
        toast.error("Missing NEXT_PUBLIC_GA_PROPERTY_ID in .env");
        return;
      }

      setLoading(true);

      try {
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        };

        const requestBody = {
          metrics: [{ name: "screenPageViews" }],
          dateRanges: [{ startDate: "today", endDate: "today" }]
        };

        const res = await axios.post(
          `https://analyticsdata.googleapis.com/v1beta/properties/${PROPERTY_ID}:runReport`,
          requestBody,
          { headers }
        );

        const rowCount = res.data?.rowCount ?? 0;
        const value =
          rowCount > 0
            ? Number(res.data?.rows?.[0]?.metricValues?.[0]?.value ?? 0)
            : 0;

        setViews(Number.isFinite(value) ? value : 0);
      } catch (err: any) {
        const code = err?.response?.data?.error?.code;
        const status = err?.response?.status;

        // GA token expired/invalid
        if (code === 401 || status === 401) {
          clearGAAuth();
          setViews(null);
          toast.error(
            "Google Analytics session expired. Please sign in again."
          );
          return;
        }

        toast.error("Error fetching analytics");
      } finally {
        setLoading(false);
      }
    },
    [] // PROPERTY_ID is a build-time env; safe to treat as stable
  );

  const googleLogin = useGoogleLogin({
    scope:
      "https://www.googleapis.com/auth/analytics https://www.googleapis.com/auth/analytics.readonly",
    include_granted_scopes: true,
    onSuccess: async (tokenResponse) => {
      const accessToken = tokenResponse?.access_token;

      if (!accessToken) {
        toast.error("Google login failed: no access token received");
        return;
      }

      setStoredGAToken(accessToken);
      toast.success("Google Analytics connected");
      await fetchViews(accessToken);
    },
    onError: () => toast.error("Google login failed")
  });

  React.useEffect(() => {
    // auto-fetch on mount if token exists
    const stored = getStoredGAToken();
    if (stored) fetchViews(stored);
     
  }, [fetchViews]);

  const onDisconnect = () => {
    clearGAAuth();
    setViews(null);
    toast.success("Google Analytics disconnected");
  };

  if (gaConnected) {
    return (
      <div className="space-y-2">
        <StatCard
          title="Daily website visit"
          value={loading ? "Loading..." : (views ?? 0)}
          icon={<Globe className="h-5 w-5 text-muted-foreground" />}
          trend="neutral"
          trendLabel="Today’s page views"
          isLoading={loading && views === null}
        />

        <Button
          type="button"
          variant="outline"
          onClick={onDisconnect}
          className="w-full"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Disconnect Google Analytics
        </Button>
      </div>
    );
  }

  // Not connected state (consistent card UI)
  return (
    <div className="space-y-2">
      <StatCard
        title="Daily website visit"
        value="—"
        icon={<Globe className="h-5 w-5 text-muted-foreground" />}
        trend="neutral"
        trendLabel="Connect Google Analytics to show today’s page views"
      />

      <Button type="button" onClick={() => googleLogin()} className="w-full">
        <LogIn className="mr-2 h-4 w-4" />
        Google Sign In
      </Button>
    </div>
  );
}
