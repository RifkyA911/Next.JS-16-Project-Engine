# AI Integration

## Overview

The AI integration layer provides a unified abstraction for working with multiple AI providers. It supports provider switching, structured output, streaming responses, rate limiting, and fallback strategies.

## Architecture

### Provider Abstraction

```
AI Integration Layer
├── Provider Interface
│   ├── OpenAI
│   ├── Anthropic
│   ├── Google Gemini
│   ├── Groq
│   └── Ollama (Local)
├── Features
│   ├── Text Generation
│   ├── Streaming
│   ├── Structured Output
│   └── Rate Limiting
└── Management
    ├── Request Logging
    ├── Usage Tracking
    ├── Cost Monitoring
    └── Caching
```

## Provider Interface

### Base Interface

```typescript
interface AIProvider {
  name: string;
  generateText(prompt: string, options?: GenerationOptions): Promise<string>;
  streamText(prompt: string, options?: GenerationOptions): AsyncGenerator<string>;
  generateStructured<T>(prompt: string, schema: z.Schema<T>, options?: GenerationOptions): Promise<T>;
  estimateCost(prompt: string, model: string): number;
}
```

### Generation Options

```typescript
interface GenerationOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  stopSequences?: string[];
}
```

## Provider Implementations

### OpenAI

```typescript
import OpenAI from 'openai';

export class OpenAIProvider implements AIProvider {
  name = 'openai';
  private client: OpenAI;
  
  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
  }
  
  async generateText(prompt: string, options?: GenerationOptions): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: options?.model || 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: options?.temperature || 0.7,
      max_tokens: options?.maxTokens,
    });
    
    return response.choices[0].message.content || '';
  }
  
  async *streamText(prompt: string, options?: GenerationOptions): AsyncGenerator<string> {
    const stream = await this.client.chat.completions.create({
      model: options?.model || 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      stream: true,
    });
    
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) yield content;
    }
  }
  
  async generateStructured<T>(
    prompt: string,
    schema: z.Schema<T>,
    options?: GenerationOptions
  ): Promise<T> {
    const response = await this.client.chat.completions.create({
      model: options?.model || 'gpt-4',
      messages: [
        { role: 'system', content: 'Respond with valid JSON only.' },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
    });
    
    const content = response.choices[0].message.content || '{}';
    const parsed = JSON.parse(content);
    return schema.parse(parsed);
  }
  
  estimateCost(prompt: string, model: string): number {
    const tokens = estimateTokens(prompt);
    const pricing = {
      'gpt-4': { input: 0.03, output: 0.06 },
      'gpt-3.5-turbo': { input: 0.0015, output: 0.002 },
    };
    const modelPricing = pricing[model as keyof typeof pricing] || pricing['gpt-3.5-turbo'];
    return (tokens / 1000) * modelPricing.input;
  }
}
```

### Anthropic

```typescript
import Anthropic from '@anthropic-ai/sdk';

export class AnthropicProvider implements AIProvider {
  name = 'anthropic';
  private client: Anthropic;
  
  constructor(apiKey: string) {
    this.client = new Anthropic({ apiKey });
  }
  
  async generateText(prompt: string, options?: GenerationOptions): Promise<string> {
    const response = await this.client.messages.create({
      model: options?.model || 'claude-3-opus-20240229',
      max_tokens: options?.maxTokens || 1024,
      messages: [{ role: 'user', content: prompt }],
    });
    
    return response.content[0].type === 'text' ? response.content[0].text : '';
  }
  
  async *streamText(prompt: string, options?: GenerationOptions): AsyncGenerator<string> {
    const stream = await this.client.messages.create({
      model: options?.model || 'claude-3-opus-20240229',
      max_tokens: options?.maxTokens || 1024,
      messages: [{ role: 'user', content: prompt }],
      stream: true,
    });
    
    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        yield event.delta.text;
      }
    }
  }
  
  async generateStructured<T>(
    prompt: string,
    schema: z.Schema<T>,
    options?: GenerationOptions
  ): Promise<T> {
    const response = await this.client.messages.create({
      model: options?.model || 'claude-3-opus-20240229',
      max_tokens: options?.maxTokens || 1024,
      messages: [
        { role: 'user', content: `${prompt}\n\nRespond with valid JSON only.` },
      ],
    });
    
    const content = response.content[0].type === 'text' ? response.content[0].text : '{}';
    const parsed = JSON.parse(content);
    return schema.parse(parsed);
  }
  
  estimateCost(prompt: string, model: string): number {
    const tokens = estimateTokens(prompt);
    const pricing = {
      'claude-3-opus-20240229': { input: 0.015, output: 0.075 },
      'claude-3-sonnet-20240229': { input: 0.003, output: 0.015 },
    };
    const modelPricing = pricing[model as keyof typeof pricing] || pricing['claude-3-sonnet-20240229'];
    return (tokens / 1000) * modelPricing.input;
  }
}
```

### Ollama (Local Models)

```typescript
export class OllamaProvider implements AIProvider {
  name = 'ollama';
  private baseUrl: string;
  
  constructor(baseUrl: string = 'http://localhost:11434') {
    this.baseUrl = baseUrl;
  }
  
  async generateText(prompt: string, options?: GenerationOptions): Promise<string> {
    const response = await fetch(`${this.baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: options?.model || 'llama2',
        prompt,
        stream: false,
      }),
    });
    
    const data = await response.json();
    return data.response;
  }
  
  async *streamText(prompt: string, options?: GenerationOptions): AsyncGenerator<string> {
    const response = await fetch(`${this.baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: options?.model || 'llama2',
        prompt,
        stream: true,
      }),
    });
    
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    
    while (true) {
      const { done, value } = await reader!.read();
      if (done) break;
      
      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(Boolean);
      
      for (const line of lines) {
        const data = JSON.parse(line);
        if (data.response) yield data.response;
      }
    }
  }
  
  async generateStructured<T>(
    prompt: string,
    schema: z.Schema<T>,
    options?: GenerationOptions
  ): Promise<T> {
    const response = await this.generateText(
      `${prompt}\n\nRespond with valid JSON only.`,
      options
    );
    
    const parsed = JSON.parse(response);
    return schema.parse(parsed);
  }
  
  estimateCost(prompt: string, model: string): number {
    // Local models are free
    return 0;
  }
}
```

## Provider Management

### Provider Factory

```typescript
class AIProviderFactory {
  private providers: Map<string, AIProvider> = new Map();
  
  registerProvider(provider: AIProvider) {
    this.providers.set(provider.name, provider);
  }
  
  getProvider(name: string): AIProvider {
    const provider = this.providers.get(name);
    if (!provider) {
      throw new Error(`Provider ${name} not found`);
    }
    return provider;
  }
  
  getDefaultProvider(): AIProvider {
    return this.getProvider(process.env.DEFAULT_AI_PROVIDER || 'openai');
  }
}

// Initialize providers
const factory = new AIProviderFactory();

if (process.env.OPENAI_API_KEY) {
  factory.registerProvider(new OpenAIProvider(process.env.OPENAI_API_KEY));
}

if (process.env.ANTHROPIC_API_KEY) {
  factory.registerProvider(new AnthropicProvider(process.env.ANTHROPIC_API_KEY));
}

factory.registerProvider(new OllamaProvider(process.env.OLLAMA_BASE_URL));
```

### Provider Switching

```typescript
class AIService {
  constructor(private factory: AIProviderFactory) {}
  
  async generateText(
    prompt: string,
    providerName?: string,
    options?: GenerationOptions
  ): Promise<string> {
    const provider = providerName 
      ? this.factory.getProvider(providerName)
      : this.factory.getDefaultProvider();
    
    return provider.generateText(prompt, options);
  }
  
  async *streamText(
    prompt: string,
    providerName?: string,
    options?: GenerationOptions
  ): AsyncGenerator<string> {
    const provider = providerName
      ? this.factory.getProvider(providerName)
      : this.factory.getDefaultProvider();
    
    yield* provider.streamText(prompt, options);
  }
}
```

## Rate Limiting

### Per-Provider Rate Limiting

```typescript
class RateLimiter {
  private limits: Map<string, RateLimit> = new Map();
  
  async checkLimit(providerName: string): Promise<boolean> {
    const limit = this.limits.get(providerName) || this.getDefaultLimit(providerName);
    const now = Date.now();
    
    // Reset if window expired
    if (now - limit.resetAt > limit.windowMs) {
      limit.requests = 0;
      limit.resetAt = now + limit.windowMs;
    }
    
    if (limit.requests >= limit.maxRequests) {
      return false;
    }
    
    limit.requests++;
    this.limits.set(providerName, limit);
    return true;
  }
  
  private getDefaultLimit(providerName: string): RateLimit {
    const defaults = {
      openai: { maxRequests: 3500, windowMs: 60000 }, // 3500 requests/minute
      anthropic: { maxRequests: 1000, windowMs: 60000 }, // 1000 requests/minute
      ollama: { maxRequests: Infinity, windowMs: 60000 }, // No limit
    };
    return defaults[providerName as keyof typeof defaults] || { maxRequests: 100, windowMs: 60000 };
  }
}

interface RateLimit {
  maxRequests: number;
  windowMs: number;
  requests: number;
  resetAt: number;
}
```

### Rate-Limited Service

```typescript
class RateLimitedAIService {
  constructor(
    private aiService: AIService,
    private rateLimiter: RateLimiter
  ) {}
  
  async generateText(
    prompt: string,
    providerName?: string,
    options?: GenerationOptions
  ): Promise<string> {
    const provider = providerName || this.aiService.factory.getDefaultProvider().name;
    
    const allowed = await this.rateLimiter.checkLimit(provider);
    if (!allowed) {
      throw new Error(`Rate limit exceeded for ${provider}`);
    }
    
    return this.aiService.generateText(prompt, providerName, options);
  }
}
```

## Fallback Strategy

### Provider Fallback

```typescript
class FallbackAIService {
  constructor(
    private factory: AIProviderFactory,
    private fallbackOrder: string[] = ['openai', 'anthropic', 'ollama']
  ) {}
  
  async generateText(
    prompt: string,
    options?: GenerationOptions
  ): Promise<string> {
    for (const providerName of this.fallbackOrder) {
      try {
        const provider = this.factory.getProvider(providerName);
        return await provider.generateText(prompt, options);
      } catch (error) {
        console.warn(`Provider ${providerName} failed, trying next`, error);
        continue;
      }
    }
    
    throw new Error('All AI providers failed');
  }
}
```

## Request Logging

### AI Request Logger

```typescript
class AIRequestLogger {
  async logRequest(data: {
    userId: string;
    provider: string;
    model: string;
    prompt: string;
    response?: string;
    tokens?: number;
    cost?: number;
    duration?: number;
    error?: string;
  }) {
    await prisma.aiLog.create({
      data: {
        userId: data.userId,
        provider: data.provider,
        model: data.model,
        prompt: data.prompt,
        response: data.response,
        tokens: data.tokens,
        cost: data.cost,
        duration: data.duration,
        error: data.error,
      },
    });
  }
}
```

### Logging Middleware

```typescript
class LoggedAIService {
  constructor(
    private aiService: AIService,
    private logger: AIRequestLogger
  ) {}
  
  async generateText(
    prompt: string,
    providerName?: string,
    options?: GenerationOptions,
    userId?: string
  ): Promise<string> {
    const startTime = Date.now();
    const provider = providerName || this.aiService.factory.getDefaultProvider().name;
    
    try {
      const response = await this.aiService.generateText(prompt, providerName, options);
      const duration = Date.now() - startTime;
      const tokens = estimateTokens(prompt + response);
      const cost = this.aiService.factory.getProvider(provider).estimateCost(prompt, options?.model || 'default');
      
      if (userId) {
        await this.logger.logRequest({
          userId,
          provider,
          model: options?.model || 'default',
          prompt,
          response,
          tokens,
          cost,
          duration,
        });
      }
      
      return response;
    } catch (error) {
      const duration = Date.now() - startTime;
      
      if (userId) {
        await this.logger.logRequest({
          userId,
          provider,
          model: options?.model || 'default',
          prompt,
          error: error.message,
          duration,
        });
      }
      
      throw error;
    }
  }
}
```

## Usage Tracking

### Usage Statistics

```typescript
class UsageTracker {
  async getUserUsage(userId: string, period: 'day' | 'week' | 'month'): Promise<UsageStats> {
    const startDate = this.getStartDate(period);
    
    const logs = await prisma.aiLog.findMany({
      where: {
        userId,
        createdAt: { gte: startDate },
      },
    });
    
    return {
      totalRequests: logs.length,
      totalTokens: logs.reduce((sum, log) => sum + (log.tokens || 0), 0),
      totalCost: logs.reduce((sum, log) => sum + (log.cost?.toNumber() || 0), 0),
      byProvider: this.groupByProvider(logs),
      byModel: this.groupByModel(logs),
    };
  }
  
  private getStartDate(period: 'day' | 'week' | 'month'): Date {
    const now = new Date();
    switch (period) {
      case 'day':
        return new Date(now.setHours(0, 0, 0, 0));
      case 'week':
        return new Date(now.setDate(now.getDate() - 7));
      case 'month':
        return new Date(now.setMonth(now.getMonth() - 1));
    }
  }
  
  private groupByProvider(logs: AiLog[]): Record<string, number> {
    return logs.reduce((acc, log) => {
      acc[log.provider] = (acc[log.provider] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }
  
  private groupByModel(logs: AiLog[]): Record<string, number> {
    return logs.reduce((acc, log) => {
      acc[log.model] = (acc[log.model] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }
}

interface UsageStats {
  totalRequests: number;
  totalTokens: number;
  totalCost: number;
  byProvider: Record<string, number>;
  byModel: Record<string, number>;
}
```

## Caching

### Response Caching

```typescript
class AICacheService {
  constructor(private cache: CacheService) {}
  
  async getCachedResponse(prompt: string, model: string): Promise<string | null> {
    const key = this.generateCacheKey(prompt, model);
    return this.cache.get<string>(key);
  }
  
  async setCachedResponse(prompt: string, model: string, response: string, ttl?: number): Promise<void> {
    const key = this.generateCacheKey(prompt, model);
    await this.cache.set(key, response, ttl || 3600);
  }
  
  private generateCacheKey(prompt: string, model: string): string {
    const hash = crypto.createHash('sha256').update(prompt + model).digest('hex');
    return `ai:${model}:${hash}`;
  }
}
```

### Cached AI Service

```typescript
class CachedAIService {
  constructor(
    private aiService: AIService,
    private cache: AICacheService
  ) {}
  
  async generateText(
    prompt: string,
    providerName?: string,
    options?: GenerationOptions,
    useCache = true
  ): Promise<string> {
    const model = options?.model || 'default';
    
    if (useCache) {
      const cached = await this.cache.getCachedResponse(prompt, model);
      if (cached) return cached;
    }
    
    const response = await this.aiService.generateText(prompt, providerName, options);
    
    if (useCache) {
      await this.cache.setCachedResponse(prompt, model, response);
    }
    
    return response;
  }
}
```

## API Integration

### API Route

```typescript
// POST /api/ai/generate
export async function POST(req: NextRequest) {
  const session = await auth();
  const body = await req.json();
  
  const { prompt, provider, options } = body;
  
  // Validate input
  const validated = GenerateTextSchema.parse({ prompt, provider, options });
  
  // Generate text
  const response = await aiService.generateText(
    validated.prompt,
    validated.provider,
    validated.options,
    session.user.id
  );
  
  return Response.json({ response });
}
```

### Streaming API Route

```typescript
// POST /api/ai/stream
export async function POST(req: NextRequest) {
  const session = await auth();
  const body = await req.json();
  
  const { prompt, provider, options } = body;
  
  const validated = GenerateTextSchema.parse({ prompt, provider, options });
  
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of aiService.streamText(
          validated.prompt,
          validated.provider,
          validated.options
        )) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ chunk })}\n\n`));
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      } catch (error) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: error.message })}\n\n`));
      } finally {
        controller.close();
      }
    },
  });
  
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
```

## Best Practices

### 1. Always Use Rate Limiting

```typescript
const allowed = await rateLimiter.checkLimit(providerName);
if (!allowed) {
  throw new Error('Rate limit exceeded');
}
```

### 2. Log All AI Requests

```typescript
await logger.logRequest({
  userId,
  provider,
  model,
  prompt,
  response,
  tokens,
  cost,
  duration,
});
```

### 3. Implement Fallback Strategy

```typescript
for (const providerName of fallbackOrder) {
  try {
    return await provider.generateText(prompt);
  } catch (error) {
    continue;
  }
}
```

### 4. Cache Responses When Appropriate

```typescript
const cached = await cache.getCachedResponse(prompt, model);
if (cached) return cached;
```

### 5. Estimate Costs Before Requests

```typescript
const cost = provider.estimateCost(prompt, model);
if (cost > budget) {
  throw new Error('Cost exceeds budget');
}
```

## Future Enhancements

### Custom Models

Support for fine-tuned models:

```typescript
class CustomModelProvider implements AIProvider {
  async generateText(prompt: string, options?: GenerationOptions): Promise<string> {
    // Use custom fine-tuned model
  }
}
```

### AI Chat Interface

Conversational AI with context:

```typescript
class AIChatService {
  private conversationHistory: Map<string, Message[]> = new Map();
  
  async sendMessage(userId: string, message: string): Promise<string> {
    const history = this.conversationHistory.get(userId) || [];
    history.push({ role: 'user', content: message });
    
    const response = await aiService.generateText(
      this.formatConversation(history),
      undefined,
      { model: 'gpt-4' }
    );
    
    history.push({ role: 'assistant', content: response });
    this.conversationHistory.set(userId, history);
    
    return response;
  }
}
```

### AI-Powered Search

Semantic search with AI:

```typescript
class AISearchService {
  async search(query: string, documents: Document[]): Promise<SearchResult[]> {
    // Use AI for semantic search
  }
}
```

## References

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Anthropic API Documentation](https://docs.anthropic.com)
- [Ollama Documentation](https://ollama.ai/docs)
- [AI Safety Guidelines](https://www.openai.com/safety)
