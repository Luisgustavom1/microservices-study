## CQRS Flow
```mermaid
graph TD
    User[User] --> |Send a command| CommandHandler
    CommandHandler -->|Success or error| User
    CommandHandler --> |Persist data| WriteDb
    CommandHandler --> |Publish command event| Queue

    User --> |Send a query to some data| QueryHandler
    QueryHandler --> ReadDb 
    QueryHandler -->|"Result"| User
    Queue --> |Update data| ReadDb
    
    CommandHandler(Command Handler)
    QueryHandler(Query Handler)
    ReadDb[(Read Database)]
    WriteDb[(Write Database)]
    Queue["Events Queue"]
```

### References
- https://viniciuscampitelli.com/slides-comunicacao-microsservicos/#/9/20
- https://www.youtube.com/watch?v=Q4meQZHIs1c
