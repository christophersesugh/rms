flowchart LR
    User((User))
    Admin((Administrator))
    Register[Register]
    Login[Login]
    Search[Search Availability]
    Reserve[Make Reservation]
    Modify[Modify Reservation]
    Cancel[Cancel Reservation]
    Chat[Chat with AI Agent]
    ManageV[Manage Venues]
    ManageW[Manage Workspaces]
    ManageR[Manage Reservations]
    Reports[Generate Reports]

    User --> Register
    User --> Login
    User --> Search
    User --> Reserve
    User --> Modify
    User --> Cancel
    User --> Chat

    Admin --> ManageV
    Admin --> ManageW
    Admin --> ManageR
    Admin --> Reports