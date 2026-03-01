// src/app/admin/volunteers/page.tsx
import { redirect } from "next/navigation";

export default function VolunteersIndexPage() {
  redirect("/admin/volunteers/requests");
}
