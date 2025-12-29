# 🌍 FMVTS Trip Microservice

The **FMVTS Trip Microservice** is responsible for managing the **entire lifecycle of trips** within the Fleet Management and Vehicle Tracking System (FMVTS).

This service handles trip initiation, real-time status updates, trip completion, and analytics. It also plays a key role in **event-driven coordination** by publishing trip-related events to other microservices for notifications, driver availability updates, and vehicle distance synchronization.

---

## 📌 Core Responsibilities

- Initiate new trips
- Start trips and update trip status
- Update ongoing trip status
- Modify trip details
- Remove trips when required
- Generate trip insights and analytics (Admin only)
- Detect and publish delayed trip events
- Publish driver availability updates after trip completion
- Publish distance travelled to Vehicle Microservice

---

## 🏗️ Architecture Role

Driver / Fleet Manager
|
v
Trip Microservice
├────────▶ Notification Microservice (Delayed Trip Event)
├────────▶ User Microservice (Driver Availability)
└────────▶ Vehicle Microservice (Distance Travelled)



- Acts as the **source of truth for trip data**
- Uses **REST APIs** for synchronous operations
- Uses **RabbitMQ events** for asynchronous updates

---

## 🔐 Authentication & Authorization

- All protected routes require **JWT authentication**
- User role is propagated via API Gateway (`x-user-role`)
- Role-based access control enforced:
  - **Admin** → View trip insights and analytics
  - **Fleet Manager** → Manage trips
  - **Driver** → Limited access to assigned trips

---

## 🚚 Trip Lifecycle Management

### 📝 Initiate Trip
- Creates a new trip record
- Associates driver and vehicle
- Sets initial trip status

### ▶️ Start Trip
- Updates trip status to `IN_PROGRESS`
- Captures actual start time

### 🔄 Update Trip Status
- Updates trip state (In Progress, Completed, Cancelled)
- Records timestamps for each transition

### ✏️ Update Trip Details
- Modify trip-related data when required
- Ensures data consistency and validation

### ❌ Remove Trip
- Deletes trip record
- Restricted to authorized roles

---

## 📊 Trip Insights & Analytics (Admin Only)

- Total trips completed
- Trips grouped by status
- Delayed trip metrics

---


▶️ Running the Service


     Install Dependencies

         npm install



    Start Service

        npm start



