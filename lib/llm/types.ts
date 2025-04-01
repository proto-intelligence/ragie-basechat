// Single source of truth for providers and their models
export const PROVIDER_CONFIG = {
  openai: {
    models: ["gpt-4o", "gpt-3.5-turbo"] as const,
    logo: "/openai.svg",
    displayNames: {
      "gpt-4o": "GPT-4o",
      "gpt-3.5-turbo": "GPT-3.5 Turbo",
    } as const,
  },
  google: {
    models: ["gemini-2.0-flash", "gemini-1.5-pro"] as const,
    logo: "/gemini.svg",
    displayNames: {
      "gemini-2.0-flash": "Gemini 2.0 Flash",
      "gemini-1.5-pro": "Gemini 1.5 Pro",
    } as const,
  },
  anthropic: {
    models: ["claude-3-7-sonnet-latest", "claude-3-5-haiku-latest"] as const,
    logo: "/anthropic.svg",
    displayNames: {
      "claude-3-7-sonnet-latest": "Claude 3.7 Sonnet",
      "claude-3-5-haiku-latest": "Claude 3.5 Haiku",
    } as const,
  },
} as const;

// Default values
// If adding a new provider, update app/api/conversations/[conversationId]/messages/utils.ts using the vercel ai-sdk
// If changing the DEFAULT_NAMING_MODEL, update createConversationName in app/api/conversations/[conversationId]/messages/utils.ts to use appropriate provider
export const DEFAULT_MODEL = "claude-3-7-sonnet-latest";
export const DEFAULT_PROVIDER = "anthropic";
export const DEFAULT_NAMING_MODEL = "gpt-4o-mini";

// Derive types from the config
export type LLMProvider = keyof typeof PROVIDER_CONFIG;

// Create a string literal union type for all currently supported models
// This provides autocomplete and type checking during development
export type SupportedModelName = (typeof PROVIDER_CONFIG)[LLMProvider]["models"][number];

// List of all currently valid model names for validation
export const ALL_VALID_MODELS = Object.values(PROVIDER_CONFIG).flatMap((config) => config.models) as string[];

// Checks if a model name is currently supported
export function isValidModel(model: string): model is SupportedModelName {
  return ALL_VALID_MODELS.includes(model);
}

export function getProviderForModel(model: string): LLMProvider | null {
  for (const [provider, config] of Object.entries(PROVIDER_CONFIG)) {
    if ((config.models as readonly string[]).includes(model)) {
      return provider as LLMProvider;
    }
  }
  return null;
}

// Logo mapping
export const LLM_LOGO_MAP: Record<string, [string, string]> = {};
ALL_VALID_MODELS.forEach((model) => {
  const provider = getProviderForModel(model);
  if (provider) {
    LLM_LOGO_MAP[model] = [model, PROVIDER_CONFIG[provider].logo];
  }
});

// Display name mapping
export const LLM_DISPLAY_NAMES: Record<string, string> = {};
ALL_VALID_MODELS.forEach((model) => {
  const provider = getProviderForModel(model);
  if (provider && Object.prototype.hasOwnProperty.call(PROVIDER_CONFIG[provider].displayNames, model)) {
    LLM_DISPLAY_NAMES[model] =
      PROVIDER_CONFIG[provider].displayNames[model as keyof (typeof PROVIDER_CONFIG)[typeof provider]["displayNames"]];
  } else {
    // Fallback for unknown models
    LLM_DISPLAY_NAMES[model] = model;
  }
});
