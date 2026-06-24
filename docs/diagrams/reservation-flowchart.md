flowchart TD
    Start([Start])
    Login[Login/Register]
    Search[Search Availability]
    Available{Available?}
    Reserve[Create Reservation]
    Confirm[Generate Confirmation]
    End([End])

    Start --> Login
    Login --> Search
    Search --> Available
    Available -->|Yes| Reserve
    Available -->|No| Search
    Reserve --> Confirm
    Confirm --> End