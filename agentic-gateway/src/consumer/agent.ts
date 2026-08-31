type ToolCall = 
  | { name: "consultar_status_nota"; arguments: { cnpj: string; mes: string } }
  | { name: "escalar_para_humano"; arguments: { motivo: string } };

interface AgentResult {
  status: "RESOLVED" | "ESCALATED";
  replyMessage: string;
}

export class AgentService {
  private async simulateLLMToolCalling(message: string): Promise<ToolCall> {
    const text = message.toLowerCase();
    
    if (text.includes("nota") || text.includes("imposto")) {
      return {
        name: "consultar_status_nota",
        arguments: { cnpj: "00.000.000/0000-00", mes: "atual" }
      };
    }

    return {
      name: "escalar_para_humano",
      arguments: { motivo: "Usuário solicitou algo fora do escopo automático" }
    };
  }

  public async processMessage(externalId: string, customerId: string, content: string): Promise<AgentResult> {
    console.log(`[Agent] Analisando intenção da mensagem: "${content}"`);
    
    const toolCall = await this.simulateLLMToolCalling(content);
    console.log(`[Agent] LLM decidiu chamar a tool: ${toolCall.name}`);

    if (toolCall.name === "consultar_status_nota") {
      console.log(`[Agent] Executando query de notas para CNPJ: ${toolCall.arguments.cnpj}`);
      return {
        status: "RESOLVED",
        replyMessage: `Sua nota fiscal do mês ${toolCall.arguments.mes} já foi emitida. Tudo certo com seus impostos!`
      };
    }

   if (toolCall.name === "escalar_para_humano") {
      console.log(`[Agent] Escalonando. Motivo: ${toolCall.arguments.motivo}`);
      return {
        status: "ESCALATED",
        replyMessage: "Entendi. Vou transferir você para um de nossos especialistas."
      };
    }

    return { status: "ESCALATED", replyMessage: "Transferindo..." };
  }
}
