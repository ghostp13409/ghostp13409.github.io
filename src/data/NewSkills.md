## Overview

### Microservices Project → ModernShop

- Monolithic to Microservices conversion of Product and Carts
- Services such as Order, Product, Cart, and Inventory communicate with each other
  - Manual Port Configuration
  - OpenFeign
- API Gateway
- Service Discovery
  - Eureka Server
- Images and Containers
  - Create Docker Image from Build files with Dockerfile
  - Exposing Ports
- Deployment
  - Deploy Images to DockerHub
  - Create Web Services on [Render.com](http://Render.com) and Deploy from DockerHub Images
- Port Handling
- Team Management
  - Group of 4
- DB hosting
  - PostgreSQL on Render
- Data Validation and Error Handling
- **Usage**:
  - User can see stock (live)
  - User can add product to cart
  - User can create order
  - User can see order history

### Equipment Rental System

- SignalR - Live updates and notifications
- Background Processes - Chat Support
- Redis (Cashing) - Quick Loading recent equipments
- Data Validation and Error Handling
- Multi-Stack Project
  - Backend → [ASP.](http://ASP.NEt)net (C#)
  - Frontend → React (TypeScript + Tailwind)
- Authentication and Authorization
  - OAuth → Google
  - JWT Tokens
  - Token Bearer
  - Role-based Authorization
  - CORS
- **Usage**:
  - Users can rent equipment
  - Users can view equipment details
  - Users/Admin can manage their profile
    - Username, Password, Email, Name
  - Users can view their rental history
  - Users can manage their Active rental
    - view, extend, return
  - Users can request an extension on their active rental
  - Users can chat with Admin for their rentals
  - Admin can manage Users, Equipments and Rentals
  - Real-time chats between Users and Admins

### Car Renting App

- Admin Dashboard
- Dual Database with change sync
  - Local DB → SQLite
  - Remote DB → Firebase Firestore Database
- Kotlin Jetpack Compose
- Android Development
- Data Validation and Error Handling
- Team Management
- **Usage**:
  - Admin can add new Cars
  - Admin can manage Customers
  - Admin can create a car rental for users
  - Admin can see total stats like, Total Rentals, Active Rentals, etc.

### Expense Tracking App

- Data Visualization
  - Spend Charts
  - Budget Progression
  - Expense/Income Charts
- Kotlin Jetpack Compose
- Android Development
- Data Validation and Error Handling
- Team Management
- **Usage**:
  - Users can add Income/Expense
  - Users can set up Budgets
  - Users can categorize expenses, set budgets for them and view progression for each category

### Ultimate Coders - Tutor

- Teach effectively to kids of all ages
- Communicate with Parents
- Communication
- Teaching Skills
  - Encouraging students to explore and experiment
  - Help with Time Management
  - Help with
- C#, Python, Scratch, JavaScript
- Equipment Calibration
- Initiative - Cable Management
- Software Installation and Configuration
- Support and teach kids with disability
- Admin Tasks → Managing Accounts, lessons, and schedules
- Assigning and Assessing Lessons
- Provide Feedback to parents
- Managing multiple students with multiple tasks
