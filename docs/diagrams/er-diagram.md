erDiagram
    USER {
        int id
        string fullname
        string email
        string password
        string role
    }

    VENUE {
        int id
        string name
        string location
        int capacity
        decimal price
    }

    WORKSPACE {
        int id
        string name
        string type
        int capacity
        decimal price
    }

    RESERVATION {
        int id
        date reservation_date
        string status
        datetime created_at
    }

    CHAT_SESSION {
        int id
        datetime started_at
    }

    USER ||--o{ RESERVATION : makes
    VENUE ||--o{ RESERVATION : booked_for
    WORKSPACE ||--o{ RESERVATION : booked_for
    USER ||--o{ CHAT_SESSION : initiates