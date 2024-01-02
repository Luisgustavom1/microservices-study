## CQRS Flow
```mermaid
graph TD
    User[User] --> |Commands - POST| App --> |Send a command| CommandHandler
    CommandHandler --> |Persist data| WriteDb
    CommandHandler --> |Publish command event| Queue

    User --> |Queries - GET| App --> |Send a query| QueryHandler --> |Get data| ReadDb

    QueryHandler --> |Subscribe| Queue --> |Update data| ReadDb
    
    App[Server]
    CommandHandler(Command Handler)
    QueryHandler(Query Handler)
    ReadDb[(Read Database)]
    WriteDb[(Write Database)]
    Queue["Event Bus"]
```

### References
- https://viniciuscampitelli.com/slides-comunicacao-microsservicos/#/9/20
- https://www.youtube.com/watch?v=Q4meQZHIs1c
