# Relational Mapping – Hospital Management System

## 1. Project Overview
This task converts the Hospital Management System ER Diagram into a relational database schema.  
The goal is to transform entities, attributes, and relationships into structured tables with primary keys, foreign keys, and associative (junction) tables where necessary.

The system manages:
Patients, Doctors, Departments, Appointments, Services, Medical Records, and Billing, Appointments_Service.

---

## 2. Mapping Objective
The relational mapping defines:
- Tables for all entities
- Primary Keys (PK) for identification
- Foreign Keys (FK) for relationships
- Junction tables for many-to-many relationships
- Attribute placement based on functional dependency

---

## 3. Entity-to-Table Mapping

### PATIENT
- Patient_ID (PK)
- F_Name
- L_Name
- Phone_No
- Email
- Address
- DOB
- Blood_Group


**Relationships:**
- A patient can have multiple appointments
- A patient can have multiple medical records
- A patient can receive multiple bills

---

### DEPARTMENT
- Dept_id (PK)
- Dept_Name
- Location
- No_of_Doctor
- Dept_head_id (FK)

**Relationships:**
- A department employs multiple doctors
- A department has one head doctor
- A department offers multiple services

---

### DOCTOR
- Doctor_id (PK)
- Name
- Specialization
- License_No
- Dept_ID (FK)
-Superviser_id (FK)

**Relationships:**
- A doctor belongs to one department
- A doctor manages multiple appointments
- A doctor creates medical records
- A doctor may be supervised by a department head

---


### APPOINTMENT
- Appointment_id (PK)
- Date
- Time
- Status (Scheduled / Completed / Cancelled)
- Patient_id (FK)
- Doctor_id (FK)

**Relationships:**
- Links patient and doctor
- Can include multiple services
- May generate a medical record if completed
- Used for billing

---

### SERVICE
- Service_id (PK)
- Service_Name
- Service_Type (Consultation / Lab Test / X-Ray / Surgery / Treatment)
- Unit_Price

**Relationships:**
- Services are offered by departments
- Services can be used in multiple appointments

---

### MEDICAL_RECORD
- Record_id (PK)
- Visit_date
- Diagnosis
- Appointment_ID (FK)
- Patient_ID (FK)
- Doctor_ID (FK)


**Relationships:**
- Created by a doctor
- Belongs to a patient
- Linked to an appointment

---

### BILLING
- Bill_id (PK)
- Bill_date
- Total_Amount
- Payment_Status (Paid / Pending / Partial)
- Appointment_ID (FK)
- Patient_ID (FK)

**Relationships:**
- Generated per appointment
- Belongs to a patient
- Based on services provided during appointment

---

## 4. Many-to-Many Relationship Handling

### APPOINTMENT_SERVICE (Junction Table)
This table resolves the many-to-many relationship between Appointment and Service.

- Appointment_id(FK)
- Service_id (FK)
- Quantity

**Primary Key:**
- Composite Key: (Appointment_id, Service_id)

**Business Rule:**
Each service provided during an appointment is recorded with a quantity.

---
Notes
- Age is a derived attribute and not stored in the database
- Billing is calculated as:  
  Service_Unit_Price × Quantity
- Appointment is the central transaction entity
- Medical records are created only after completed appointments
- Departments manage doctors and services

---

