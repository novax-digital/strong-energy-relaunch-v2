import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminApp } from "@/components/admin/AdminApp";

export const metadata: Metadata = {
  title: "Admin Dashboard | Strong Energy",
  robots: {
    index: false,
    follow: false
  }
};

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-secondary/30 text-muted-foreground">Backend wird geladen...</div>}>
      <AdminApp />
    </Suspense>
  );
}
