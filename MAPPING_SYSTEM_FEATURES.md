**Mapping System's features:**

# Recover password

**Functional Requirements**

- User must be able recover password by providing his email;
- User must receive an email with password recovery instructions;
- User must be able to reset their password;

**Nonfunctional Requirements**

- Use Mailtrap to test sending emails in development environment;
- Use Amazon SES (Simple Email Service) for email delivery in production environment;
- Sending emails must execute as a background job;

**Business Rules**

- Link sent to email to recover password must expire after 2 hours;
- User must confirm new password after he resets his password;


# Update profile

**Functional Requirements**

- User must be able to update name, email, password;

**Business Rules**

- User cannot update email to an email that has already been used;
- User must type old password in order to update to a new password;
- User must confirm new password in order to update to a new password;

# Service provider dashboard

**Functional Requirements**

- User service provider must be able to list appointments for a specific day;
- User service provider must receive a notification whenever he receives an appointment;
- User service provider must be able to list notifications that have not been read;

**Nonfunctional Requirements**

- Appointments for User service provider must be stored in cache;
- User service provider's notifications must be stored in MongDB;
- User service provider's notification must be sent in real-time using Socket.io;

**Business Rules**

- Notifications must have a status of read/not-read that User service provider can control;

# Service appointments

**Functional Requirements**

- User must be able to list all registered service providers;
- User must be able to list the the days of a month with at least one available slot for service provider selected;
- User must be able to list available times for a specific day of service provider selected;
- User must be able to schedule an appointment with a service provider;

**Nonfunctional Requirements**

- Service providers must be stored in cache;

**Business Rules**

- Each appointment must last exactly 1 hour;
- Appointments must be available between 8h to 18h (First time slot at 8h, and Last time slot at 17h);
- User cannot schedule an appointment in a time slot that has already been taken;
- User cannot schedule an appointment in a time slot that is in the past;
- User cannot schedule an appointment with himself;
