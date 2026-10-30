CREATE TYPE "public"."work_task_priority" AS ENUM('LOW', 'NORMAL', 'HIGH', 'URGENT');--> statement-breakpoint
CREATE TYPE "public"."work_task_status" AS ENUM('UNASSIGNED', 'ASSIGNED', 'ACCEPTED', 'IN_PROGRESS', 'SUBMITTED', 'IN_REVIEW', 'REVISION_REQUESTED', 'COMPLETED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."task_assignment_status" AS ENUM('ASSIGNED', 'ACCEPTED', 'DECLINED', 'REASSIGNED', 'COMPLETED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."worker_application_status" AS ENUM('PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED');--> statement-breakpoint
CREATE TYPE "public"."task_review_decision" AS ENUM('APPROVED', 'REVISION_REQUESTED');--> statement-breakpoint
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
CREATE TABLE "worker_applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" uuid NOT NULL,
	"status" "worker_application_status" DEFAULT 'PENDING' NOT NULL,
	"services" text NOT NULL,
	"languages" text NOT NULL,
	"specializations" text,
	"experience" text,
	"availability" varchar(120),
	"review_note" text,
	"reviewed_by" uuid,
	"reviewed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "worker_applications_profile_id_unique" UNIQUE("profile_id")
);
--> statement-breakpoint
CREATE TABLE "worker_profiles" (
	"profile_id" uuid PRIMARY KEY NOT NULL,
	"headline" varchar(220),
	"bio" text,
	"country" varchar(120),
	"timezone" varchar(80),
	"availability" varchar(120),
	"is_available" boolean DEFAULT true NOT NULL,
	"approved_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "worker_capabilities" (
	"profile_id" uuid NOT NULL,
	"task_type_id" uuid NOT NULL,
	"source_language" varchar(80),
	"target_language" varchar(80),
	"level" varchar(40) DEFAULT 'APPROVED' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "worker_capabilities_profile_id_task_type_id_pk" PRIMARY KEY("profile_id","task_type_id")
);
--> statement-breakpoint
CREATE TABLE "task_submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"task_id" uuid NOT NULL,
	"submitted_by" uuid NOT NULL,
	"notes" text,
	"object_key" varchar(1000),
	"filename" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "task_reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"task_id" uuid NOT NULL,
	"reviewer_id" uuid NOT NULL,
	"decision" "task_review_decision" NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor_id" uuid,
	"action" varchar(120) NOT NULL,
	"target_type" varchar(80) NOT NULL,
	"target_id" varchar(255),
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "work_tasks" ADD CONSTRAINT "work_tasks_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_tasks" ADD CONSTRAINT "work_tasks_task_type_id_task_types_id_fk" FOREIGN KEY ("task_type_id") REFERENCES "public"."task_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_tasks" ADD CONSTRAINT "work_tasks_current_assignee_id_profiles_id_fk" FOREIGN KEY ("current_assignee_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_assignments" ADD CONSTRAINT "task_assignments_task_id_work_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."work_tasks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_assignments" ADD CONSTRAINT "task_assignments_assignee_id_profiles_id_fk" FOREIGN KEY ("assignee_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_assignments" ADD CONSTRAINT "task_assignments_assigned_by_id_profiles_id_fk" FOREIGN KEY ("assigned_by_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "worker_applications" ADD CONSTRAINT "worker_applications_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "worker_applications" ADD CONSTRAINT "worker_applications_reviewed_by_profiles_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "worker_profiles" ADD CONSTRAINT "worker_profiles_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "worker_capabilities" ADD CONSTRAINT "worker_capabilities_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "worker_capabilities" ADD CONSTRAINT "worker_capabilities_task_type_id_task_types_id_fk" FOREIGN KEY ("task_type_id") REFERENCES "public"."task_types"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_submissions" ADD CONSTRAINT "task_submissions_task_id_work_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."work_tasks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_submissions" ADD CONSTRAINT "task_submissions_submitted_by_profiles_id_fk" FOREIGN KEY ("submitted_by") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_reviews" ADD CONSTRAINT "task_reviews_task_id_work_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."work_tasks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_reviews" ADD CONSTRAINT "task_reviews_reviewer_id_profiles_id_fk" FOREIGN KEY ("reviewer_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_events" ADD CONSTRAINT "audit_events_actor_id_profiles_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "task_types_category_idx" ON "task_types" USING btree ("category");--> statement-breakpoint
CREATE INDEX "task_types_active_idx" ON "task_types" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "work_tasks_order_id_idx" ON "work_tasks" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "work_tasks_task_type_id_idx" ON "work_tasks" USING btree ("task_type_id");--> statement-breakpoint
CREATE INDEX "work_tasks_assignee_idx" ON "work_tasks" USING btree ("current_assignee_id");--> statement-breakpoint
CREATE INDEX "work_tasks_status_idx" ON "work_tasks" USING btree ("status");--> statement-breakpoint
CREATE INDEX "task_assignments_task_id_idx" ON "task_assignments" USING btree ("task_id");--> statement-breakpoint
CREATE INDEX "task_assignments_assignee_id_idx" ON "task_assignments" USING btree ("assignee_id");--> statement-breakpoint
CREATE INDEX "worker_app_status_idx" ON "worker_applications" USING btree ("status");--> statement-breakpoint
CREATE INDEX "worker_available_idx" ON "worker_profiles" USING btree ("is_available");--> statement-breakpoint
CREATE INDEX "worker_cap_profile_idx" ON "worker_capabilities" USING btree ("profile_id");--> statement-breakpoint
CREATE INDEX "task_submissions_task_idx" ON "task_submissions" USING btree ("task_id");--> statement-breakpoint
CREATE INDEX "task_reviews_task_idx" ON "task_reviews" USING btree ("task_id");--> statement-breakpoint
CREATE INDEX "audit_actor_idx" ON "audit_events" USING btree ("actor_id");--> statement-breakpoint
CREATE INDEX "audit_action_idx" ON "audit_events" USING btree ("action");--> statement-breakpoint
CREATE INDEX "audit_created_idx" ON "audit_events" USING btree ("created_at");