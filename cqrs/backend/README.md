## CQRS Flow
```mermaid
---
title: Command Flow
---
graph TD
    User --> |1 - Commands - POST| App --> |2 - Publish new command| Queue
    
    Queue --> |3 - Listen| CommandHandler --> |Persist Data| WriteDb
    CommandHandler --> |4 - Publish Finish Command| Queue

    Queue --> |5 - Listen| QueryHandler --> |Update data| ReadDb

    User[User]
    App[Server]
    CommandHandler(Command Handler)
    QueryHandler(Query Handler)
    ReadDb[(Read Database)]
    WriteDb[(Write Database)]
    Queue["Event Bus"]
```

```mermaid
---
title: Query Flow
---
graph TD
    User --> |Query - GET| App --> |Access data| ReadDb
    
    User[User]
    App[Server]
    ReadDb[(Read Database)]
```

### References
- https://viniciuscampitelli.com/slides-comunicacao-microsservicos/#/9/20
- https://www.youtube.com/watch?v=Q4meQZHIs1c
- https://www.eventstore.com/blog/event-sourcing-and-cqrs
- https://speakerdeck.com/khaosdoctor/controlando-o-tempo-com-typescript-e-event-sourcing
