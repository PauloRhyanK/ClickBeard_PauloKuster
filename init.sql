CREATE TABLE "Users" (
  "id_user" BIGSERIAL PRIMARY KEY,
  "type_user" VARCHAR(20) NOT NULL CHECK (type_user IN ('client', 'barber', 'admin')),
  "name_user" VARCHAR(255) NOT NULL,
  "email_user" VARCHAR(255) UNIQUE NOT NULL,
  "pass_user" VARCHAR(255) NOT NULL,
  "age_user" INTEGER,
  "hiring_date" DATE,
  "created_at" TIMESTAMP DEFAULT NOW()
);
CREATE TABLE "Specialties"(
    "id_speciality" BIGINT NOT NULL PRIMARY KEY,
    "nm_speciality" VARCHAR(255) NOT NULL
);
CREATE TABLE "Barber_Specialities" (
  "id_user" BIGINT NOT NULL,
  "id_speciality" BIGINT NOT NULL,
  PRIMARY KEY ("id_user", "id_speciality"),
  FOREIGN KEY ("id_user") REFERENCES "Users"("id_user"),
  FOREIGN KEY ("id_speciality") REFERENCES "Specialties"("id_speciality")
);
CREATE TABLE "Appointments" (
  "id_appointments" BIGSERIAL PRIMARY KEY,
  "id_client" BIGINT NOT NULL,
  "id_barber" BIGINT NOT NULL,
  "id_speciality" BIGINT NOT NULL,
  "appointment_time" TIMESTAMP NOT NULL,
  "canceled_at" TIMESTAMP,
  FOREIGN KEY ("id_client") REFERENCES "Users"("id_user"),
  FOREIGN KEY ("id_barber") REFERENCES "Users"("id_user"),
  FOREIGN KEY ("id_speciality") REFERENCES "Specialties"("id_speciality")
);

ALTER TABLE
    "Appointments" ADD PRIMARY KEY("id_appointments");
ALTER TABLE
    "Users" ADD CONSTRAINT "users_id_user_foreign" FOREIGN KEY("id_user") REFERENCES "Barber_Specialities"("id_user");
ALTER TABLE
    "Appointments" ADD CONSTRAINT "appointments_id_client_foreign" FOREIGN KEY("id_client") REFERENCES "Users"("id_user");
ALTER TABLE
    "Barber_Specialities" ADD CONSTRAINT "barber_specialities_id_speciality_foreign" FOREIGN KEY("id_speciality") REFERENCES "Specialties"("id_speciality");