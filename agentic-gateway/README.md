# Agentic Gateway: Resiliência e IA no Atendimento PJ

Este projeto é um recorte arquitetural focado em resolver duas dores centrais no contexto de atendimento via mensagem:
1. Garantir que nenhuma mensagem seja perdida ou duplicada frente a falhas de rede, webhooks duplicados e instabilidade de serviços de terceiros.
2. Elevar o atendimento com uma camada agêntica capaz de resolver problemas automatizáveis (Tool Calling) e escalar os complexos para humanos com contexto.

A premissa aqui é que *código é apenas um detalhe de implementação*; o valor está na engenharia do sistema, na previsibilidade frente a falhas e na orquestração correta do LLM.

---

## 🏗 Arquitetura do Sistema

O fluxo foi desenhado para remover o gargalo da camada de recepção (API) o mais rápido possível, delegando o processamento complexo e a interação com a IA para workers assíncronos e escaláveis.

```mermaid
graph TD
    Client[WhatsApp / ChatWoot Webhook] -->|POST Payload| API(API: Express)
    
    subgraph "Camada de Persistência (Idempotência & Outbox)"
        API -->|1. Transação Atômica| DB[(PostgreSQL)]
        DB --> |Tabela: messages| MsgState[Estado da Mensagem]
        DB --> |Tabela: outbox_events| Outbox[Eventos Pendentes]
    end

    API -.->|2. Retorna 200 OK rápido| Client
    
    subgraph "Mensageria e Workers"
        OutboxRelay(Worker: Outbox Relay) -->|3. Polling (SKIP LOCKED)| Outbox
        OutboxRelay -->|4. Publica Evento| SQS[[Fila SQS principal]]
        
        SQSConsumer(Worker: SQS Consumer) -->|5. Consome| SQS
        SQS -.->|Mensagem Envenenada (Redrive 3x)| DLQ[[Dead Letter Queue]]
    end

    subgraph "Atendimento Agêntico"
        SQSConsumer -->|6. Passa contexto| Agent{Agente IA}
        Agent -->|Decisão: Tool Calling| T1[Tool: consultar_status_nota]
        Agent -->|Decisão: Tool Calling| T2[Tool: escalar_para_humano]
    end

    T1 -->|7. Atualiza Status (RESOLVED)| MsgState
    T2 -->|7. Atualiza Status (ESCALATED)| MsgState