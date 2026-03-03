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
import type { Permission } from "@/lib/rbac/permissions";

export type NavItem = {
  name: string;
  label: string;
  path: string;
  icon: LucideIcon;
  permission?: Permission;
  items?: {
    name: string;
    label: string;
    path: string;
    permission?: Permission;
  }[];
};

export const adminRoutes: NavItem[] = [
  {
    name: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/admin/dashboard",
    permission: "VIEW_DASHBOARD"
  },
  {
    name: "team",
    label: "Team",
    icon: Users,
    path: "/admin/team",
    permission: "VIEW_TEAM"
  },
  {
    name: "volunteers",
    label: "Volunteers",
    icon: HeartHandshake,
    path: "/admin/volunteers/requests",
    permission: "VIEW_VOLUNTEER_REQUEST",
    items: [
      {
        name: "volunteer-requests",
        label: "Volunteer Requests",
        path: "/admin/volunteers/requests",
        permission: "VIEW_VOLUNTEER_REQUEST"
      },
      {
        name: "volunteer-roles",
        label: "Volunteer Roles",
        path: "/admin/volunteers/roles",
        permission: "VIEW_ROLE"
      }
    ]
  },
  {
    name: "talent",
    label: "Talent Request",
    icon: UserSearch,
    path: "/admin/talent-request",
    permission: "VIEW_TALENT_REQUEST"
  },
  {
    name: "enquiries",
    label: "Enquiries",
    icon: HelpCircle,
    path: "/admin/enquiries",
    permission: "VIEW_ENQUIRY"
  },
  {
    name: "testimonials",
    label: "Testimonials",
    icon: MessageSquareText,
    path: "/admin/testimonials",
    permission: "VIEW_TESTIMONIALS"
  },
  {
    name: "reports",
    label: "Reports",
    icon: ClipboardList,
    path: "/admin/reports",
    permission: "VIEW_REPORT"
  },
  {
    name: "events",
    label: "Events",
    icon: CalendarDays,
    path: "/admin/events",
    permission: "VIEW_EVENT"
  },
  {
    name: "chapters",
    label: "Chapters",
    icon: UsersRound,
    path: "/admin/chapters",
    permission: "VIEW_CHAPTER",
    items: [
      {
        name: "chapter-list",
        label: "All Chapters",
        path: "/admin/chapters",
        permission: "VIEW_CHAPTER"
      },
      {
        name: "chapter-events",
        label: "Chapter Events",
        path: "/admin/chapters/chapter-events",
        permission: "VIEW_EVENT"
      }
    ]
  },
  {
    name: "stem-a-girl",
    label: "Stem a Girl",
    icon: Sparkles,
    path: "/admin/stem-a-girl/activities",
    permission: "VIEW_ACTIVITY",
    items: [
      {
        name: "activities",
        label: "Activities",
        path: "/admin/stem-a-girl/activities",
        permission: "VIEW_ACTIVITY"
      },
      {
        name: "impact-stories",
        label: "Impact Stories",
        path: "/admin/stem-a-girl/impact-stories",
        permission: "VIEW_IMPACT_STORIES"
      }
    ]
  },
  {
    name: "academy",
    label: "Academy",
    icon: School,
    path: "/admin/academy/schools",
    permission: "VIEW_SCHOOL",
    items: [
      {
        name: "schools",
        label: "Schools",
        path: "/admin/academy/schools",
        permission: "VIEW_SCHOOL"
      },
      {
        name: "school-programs",
        label: "School Programs",
        path: "/admin/academy/school-programs",
        permission: "VIEW_SCHOOLPROGRAM"
      },
      {
        name: "courses",
        label: "Courses",
        path: "/admin/academy/courses",
        permission: "VIEW_COURSE"
      }
    ]
  },
  {
    name: "initiatives",
    label: "Initiatives",
    icon: Cpu,
    path: "/admin/initiatives",
    permission: "VIEW_INITIATIVE"
  },
  {
    name: "partners",
    label: "Partners/Sponsors",
    icon: Handshake,
    path: "/admin/partners",
    permission: "VIEW_PARTNER"
  },
  {
    name: "jobs",
    label: "Jobs",
    icon: BriefcaseBusiness,
    path: "/admin/jobs",
    permission: "VIEW_JOB"
  },
  {
    name: "reach",
    label: "Our Reach",
    icon: HandCoins,
    path: "/admin/reach",
    permission: "VIEW_OUR_REACH"
  },
  {
    name: "companies",
    label: "Companies",
    icon: Building2,
    path: "/admin/companies",
    permission: "VIEW_COMPANY"
  },
  {
    name: "settings",
    label: "Admin Settings",
    icon: Settings,
    path: "/admin/settings/users",
    permission: "VIEW_USER",
    items: [
      {
        name: "users",
        label: "Users",
        path: "/admin/settings/users",
        permission: "VIEW_USER"
      },
      {
        name: "roles",
        label: "Roles & Permissions",
        path: "/admin/settings/roles",
        permission: "VIEW_ROLE"
      }
    ]
  }
];
