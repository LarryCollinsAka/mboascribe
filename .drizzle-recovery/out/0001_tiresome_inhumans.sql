CREATE TYPE "public"."work_task_priority" AS ENUM('LOW', 'NORMAL', 'HIGH', 'URGENT');--> statement-breakpoint
CREATE TYPE "public"."work_task_status" AS ENUM('UNASSIGNED', 'ASSIGNED', 'ACCEPTED', 'IN_PROGRESS', 'SUBMITTED', 'IN_REVIEW', 'REVISION_REQUESTED', 'COMPLETED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."task_assignment_status" AS ENUM('ASSIGNED', 'ACCEPTED', 'DECLINED', 'REASSIGNED', 'COMPLETED', 'CANCELLED');--> statement-breakpoint
ALTER TYPE "public"."service_type" ADD VALUE 'WRITING_SUPPORT';--> statement-breakpoint
CREATE TABLE "task_types" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar(120) NOT NULL,
	"name" varchar(180) NOT NULL,
	"category" varchar(80) NOT NULL,
	"description" text,
	"is_system" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "task_types_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "work_tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"task_type_id" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"status" "work_task_status" DEFAULT 'UNASSIGNED' NOT NULL,
	"priority" "work_task_priority" DEFAULT 'NORMAL' NOT NULL,
	"current_assignee_id" uuid,
	"due_at" timestamp with time zone,
	"accepted_at" timestamp with time zone,
	"started_at" timestamp with time zone,
	"submitted_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "task_assignments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"task_id" uuid NOT NULL,
	"assignee_id" uuid NOT NULL,
	"assigned_by_id" uuid,
	"status" "task_assignment_status" DEFAULT 'ASSIGNED' NOT NULL,
	"assigned_at" timestamp with time zone DEFAULT now() NOT NULL,
	"responded_at" timestamp with time zone,
	"ended_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "work_tasks" ADD CONSTRAINT "work_tasks_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_tasks" ADD CONSTRAINT "work_tasks_task_type_id_task_types_id_fk" FOREIGN KEY ("task_type_id") REFERENCES "public"."task_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_tasks" ADD CONSTRAINT "work_tasks_current_assignee_id_profiles_id_fk" FOREIGN KEY ("current_assignee_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_assignments" ADD CONSTRAINT "task_assignments_task_id_work_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."work_tasks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_assignments" ADD CONSTRAINT "task_assignments_assignee_id_profiles_id_fk" FOREIGN KEY ("assignee_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_assignments" ADD CONSTRAINT "task_assignments_assigned_by_id_profiles_id_fk" FOREIGN KEY ("assigned_by_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "task_types_category_idx" ON "task_types" USING btree ("category");--> statement-breakpoint
CREATE INDEX "task_types_active_idx" ON "task_types" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "work_tasks_order_id_idx" ON "work_tasks" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "work_tasks_task_type_id_idx" ON "work_tasks" USING btree ("task_type_id");--> statement-breakpoint
CREATE INDEX "work_tasks_assignee_idx" ON "work_tasks" USING btree ("current_assignee_id");--> statement-breakpoint
CREATE INDEX "work_tasks_status_idx" ON "work_tasks" USING btree ("status");--> statement-breakpoint
CREATE INDEX "task_assignments_task_id_idx" ON "task_assignments" USING btree ("task_id");--> statement-breakpoint
CREATE INDEX "task_assignments_assignee_id_idx" ON "task_assignments" USING btree ("assignee_id");