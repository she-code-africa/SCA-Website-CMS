import { redirect } from "next/navigation";

export default function Page() {
  // Since middleware handles the 'isLoggedIn' check,
  // we just redirect to the dashboard by default.
  // If not logged in, middleware will intercept and send them to /login.
  redirect("/admin/dashboard");
}
