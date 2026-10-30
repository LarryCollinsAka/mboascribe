CREATE TYPE "public"."worker_application_status" AS ENUM('PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED');--> statement-breakpoint
CREATE TYPE "public"."task_review_decision" AS ENUM('APPROVED', 'REVISION_REQUESTED');--> statement-breakpoint
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
CREATE INDEX "worker_app_status_idx" ON "worker_applications" USING btree ("status");--> statement-breakpoint
CREATE INDEX "worker_available_idx" ON "worker_profiles" USING btree ("is_available");--> statement-breakpoint
CREATE INDEX "worker_cap_profile_idx" ON "worker_capabilities" USING btree ("profile_id");--> statement-breakpoint
CREATE INDEX "task_submissions_task_idx" ON "task_submissions" USING btree ("task_id");--> statement-breakpoint
CREATE INDEX "task_reviews_task_idx" ON "task_reviews" USING btree ("task_id");--> statement-breakpoint
CREATE INDEX "audit_actor_idx" ON "audit_events" USING btree ("actor_id");--> statement-breakpoint
CREATE INDEX "audit_action_idx" ON "audit_events" USING btree ("action");--> statement-breakpoint
CREATE INDEX "audit_created_idx" ON "audit_events" USING btree ("created_at");