flowchart TD
    Start([User Message])
    Intent[Intent Recognition]
    Entity[Entity Extraction]
    Validate[Validate Request]
    Query[Query Database]
    Response[Generate Response]
    End([Return Reply])

    Start --> Intent
    Intent --> Entity
    Entity --> Validate
    Validate --> Query
    Query --> Response
    Response --> End