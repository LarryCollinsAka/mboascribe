import { index, pgEnum, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { workTasks } from "./work-tasks";
import { profiles } from "./profiles";

export const taskAssignmentStatusEnum = pgEnum("task_assignment_status", ["ASSIGNED", "ACCEPTED", "DECLINED", "REASSIGNED", "COMPLETED", "CANCELLED"]);

/** Immutable-ish assignment history. work_tasks.current_assignee_id is the fast current pointer. */
export const taskAssignments = pgTable("task_assignments", {
  id: uuid("id").defaultRandom().primaryKey(),
  taskId: uuid("task_id").notNull().references(() => workTasks.id, { onDelete: "cascade" }),
  assigneeId: uuid("assignee_id").notNull().references(() => profiles.id),
  assignedById: uuid("assigned_by_id").references(() => profiles.id, { onDelete: "set null" }),
  status: taskAssignmentStatusEnum("status").default("ASSIGNED").notNull(),
  assignedAt: timestamp("assigned_at", { withTimezone: true }).defaultNow().notNull(),
  respondedAt: timestamp("responded_at", { withTimezone: true }),
  endedAt: timestamp("ended_at", { withTimezone: true }),
}, (table) => [index("task_assignments_task_id_idx").on(table.taskId), index("task_assignments_assignee_id_idx").on(table.assigneeId)]);
