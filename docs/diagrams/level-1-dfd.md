flowchart LR
    User --> P1[Authentication]
    User --> P2[Reservation Management]
    User --> P3[AI Agent]
    P1 --> DB[(Database)]
    P2 --> DB
    P3 --> DB
    Admin --> P4[Administration]
    P4 --> DB