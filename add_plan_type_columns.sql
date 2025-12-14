-- Add plan_type and selected_plan columns to plans table
ALTER TABLE `plans` 
ADD COLUMN `plan_type` VARCHAR(255) NULL AFTER `other_interests`,
ADD COLUMN `selected_plan` VARCHAR(255) NULL AFTER `plan_type`;

