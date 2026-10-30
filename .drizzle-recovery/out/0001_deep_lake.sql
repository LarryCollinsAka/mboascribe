CREATE TYPE "public"."membership_status" AS ENUM('INVITED', 'ACTIVE', 'SUSPENDED');--> statement-breakpoint
CREATE TYPE "public"."organization_role" AS ENUM('OWNER', 'ADMIN', 'MEMBER', 'BILLING');--> statement-breakpoint
CREATE TYPE "public"."translation_content_type" AS ENUM('GENERAL_DOCUMENT', 'BOOK', 'MANUSCRIPT', 'ARTICLE', 'ACADEMIC_WRITING', 'WEBSITE', 'MARKETING_CONTENT', 'BUSINESS_DOCUMENT', 'LEGAL_DOCUMENT', 'TECHNICAL_DOCUMENT', 'OTHER');--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"display_name" varchar(255),
	"preferred_locale" varchar(16) DEFAULT 'en' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar(100) NOT NULL,
	"name" varchar(150) NOT NULL,
	"description" text,
	"is_system" boolean DEFAULT false NOT NULL,
	"is_protected" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "roles_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "permissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar(150) NOT NULL,
	"name" varchar(150) NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "permissions_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "profile_roles" (
	"profile_id" uuid NOT NULL,
	"role_id" uuid NOT NULL,
	"assigned_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "profile_roles_profile_id_role_id_pk" PRIMARY KEY("profile_id","role_id")
);
--> statement-breakpoint
CREATE TABLE "role_permissions" (
	"role_id" uuid NOT NULL,
	"permission_id" uuid NOT NULL,
	"granted_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "role_permissions_role_id_permission_id_pk" PRIMARY KEY("role_id","permission_id")
);
--> statement-breakpoint
CREATE TABLE "organization_memberships" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"profile_id" uuid NOT NULL,
	"role" "organization_role" DEFAULT 'MEMBER' NOT NULL,
	"status" "membership_status" DEFAULT 'ACTIVE' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "translation_projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"content_type" "translation_content_type" DEFAULT 'GENERAL_DOCUMENT' NOT NULL,
	"source_language" varchar(32) NOT NULL,
	"target_language" varchar(32) NOT NULL,
	"word_count" integer,
	"page_count" integer,
	"source_url" varchar(2048),
	"requires_proofreading" boolean DEFAULT true NOT NULL,
	"requires_formatting" boolean DEFAULT false NOT NULL,
	"deadline" timestamp with time zone,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "created_by" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "profile_roles" ADD CONSTRAINT "profile_roles_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_roles" ADD CONSTRAINT "profile_roles_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_id_permissions_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."permissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_memberships" ADD CONSTRAINT "organization_memberships_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_memberships" ADD CONSTRAINT "organization_memberships_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "translation_projects" ADD CONSTRAINT "translation_projects_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "profiles_preferred_locale_idx" ON "profiles" USING btree ("preferred_locale");--> statement-breakpoint
CREATE INDEX "roles_code_idx" ON "roles" USING btree ("code");--> statement-breakpoint
CREATE INDEX "permissions_code_idx" ON "permissions" USING btree ("code");--> statement-breakpoint
CREATE INDEX "profile_roles_role_id_idx" ON "profile_roles" USING btree ("role_id");--> statement-breakpoint
CREATE INDEX "role_permissions_permission_id_idx" ON "role_permissions" USING btree ("permission_id");--> statement-breakpoint
CREATE UNIQUE INDEX "organization_memberships_org_profile_uidx" ON "organization_memberships" USING btree ("organization_id","profile_id");--> statement-breakpoint
CREATE INDEX "organization_memberships_profile_id_idx" ON "organization_memberships" USING btree ("profile_id");--> statement-breakpoint
CREATE UNIQUE INDEX "translation_projects_order_id_uidx" ON "translation_projects" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "translation_projects_content_type_idx" ON "translation_projects" USING btree ("content_type");--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_created_by_profiles_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "orders_created_by_idx" ON "orders" USING btree ("created_by");--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "source_locale";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "target_locale";--> statement-breakpoint
ALTER TABLE "documents" DROP COLUMN "kind";--> statement-breakpoint
DROP TYPE "public"."document_kind";