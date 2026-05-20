# Hospital ERD Relationship Analysis

## Core Flow
Patient → Appointment → Doctor

## Entities
- Patient
- Doctor
- Department
- Appointment
- Service
- Medical_Record
- Billing
- Appointment_Service

## Relationships

Patient 1:M Appointment  
Doctor 1:M Appointment  
Department 1:M Doctor  
Appointment M:N Service → Appointment_Service  
Appointment 1:0..1 Medical_Record  
Appointment 1:1 Billing  
Patient 1:M Billing  

## Notes
- Appointment_Service resolves M:N between Appointment and Service
- Medical_Record depends on completed Appointment
- Billing is generated per Appointment