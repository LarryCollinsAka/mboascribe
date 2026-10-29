import { index, pgEnum, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { orders } from "./orders";
import { taskTypes } from "./task-types";
import { profiles } from "./profiles";

export const workTaskStatusEnum = pgEnum("work_task_status", [
  "UNASSIGNED", "ASSIGNED", "ACCEPTED", "IN_PROGRESS", "SUBMITTED", "IN_REVIEW", "REVISION_REQUESTED", "COMPLETED", "CANCELLED",
]);
export const workTaskPriorityEnum = pgEnum("work_task_priority", ["LOW", "NORMAL", "HIGH", "URGENT"]);

export const workTasks = pgTable("work_tasks", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  taskTypeId: uuid("task_type_id").notNull().references(() => taskTypes.id),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  status: workTaskStatusEnum("status").default("UNASSIGNED").notNull(),
  priority: workTaskPriorityEnum("priority").default("NORMAL").notNull(),
  currentAssigneeId: uuid("current_assignee_id").references(() => profiles.id, { onDelete: "set null" }),
  dueAt: timestamp("due_at", { withTimezone: true }),
  acceptedAt: timestamp("accepted_at", { withTimezone: true }),
  startedAt: timestamp("started_at", { withTimezone: true }),
  submittedAt: timestamp("submitted_at", { withTimezone: true }),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("work_tasks_order_id_idx").on(table.orderId),
  index("work_tasks_task_type_id_idx").on(table.taskTypeId),
  index("work_tasks_assignee_idx").on(table.currentAssigneeId),
  index("work_tasks_status_idx").on(table.status),
]);
