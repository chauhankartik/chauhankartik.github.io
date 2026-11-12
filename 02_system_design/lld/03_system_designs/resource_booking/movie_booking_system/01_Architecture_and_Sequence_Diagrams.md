# Movie Booking System — Architecture & Design Diagrams (Mermaid)

> **Module:** `/02_system_design/lld/03_system_designs/resource_booking/movie_booking_system`  
> **Topic:** Comprehensive visual models (Flowcharts, Class Diagrams, Sequence Diagrams, and State Machines)

---

## 1. System Architecture & Component Interaction Flow

The `MovieBookingService` acts as a **Facade**, coordinating search catalogs, thread-safe seat locking with auto-expiration (TTL), pluggable pricing and discounts, payment processing, and notification emission.

```mermaid
flowchart TD
    User(["👤 User / Client"])

    subgraph Facade["MovieBookingService (Orchestrator Facade)"]
        Catalog["Catalog & Search\n(City, Theatres, Screens, Shows, Movies)"]
        BookingEngine["Booking Engine\n(createBooking, confirmBooking, cancelBooking)"]
    end

    subgraph ConcurrencySubsystem["Concurrency & TTL Lock Subsystem"]
        SLM["SeatLockManager (Singleton)"]
        SeatLocks[("ConcurrentHashMap<br/>ReentrantLock per ShowSeat")]
        ActiveLocks[("Active Locks Map<br/>bookingId ➔ SeatLockDetails")]
        TTLScheduler[("ScheduledExecutorService<br/>Auto-Release on TTL Expiry")]
    end

    subgraph Strategies["Pluggable Strategies (Strategy Pattern)"]
        Pricing["IPricingStrategy\n(Default / Weekend / Surge)"]
        Discount["IDiscountStrategy\n(CouponDiscountStrategy)"]
        PaymentFactory["PaymentProcessorFactory"]
        PayProcessor["IPaymentProcessor\n(UPIProcessor / CreditCardProcessor)"]
    end

    subgraph Output["Output & Artifacts"]
        BookingObj["Booking (Aggregate Root)<br/>Status: PENDING / CONFIRMED / CANCELLED / EXPIRED"]
        TicketObj["Ticket<br/>(QR Code, Movie, Theatre, Screen, ShowTime)"]
        Notification["NotificationService (Observer)<br/>(Confirmation & Refund alerts)"]
    end

    %% Interactions
    User -->|"1. searchMovies(city, genre, lang)"| Catalog
    User -->|"2. getShowSeatLayout(showId)"| Catalog
    User -->|"3. createBooking(userId, showId, seats, coupon)"| BookingEngine

    BookingEngine -->|"Calculate base pricing"| Pricing
    BookingEngine -->|"Compute coupon discount"| Discount
    BookingEngine -->|"lockSeats(bookingId, show, seats, TTL)"| SLM

    SLM -->|"Acquire per-seat locks"| SeatLocks
    SLM -->|"Store lock & expiration"| ActiveLocks
    SLM -->|"Schedule rollback after TTL"| TTLScheduler

    User -->|"4. confirmBooking(bookingId, paymentMode)"| BookingEngine
    BookingEngine -->|"Get processor"| PaymentFactory
    PaymentFactory -->|"processPayment(bookingId, amount)"| PayProcessor
    BookingEngine -->|"confirmLock(bookingId) ➔ mark BOOKED"| SLM
    BookingEngine -->|"Generate digital ticket"| TicketObj
    TicketObj --> Notification

    User -.->|"5. cancelBooking(bookingId)"| BookingEngine
    BookingEngine -.->|"Release seats to AVAILABLE"| SLM
    BookingEngine -.->|"processRefund(paymentRecord)"| PayProcessor
    BookingEngine -.->|"Notify cancellation & refund"| Notification
```

---

## 2. Core Class Diagram & Domain Model

Details domain entities, associations, and strategy interfaces:

```mermaid
classDiagram
    direction TB

    class MovieBookingService {
        -Map~City, List~Theatre~~ cityTheatresMap
        -Map~String, Movie~ moviesMap
        -Map~String, Show~ showsMap
        -Map~String, Booking~ bookingsMap
        -SeatLockManager seatLockManager
        -IPricingStrategy pricingStrategy
        -IDiscountStrategy discountStrategy
        +getInstance() MovieBookingService
        +searchMovies(city, genre, lang) List~Movie~
        +getShows(city, movieId) List~Show~
        +getShowSeatLayout(showId) Map~String, ShowSeat~
        +createBooking(userId, showId, seatIds, couponCode) Booking
        +confirmBooking(bookingId, paymentMode) Ticket
        +cancelBooking(bookingId) boolean
    }

    class SeatLockManager {
        -ConcurrentHashMap~String, ReentrantLock~ seatLocks
        -ConcurrentHashMap~String, SeatLockDetails~ activeBookingLocks
        -ScheduledExecutorService scheduler
        +getInstance() SeatLockManager
        +lockSeats(bookingId, show, seatIds, timeoutSeconds) boolean
        +unlockSeats(bookingId) void
        +confirmLock(bookingId) boolean
        +isSeatLocked(showSeatId) boolean
    }

    class SeatLockDetails {
        -String bookingId
        -Show show
        -List~ShowSeat~ lockedSeats
        -long expirationTimestamp
        +isExpired() boolean
    }

    class Show {
        -String showId
        -Movie movie
        -Screen screen
        -Theatre theatre
        -LocalDateTime startTime
        -ShowFormat showFormat
        -Map~String, ShowSeat~ showSeats
        +getShowSeats() Map~String, ShowSeat~
    }

    class ShowSeat {
        -String showSeatId
        -Seat seat
        -String showId
        -double price
        -volatile SeatStatus status
        +markBlocked() boolean
        +markBooked() boolean
        +markAvailable() void
    }

    class Seat {
        -String seatId
        -int row
        -int number
        -SeatType seatType
    }

    class Booking {
        -String bookingId
        -String userId
        -Show show
        -List~ShowSeat~ seats
        -double totalAmount
        -double discountAmount
        -double finalAmount
        -BookingStatus status
        -PaymentRecord paymentRecord
        +applyDiscount(discount)
        +confirmBooking(paymentRecord)
        +cancelBooking()
        +markExpired()
    }

    class Ticket {
        -String ticketId
        -String bookingId
        -String movieTitle
        -String theatreName
        -String screenName
        -String showTime
        -List~String~ seatNumbers
        -String qrCodeToken
        -double amountPaid
        +printTicket() void
    }

    class IPricingStrategy {
        <<interface>>
        +calculatePrice(show, seats) double
    }

    class DefaultPricingStrategy {
        +calculatePrice(show, seats) double
    }

    class WeekendPricingStrategy {
        -double weekendMultiplier
        +calculatePrice(show, seats) double
    }

    class IPaymentProcessor {
        <<interface>>
        +processPayment(bookingId, amount, mode) PaymentRecord
        +processRefund(paymentRecord) boolean
    }

    class UPIProcessor {
        +processPayment(...) PaymentRecord
        +processRefund(...) boolean
    }

    class CreditCardProcessor {
        +processPayment(...) PaymentRecord
        +processRefund(...) boolean
    }

    MovieBookingService --> SeatLockManager : delegates locking
    MovieBookingService --> IPricingStrategy : uses
    MovieBookingService --> IPaymentProcessor : uses
    MovieBookingService --> Booking : creates & tracks
    SeatLockManager *-- SeatLockDetails : tracks
    Show *-- ShowSeat : contains
    ShowSeat o-- Seat : references
    Booking o-- ShowSeat : references
    Booking ..> Ticket : produces
    IPricingStrategy <|.. DefaultPricingStrategy
    IPricingStrategy <|.. WeekendPricingStrategy
    IPaymentProcessor <|.. UPIProcessor
    IPaymentProcessor <|.. CreditCardProcessor
```

---

## 3. Concurrency & Race Condition Resolution (Two Users Booking Same Seat)

Shows the exact thread interactions when User A and User B concurrently compete for Seat A1, including the **TTL scheduled auto-release** if payment times out:

```mermaid
sequenceDiagram
    autonumber
    actor UserA as User A
    actor UserB as User B
    participant Service as MovieBookingService
    participant LockMgr as SeatLockManager
    participant Seat as ShowSeat (Seat A1)
    participant Timer as ScheduledExecutorService (TTL)
    participant Gateway as PaymentGateway / Processor

    Note over UserA, UserB: Both users request Seat A1 at the same millisecond

    par User A requests Seat A1
        UserA->>Service: createBooking(UserA, Show1, [A1])
        Service->>LockMgr: lockSeats(bookingA, Show1, [A1], TTL=10s)
        LockMgr->>Seat: Acquire ReentrantLock & markBlocked()
        Seat-->>LockMgr: status = TEMPORARILY_BLOCKED (Success)
        LockMgr->>Timer: scheduleUnlockTask(bookingA, delay=10s)
        LockMgr-->>Service: true (Lock Acquired)
        Service-->>UserA: Booking A created (PENDING_PAYMENT)
    and User B requests Seat A1
        UserB->>Service: createBooking(UserB, Show1, [A1])
        Service->>LockMgr: lockSeats(bookingB, Show1, [A1], TTL=10s)
        LockMgr->>Seat: Try Acquire ReentrantLock & check status
        Seat-->>LockMgr: status == TEMPORARILY_BLOCKED (Unavailable)
        LockMgr-->>Service: false (Lock Failed)
        Service-->>UserB: Error: Seat A1 is currently unavailable!
    end

    alt Success Case: User A Pays Within TTL Window
        UserA->>Service: confirmBooking(bookingA, UPI)
        Service->>Gateway: processPayment(bookingA, $finalAmount)
        Gateway-->>Service: PaymentStatus.SUCCESS
        Service->>LockMgr: confirmLock(bookingA)
        LockMgr->>Seat: markBooked() ➔ status = BOOKED
        LockMgr->>LockMgr: Remove bookingA from activeBookingLocks
        Service-->>UserA: Ticket Issued (TCK_XXX) with QR Code
    else Timeout Case: User A Abandons Payment / TTL Expires
        Timer->>LockMgr: Auto-release trigger (10 seconds elapsed)
        LockMgr->>Seat: markAvailable() ➔ status = AVAILABLE
        LockMgr->>LockMgr: Remove bookingA from activeBookingLocks
        Note over Seat: Seat A1 is immediately available for other users!
    end
```

---

## 4. State Machines: Seat & Booking Lifecycles

### Seat State Transition (`SeatStatus`)
```mermaid
stateDiagram-v2
    [*] --> AVAILABLE : Show Created

    AVAILABLE --> TEMPORARILY_BLOCKED : User locks seat (TTL timer starts)
    TEMPORARILY_BLOCKED --> BOOKED : Payment completed within TTL
    TEMPORARILY_BLOCKED --> AVAILABLE : TTL timeout / Payment failure / Abandonment

    BOOKED --> AVAILABLE : Booking cancelled & refunded
    BOOKED --> [*] : Show completed
```

### Booking State Transition (`BookingStatus`)
```mermaid
stateDiagram-v2
    [*] --> PENDING_PAYMENT : createBooking() + lockSeats() succeeded

    PENDING_PAYMENT --> CONFIRMED : Payment SUCCESS + confirmLock()
    PENDING_PAYMENT --> EXPIRED : TTL expired before payment confirmation
    PENDING_PAYMENT --> FAILED : Payment declined by gateway

    CONFIRMED --> CANCELLED : cancelBooking() (Seats released + Refund processed)
    CONFIRMED --> [*] : Event concluded
    EXPIRED --> [*]
    FAILED --> [*]
```

---

## 5. End-to-End Happy Path & Cancellation Flow

```mermaid
sequenceDiagram
    autonumber
    actor Customer as 👤 Customer
    participant App as 🎬 MovieBookingService
    participant LockMgr as 🔒 SeatLockManager
    participant Pricing as 💰 IPricingStrategy
    participant Payment as 💳 PaymentProcessor
    participant Notify as 📩 NotificationService

    Note over Customer, Notify: PHASE 1: DISCOVERY & SEAT SELECTION
    Customer->>App: searchMovies(City.BANGALORE, Genre.SCI_FI, "English")
    App-->>Customer: [Interstellar, Inception]
    Customer->>App: getShowSeatLayout(showId)
    App-->>Customer: Layout Map (SeatIds, Types, Statuses)

    Note over Customer, Notify: PHASE 2: BOOKING CREATION & TTL LOCK
    Customer->>App: createBooking(userId, showId, [A1, A2], "SAVE20")
    App->>Pricing: calculatePrice(show, [A1, A2])
    Pricing-->>App: Raw Amount = $300.00
    App->>LockMgr: lockSeats(bookingId, show, [A1, A2], TTL=10s)
    LockMgr-->>App: Locks acquired & TTL timer armed
    App-->>Customer: Booking Object (Final: $280.00, PENDING_PAYMENT)

    Note over Customer, Notify: PHASE 3: PAYMENT & CONFIRMATION
    Customer->>App: confirmBooking(bookingId, PaymentMode.UPI)
    App->>Payment: processPayment(bookingId, $280.00, UPI)
    Payment-->>App: PaymentRecord (SUCCESS, TXN_12345)
    App->>LockMgr: confirmLock(bookingId)
    LockMgr-->>App: Seats permanently marked BOOKED
    App->>Notify: sendBookingConfirmation(userId, ticket)
    App-->>Customer: 🎟️ Digital Ticket Issued

    Note over Customer, Notify: PHASE 4: CANCELLATION & REFUND
    Customer->>App: cancelBooking(bookingId)
    App->>LockMgr: Mark seats [A1, A2] back to AVAILABLE
    App->>Payment: processRefund(PaymentRecord)
    Payment-->>App: Refund SUCCESS
    App->>Notify: sendCancellationNotification(userId, bookingId, $280.00)
    App-->>Customer: Cancellation Confirmed ($280.00 Refunded)
```
