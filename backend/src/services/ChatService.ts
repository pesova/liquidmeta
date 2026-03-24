import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, AIMessage, SystemMessage } from '@langchain/core/messages';
import { Types } from 'mongoose';
import env from '../config/env';
import { ChatSession, IChatSession } from '../models/ChatSession';
import VectorService from '../infrastructure/vector/VectorService';

const SUMMARY_THRESHOLD = 5;

const llm = new ChatOpenAI({
  apiKey: env.OPENAI_API_KEY,
  model: 'gpt-4o-mini',
  temperature: 0.7,
});

const summaryLlm = new ChatOpenAI({
  apiKey: env.OPENAI_API_KEY,
  model: 'gpt-4o-mini',
  temperature: 0,
});

class ChatService {
  /**
   * Retrieve or create a chat session for a user.
   */
  private async getOrCreateSession(userId: Types.ObjectId): Promise<IChatSession> {
    let session = await ChatSession.findOne({ userId });
    if (!session) {
      session = await ChatSession.create({ userId, messages: [], summary: null });
      console.log('Created new ChatSession for user', userId.toString());
    }
    console.log('Found existing ChatSession for user', userId.toString(), 'Message count:', session.messages.length);
    return session;
  }

  /** Summarize the conversation when it reaches the threshold. */
  private async summarizeSession(session: IChatSession): Promise<IChatSession> {
    const conversationText = session.messages
      .map((msg) => (msg.role === 'user' ? `Buyer: ${msg.content}` : `Assistant: ${msg.content}`))
      .join('\n');
    const prompt = `Summarize this shopping conversation in 2-3 sentences, focusing on what the buyer is looking for:\n\n${conversationText}`;
    console.log('Summarizing conversation with', session.messages.length, 'messages');
    const summaryResponse = await summaryLlm.invoke([
      new SystemMessage('You are a helpful assistant that summarizes conversations concisely.'),
      new HumanMessage(prompt),
    ]);
    session.summary = (summaryResponse as any).content;
    session.messages = [];
    await session.save();
    console.log('Session summarized. New summary:', session.summary);
    return session;
  }

  /** Main chat interaction */
  public async chat(userId: string, userMessage: string) {
    const objId = new Types.ObjectId(userId);
    let session = await this.getOrCreateSession(objId);

    if (session.messages.length >= SUMMARY_THRESHOLD) {
      session = await this.summarizeSession(session);
    }

    // Retrieve product context via vector search
    const products = await VectorService.searchProducts(userMessage, 5);
    console.log('Vector search returned', products.length, 'products for query:', userMessage);
    const productContext =
      products && products.length > 0
        ? products
            .map((p: any, i: number) => `${i + 1}. ${p.name} — ₦${p.price} — ${p.category} — ${p.description}`)
            .join('\n')
        : 'No matching products found.';
    console.log('Product context prepared.');

    // Build system message
    const systemParts = [];
    systemParts.push(
      'You are AI MarketLink’s friendly Nigerian marketplace shopping assistant. Answer user queries using the product information provided. Keep tone conversational and helpful.'
    );
    if (session.summary) {
      systemParts.push(`Previous conversation summary: ${session.summary}`);
    }
    systemParts.push(`Product context:\n${productContext}`);
    const systemMessage = new SystemMessage(systemParts.join('\n\n'));

    // Convert prior messages to LangChain messages
    const priorMessages = session.messages.map((msg) =>
      msg.role === 'user'
        ? new HumanMessage(msg.content)
        : new AIMessage(msg.content)
    );

    const userHuman = new HumanMessage(userMessage);
    const llmMessages = [systemMessage, ...priorMessages, userHuman];
    console.log('Invoking LLM with', llmMessages.length, 'messages');

    const assistantResponse = await llm.invoke(llmMessages);
    console.log('LLM response received:', (assistantResponse as any).content);

    // Store both user and assistant messages
    const now = new Date();
    session.messages.push({ role: 'user', content: userMessage, createdAt: now });
    session.messages.push({ role: 'assistant', content: (assistantResponse as any).content, createdAt: now });
    console.log('Saved user and assistant messages to session');
    await session.save();

    return {
      message: (assistantResponse as any).content,
      products,
      sessionId: session._id.toString(),
    };
  }

  /** Get chat history */
  public async getHistory(userId: string) {
    const session = await ChatSession.findOne({ userId });
    if (!session) {
      return { messages: [], summary: null };
    }
    return { messages: session.messages, summary: session.summary };
  }

  /** Clear chat history */
  public async clearHistory(userId: string) {
    await ChatSession.findOneAndUpdate({ userId }, { $set: { messages: [], summary: null } });
  }
}

export default new ChatService();
