ALTER TABLE "Appointment"
ADD COLUMN schedule_id INT REFERENCES "DocSchedules"(id);
