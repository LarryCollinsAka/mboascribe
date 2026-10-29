import Link from "next/link";
import type { Locale } from "@/i18n/config";

const staffRoles = new Set(["SUPERADMIN", "ADMIN", "OPERATIONS", "TRANSCRIBER", "TRANSLATOR", "REVIEWER", "QUALITY_REVIEWER"]);

export function DashboardSidebar({ locale, roles }: { locale: Locale; roles: string[] }) {
  const isStaff = roles.some((role) => staffRoles.has(role));
  const isAdmin = roles.some((role) => role === "SUPERADMIN" || role === "ADMIN");
  const isOperations = roles.some((role) => ["SUPERADMIN", "ADMIN", "OPERATIONS"].includes(role));
  return <aside className="portal-sidebar">
    <Link className="brand portal-brand" href={`/${locale}`}><span className="brand-mark"><i/><i/><i/></span><span>MboaScribe</span></Link>
    <nav className="portal-nav" aria-label="Dashboard">
      <Link className="active" href={`/${locale}/dashboard`}>⌂ <span>Overview</span></Link>
      <Link href={`/${locale}/dashboard/new-order`}>＋ <span>New order</span></Link>
      <Link href={`/${locale}/dashboard/orders`}>▤ <span>My orders</span></Link>
      <Link href={`/${locale}/dashboard`}>▣ <span>Files & deliveries</span></Link>
      <Link href={`/${locale}/dashboard`}>◈ <span>Payments</span></Link>
      {isStaff && <div className="portal-nav-group"><small>WORKSPACE</small><Link href={`/${locale}/dashboard/tasks`}>✓ <span>My tasks</span></Link></div>}
      {isOperations && <div className="portal-nav-group"><small>OPERATIONS</small><Link href={`/${locale}/dashboard/admin/tasks`}>☑ <span>Task queue</span></Link></div>}
      {isAdmin && <div className="portal-nav-group"><small>ADMINISTRATION</small><Link href={`/${locale}/dashboard/admin/task-types`}>☷ <span>Task types</span></Link><Link href={`/${locale}/dashboard`}>♙ <span>Users & roles</span></Link><Link href={`/${locale}/dashboard`}>⚙ <span>Operations</span></Link></div>}
    </nav>
    <div className="portal-sidebar-foot"><span className="security-dot"/> Private workspace</div>
  </aside>;
}
