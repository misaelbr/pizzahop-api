ALTER TABLE "restaurants" RENAME COLUMN "manager_id1" TO "manager_id";--> statement-breakpoint
ALTER TABLE "restaurants" DROP CONSTRAINT "restaurants_manager_id1_users_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "restaurants" ADD CONSTRAINT "restaurants_manager_id_users_id_fk" FOREIGN KEY ("manager_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
