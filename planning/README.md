# Project Planning - CareFood

## Table of Contents

1. [Overview](#overview)
2. [UX/UI Prototyping](#uxui-prototyping)
3. [User Stories](#user-stories)
4. [Data Modeling & Database](#data-modeling--database)
5. [Technical Feasibility](#technical-feasibility)

---

### Overview

CareFood is a social project aimed at reducing food waste by connecting stores and restaurants that have excess food with low-income individuals. Through the application, users can reserve food boxes at symbolic prices, supporting both food waste reduction and access to affordable food. The project involves two primary types of users:

1. **Food Seekers** – Individuals looking to reserve food boxes.
2. **Food Providers** – Stores and restaurants that offer food boxes.

[Back to top](#table-of-contents)

---

### UX/UI Prototyping

The app interface is designed to ensure simplicity and functionality, minimizing the number of screens while providing sufficient information for users.

#### **User - Food Seeker**

- **Home Screen**: Lists stores/restaurants with available food boxes for the day.
  - **Entry**: Shows the name, address, and number of boxes available.
  - **No Login Required**: Users can browse available boxes without logging in but will need to log in or register to reserve.
  - **Login**: Upon attempting to reserve a box, users are prompted to log in/register.

#### **Food Provider**

- **Weekly Plan Board**: Displays days of the week (vertically) and the types and quantities of boxes (horizontally).
  - **Modes**:
    - **Planning Mode**: Allows providers to set up box availability for each day.
    - **Reservation Mode**: Shows the number of boxes reserved out of the planned amount.
    - Example: "3/5" (reserved/available).

[Back to top](#table-of-contents)

---

### User Stories

#### As a Food Seeker:

1. I want to see available food boxes near me, so I can easily reserve a box.
2. I want to be able to filter the available boxes based on dietary preferences (e.g., Vegan, Diabetic), so I can quickly find food that suits my needs.
3. I want to be notified when I successfully reserve a food box, so I can plan to pick it up on time.
4. I want to view my reservation history, so I can track my past reservations.
5. I want to cancel a reservation if necessary, so that the box becomes available for others.

#### As a Food Provider:

1. I want to input the available food boxes for the week, so customers know how many boxes are available.
2. I want to see the number of reservations made, so I can prepare the exact number of boxes.
3. I want to update the number of available boxes in real-time, so the system reflects accurate availability.

[Back to top](#table-of-contents)

---

### Data Modeling & Database

The database structure supports the management of both users and providers, ensuring smooth tracking of reservations, available food boxes, and preferences.

#### **Key Entities**

1. **Users**:
   - Basic user information (name, contact details).
   - Preferences (Standard, Vegan, Diabetic).
   - Reservation history.

    Table structure:

    ```sql
    CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    password VARCHAR(100) NOT NULL,
    preferences VARCHAR(20)
    );
    ```

2. **Providers**:
   - Store/restaurant details (name, address, coordinates).
   - Weekly box plan (date, box types, quantities).
   - Reservation records.

   Table structure:

   ```sql
    CREATE TABLE providers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    login VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    address VARCHAR(255) NOT NULL,
    coordinates VARCHAR(100),
    description TEXT
    );
    ```

3. **Food Boxes**:
   - Box details (type: Standard, Vegan, Diabetic).
   - Availability per day.
   - Reservation status.

    Table structure:

    ```sql
    CREATE TABLE boxes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    provider_id INT,
    type VARCHAR(20),
    description TEXT,
    FOREIGN KEY (provider_id) REFERENCES providers(id)
    );
    ```

4. **Reservations**:
   - User ID, Box ID, and Date.
   - Status (Reserved/Available).

    Table structure:

    ```sql
    CREATE TABLE reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    box_id INT,
    provider_id INT,
    reservation_date DATE,
    quantity INT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (box_id) REFERENCES boxes(id),
    FOREIGN KEY (provider_id) REFERENCES providers(id)
    );
    ```

5. **Weekly plans table**:

    ```sql
    CREATE TABLE weekly_plans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    provider_id INT,
    week_start DATE,
    standard_quantity INT,
    vegan_quantity INT,
    diabetic_quantity INT,
    pickup_time TIME,
    FOREIGN KEY (provider_id) REFERENCES providers(id)
    );

[Back to top](#table-of-contents)

---

### Technical Feasibility

We aim for a lean approach to ensure that the first release is functional, scalable, and easy to maintain.

#### Frontend:

- Simple list view of available food boxes on the home screen.
- Minimalistic and responsive design using React.

#### Backend:

- RESTful API for data handling (Node.js, Express).
- **MySQL** database to manage users, providers, and reservations.

[Back to top](#table-of-contents)

---
