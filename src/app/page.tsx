import { ThemeToggle } from "@/components/molecules/theme-toggle";

export default function Page() {
  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Theme test</h1>
        <ThemeToggle />
      </div>
    </div>
  );
}
