"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { Users, CalendarDays, ListChecks, UserCog } from "lucide-react";

import { getUsers } from "@/features/team/api";
import { getMembers } from "@/features/team/api";
import { getEvents, type Event } from "@/features/events/api";
import { GoogleAnalyticsCard } from "@/features/analytics/components/google-analytics-card";
import { StatCard } from "@/components/molecules/stats-card";

type TrendMeta = {
  trend: "up" | "down" | "neutral";
  value: string; // "+12.3%" | "-5.0%" | "0%" | "New"
  label: string; // "Since last month"
};

function isValidDate(d: Date) {
  return !Number.isNaN(d.getTime());
}

function getMonthWindow(date: Date) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  return { start, end };
}

function countCreatedInMonth<T extends { createdAt?: string }>(
  items: T[],
  monthDate: Date
) {
  const { start, end } = getMonthWindow(monthDate);
  return items.filter((it) => {
    if (!it?.createdAt) return false;
    const d = new Date(it.createdAt);
    if (!isValidDate(d)) return false;
    return d >= start && d < end;
  }).length;
}

function computeMonthTrend(thisMonth: number, lastMonth: number): TrendMeta {
  // If last month was 0 and this month > 0, % is misleading; show "New"
  if (lastMonth === 0 && thisMonth > 0) {
    return { trend: "up", value: "New", label: "Since last month" };
  }

  if (lastMonth === 0 && thisMonth === 0) {
    return { trend: "neutral", value: "0%", label: "Since last month" };
  }

  const delta = thisMonth - lastMonth;
  const pct = (delta / lastMonth) * 100;

  const rounded = `${pct >= 0 ? "+" : ""}${pct.toFixed(1)}%`;

  if (delta > 0)
    return { trend: "up", value: rounded, label: "Since last month" };
  if (delta < 0)
    return { trend: "down", value: rounded, label: "Since last month" };
  return { trend: "neutral", value: "0%", label: "Since last month" };
}

function countActivePrograms(events: Event[]) {
  const now = new Date();
  return events.filter((e) => {
    if (!e?.eventDate) return false;
    const d = new Date(e.eventDate);
    if (!isValidDate(d)) return false;
    return d >= now;
  }).length;
}

export function DashboardStats() {
  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 60_000
  });

  const eventsQuery = useQuery({
    queryKey: ["events"],
    queryFn: getEvents,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 60_000
  });

  const membersQuery = useQuery({
    queryKey: ["members"],
    queryFn: () => getMembers(),
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 60_000
  });

  const users = React.useMemo(
    () => (usersQuery.data ?? []) as Array<{ createdAt?: string }>,
    [usersQuery.data]
  );
  const events = React.useMemo(
    () => (eventsQuery.data ?? []) as Event[],
    [eventsQuery.data]
  );
  const members = React.useMemo(
    () => (membersQuery.data ?? []) as Array<{ createdAt?: string }>,
    [membersQuery.data]
  );

  const totalUsers = users.length;
  const totalEvents = events.length;
  const totalMembers = members.length;

  const activePrograms = React.useMemo(
    () => countActivePrograms(events),
    [events]
  );

  // Trend windows
  const now = React.useMemo(() => new Date(), []);
  const lastMonth = React.useMemo(
    () => new Date(now.getFullYear(), now.getMonth() - 1, 1),
    [now]
  );

  const usersTrend = React.useMemo(() => {
    const thisCount = countCreatedInMonth(users, now);
    const lastCount = countCreatedInMonth(users, lastMonth);
    return computeMonthTrend(thisCount, lastCount);
  }, [users, now, lastMonth]);

  const eventsTrend = React.useMemo(() => {
    // EventItem uses `eventDate`; map to `{ createdAt?: string }` for the month counting helper.
    const eventCreated = events.map((e) => ({ createdAt: e.eventDate }));
    const thisCount = countCreatedInMonth(eventCreated, now);
    const lastCount = countCreatedInMonth(eventCreated, lastMonth);
    return computeMonthTrend(thisCount, lastCount);
  }, [events, now, lastMonth]);

  const membersTrend = React.useMemo(() => {
    const thisCount = countCreatedInMonth(members, now);
    const lastCount = countCreatedInMonth(members, lastMonth);
    return computeMonthTrend(thisCount, lastCount);
  }, [members, now, lastMonth]);

  // Active programs trend:
  // We’ll compute active programs now vs last month "as of that month end".
  // This is an approximation but still meaningful: how many upcoming events existed then vs now.
  const activeProgramsTrend = React.useMemo(() => {
    const nowCount = countActivePrograms(events);

    // approximate “last month active” by moving the "now" reference back to last month end
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 1); // start of this month
    const lastCount = events.filter((e) => {
      if (!e?.eventDate) return false;
      const d = new Date(e.eventDate);
      if (!isValidDate(d)) return false;
      return d >= lastMonthEnd; // events still upcoming at the start of this month
    }).length;

    return computeMonthTrend(nowCount, lastCount);
  }, [events, now]);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Overview of users, events, and activity.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total users"
          value={totalUsers}
          isLoading={usersQuery.isLoading}
          icon={<Users className="h-5 w-5 text-muted-foreground" />}
          trend={usersTrend.trend}
          trendValue={usersTrend.value}
          trendLabel={usersTrend.label}
        />

        <StatCard
          title="Total events"
          value={totalEvents}
          isLoading={eventsQuery.isLoading}
          icon={<CalendarDays className="h-5 w-5 text-muted-foreground" />}
          trend={eventsTrend.trend}
          trendValue={eventsTrend.value}
          trendLabel={eventsTrend.label}
        />

        <StatCard
          title="Active programs"
          value={activePrograms}
          isLoading={eventsQuery.isLoading}
          icon={<ListChecks className="h-5 w-5 text-muted-foreground" />}
          trend={activeProgramsTrend.trend}
          trendValue={activeProgramsTrend.value}
          trendLabel={activeProgramsTrend.label}
        />

        <StatCard
          title="Total team members"
          value={totalMembers}
          isLoading={membersQuery.isLoading}
          icon={<UserCog className="h-5 w-5 text-muted-foreground" />}
          trend={membersTrend.trend}
          trendValue={membersTrend.value}
          trendLabel={membersTrend.label}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <GoogleAnalyticsCard />
      </div>
    </section>
  );
}
