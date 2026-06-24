flowchart TD
    User[User]
    Frontend[Web Application]
    Agent[AI Conversational Agent]
    Intent[Intent Recognition]
    Logic[Reservation Business Logic]
    DB[(Reservation Database)]

    User --> Frontend
    Frontend --> Agent
    Agent --> Intent
    Intent --> Logic
    Logic --> DB
    DB --> Logic
    Logic --> Frontend
    Frontend --> User