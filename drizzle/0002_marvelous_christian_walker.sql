ALTER TABLE "restaurants" ADD COLUMN "manager_id1" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "restaurants" ADD CONSTRAINT "restaurants_manager_id1_users_id_fk" FOREIGN KEY ("manager_id1") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
