import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Users,
  HeartHandshake,
  UserSearch,
  HelpCircle,
  MessageSquareText,
  CalendarDays,
  Building2,
  HandCoins,
  BriefcaseBusiness,
  Handshake,
  School,
  ClipboardList,
  Cpu,
  UsersRound,
  MonitorPlay,
  Sparkles,
  Settings
} from "lucide-react";

export type NavItem = {
  name: string;
  label: string;
  path: string;
  icon: LucideIcon;
  items?: { name: string; label: string; path: string }[];
};

export const adminRoutes: NavItem[] = [
  {
    name: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/admin/dashboard"
  },
  {
    name: "team",
    label: "Team",
    icon: Users,
    path: "/admin/team"
  },
  {
    name: "volunteers",
    label: "Volunteers",
    icon: HeartHandshake,
    path: "/admin/volunteers/requests",
    items: [
      {
        name: "volunteer-requests",
        label: "Volunteer Requests",
        path: "/admin/volunteers/requests"
      },
      {
        name: "volunteer-roles",
        label: "Volunteer Roles",
        path: "/admin/volunteers/roles"
      }
    ]
  },

  {
    name: "talent",
    label: "Talent Request",
    icon: UserSearch,
    path: "/admin/talent-request"
  },
  {
    name: "enquiries",
    label: "Enquiries",
    icon: HelpCircle,
    path: "/admin/enquiries"
  },
  {
    name: "testimonials",
    label: "Testimonials",
    icon: MessageSquareText,
    path: "/admin/testimonials"
  },
  {
    name: "reports",
    label: "Reports",
    icon: ClipboardList,
    path: "/admin/reports"
  },
  {
    name: "events",
    label: "Events",
    icon: CalendarDays,
    path: "/admin/events"
  },

  {
    name: "chapters",
    label: "Chapters",
    icon: UsersRound,
    path: "/admin/chapters",
    items: [
      {
        name: "chapter-events",
        label: "Chapter Events",
        path: "/admin/chapters/chapter-events"
      },
      {
        name: "chapter-leads",
        label: "Chapter Leads",
        path: "/admin/chapters/chapter-leads"
      }
    ]
  },

  {
    name: "stem-a-girl",
    label: "Stem a Girl",
    icon: Sparkles,
    path: "/admin/stem-a-girl/schools",
    items: [
      { name: "schools", label: "Schools", path: "/admin/stem-a-girl/schools" },
      { name: "courses", label: "Courses", path: "/admin/stem-a-girl/courses" },
      {
        name: "activities",
        label: "Activities",
        path: "/admin/stem-a-girl/activities"
      },
      { name: "events", label: "Events", path: "/admin/stem-a-girl/events" },
      {
        name: "impact-stories",
        label: "Impact Stories",
        path: "/admin/stem-a-girl/impact-stories"
      },
      {
        name: "testimonials",
        label: "Testimonials",
        path: "/admin/stem-a-girl/testimonials"
      }
    ]
  },

  {
    name: "academy",
    label: "Academy",
    icon: School,
    path: "/admin/academy/schools",
    items: [
      { name: "schools", label: "Schools", path: "/admin/academy/schools" },
      {
        name: "school-programs",
        label: "School Programs",
        path: "/admin/academy/school-programs"
      },
      { name: "courses", label: "Courses", path: "/admin/academy/courses" }
    ]
  },

  {
    name: "initiatives",
    label: "Initiatives",
    icon: Cpu,
    path: "/admin/initiatives"
  },
  {
    name: "partners",
    label: "Partners/Sponsors",
    icon: Handshake,
    path: "/admin/partners"
  },
  {
    name: "jobs",
    label: "Jobs",
    icon: BriefcaseBusiness,
    path: "/admin/jobs"
  },
  {
    name: "reach",
    label: "Our Reach",
    icon: HandCoins,
    path: "/admin/reach"
  },
  {
    name: "companies",
    label: "Companies",
    icon: Building2,
    path: "/admin/companies"
  },
  {
    name: "media",
    label: "Media",
    icon: MonitorPlay,
    path: "/admin/media"
  },

  // ─── Admin Settings ───────────────────────────────────────────
  // Our Reach, User Management, and Roles & Permissions live here.
  // Our Reach page stays at its existing path (/admin/reach) — no move needed.
  {
    name: "settings",
    label: "Admin Settings",
    icon: Settings,
    path: "/admin/settings/users",
    items: [
      {
        name: "users",
        label: "Users",
        path: "/admin/settings/users"
      },
      {
        name: "roles",
        label: "Roles & Permissions",
        path: "/admin/settings/roles"
      },
      {
        name: "reach",
        label: "Our Reach",
        path: "/admin/settings/reach"
      } // already exists
    ]
  }
];
