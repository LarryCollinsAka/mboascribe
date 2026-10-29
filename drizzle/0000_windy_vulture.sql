CREATE TYPE "public"."order_status" AS ENUM('DRAFT', 'AWAITING_QUOTE', 'QUOTED', 'AWAITING_PAYMENT', 'PAYMENT_REVIEW', 'PAID', 'IN_PRODUCTION', 'QUALITY_REVIEW', 'DELIVERED', 'FAILED', 'CANCELLED', 'REFUNDED', 'REVISION_REQUESTED');--> statement-breakpoint
CREATE TYPE "public"."service_type" AS ENUM('TRANSCRIPTION', 'TRANSLATION', 'TRANSCRIPTION_TRANSLATION', 'SUBTITLING');--> statement-breakpoint
CREATE TYPE "public"."recording_status" AS ENUM('PENDING_UPLOAD', 'UPLOADED', 'PROCESSING', 'READY', 'FAILED', 'DELETED');--> statement-breakpoint
CREATE TYPE "public"."document_kind" AS ENUM('DOCUMENT', 'MANUSCRIPT', 'BOOK', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."document_status" AS ENUM('PENDING_UPLOAD', 'UPLOADED', 'ANALYZING', 'READY', 'IN_PRODUCTION', 'DELIVERED', 'FAILED', 'DELETED');--> statement-breakpoint
CREATE TYPE "public"."payment_method" AS ENUM('SELAR', 'MANUAL', 'GREY_BANK_TRANSFER', 'AIRTM');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('PENDING', 'AWAITING_VERIFICATION', 'VERIFIED', 'REJECTED', 'REFUNDED');--> statement-breakpoint
CREATE TABLE "organizations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"service_type" "service_type" NOT NULL,
	"source_locale" varchar(16),
	"target_locale" varchar(16),
	"status" "order_status" DEFAULT 'DRAFT' NOT NULL,
	"currency" varchar(3) DEFAULT 'XAF' NOT NULL,
	"quoted_amount" bigint,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recordings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"original_filename" varchar(500) NOT NULL,
	"mime_type" varchar(100) NOT NULL,
	"object_key" varchar(1000) NOT NULL,
	"size_bytes" bigint,
	"duration_seconds" integer,
	"status" "recording_status" DEFAULT 'PENDING_UPLOAD' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"kind" "document_kind" DEFAULT 'DOCUMENT' NOT NULL,
	"original_filename" varchar(500) NOT NULL,
	"mime_type" varchar(150) NOT NULL,
	"object_key" varchar(1000) NOT NULL,
	"size_bytes" bigint,
	"word_count" integer,
	"page_count" integer,
	"status" "document_status" DEFAULT 'PENDING_UPLOAD' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"method" "payment_method" NOT NULL,
	"status" "payment_status" DEFAULT 'PENDING' NOT NULL,
	"amount" bigint NOT NULL,
	"currency" varchar(3) NOT NULL,
	"external_reference" varchar(255),
	"proof_object_key" varchar(1000),
	"verification_note" text,
	"verified_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recordings" ADD CONSTRAINT "recordings_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "orders_organization_id_idx" ON "orders" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "orders_status_idx" ON "orders" USING btree ("status");--> statement-breakpoint
CREATE INDEX "orders_service_type_idx" ON "orders" USING btree ("service_type");--> statement-breakpoint
CREATE INDEX "recordings_order_id_idx" ON "recordings" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "recordings_status_idx" ON "recordings" USING btree ("status");--> statement-breakpoint
CREATE INDEX "documents_order_id_idx" ON "documents" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "documents_status_idx" ON "documents" USING btree ("status");--> statement-breakpoint
CREATE INDEX "payments_order_id_idx" ON "payments" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "payments_status_idx" ON "payments" USING btree ("status");