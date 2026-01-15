/**
 * EKKA Protocol Contracts - TypeScript Types
 * AUTO-GENERATED. Do not edit manually.
 */

// From common/error.schema.json
/**
 * Structured error response payload
 */
export interface ErrorPayload {
  /**
   * Error category
   */
  kind:
    | 'not_found'
    | 'invalid_input'
    | 'crypto_error'
    | 'io_error'
    | 'serde_error'
    | 'queue_error'
    | 'lease_invalid'
    | 'vault_error'
    | 'internal';
  /**
   * Whether the operation can be retried
   */
  retryable: boolean;
  /**
   * Human-readable error message for end users
   */
  user_message: string;
  /**
   * Detailed error message for debugging
   */
  debug_message: string;
  /**
   * Request correlation ID for tracing
   */
  correlation_id?: string;
}


// From protocol/envelope.schema.json
/**
 * Standard API response envelope wrapping success or error
 */
export type ResponseEnvelope = SuccessEnvelope | ErrorEnvelope;

export interface SuccessEnvelope {
  ok: true;
  /**
   * Response payload (type varies by endpoint)
   */
  data: {
    [k: string]: unknown;
  };
}
export interface ErrorEnvelope {
  ok: false;
  error: ErrorPayload;
}
/**
 * Structured error response payload
 */
export interface ErrorPayload {
  /**
   * Error category
   */
  kind:
    | 'not_found'
    | 'invalid_input'
    | 'crypto_error'
    | 'io_error'
    | 'serde_error'
    | 'queue_error'
    | 'lease_invalid'
    | 'vault_error'
    | 'internal';
  /**
   * Whether the operation can be retried
   */
  retryable: boolean;
  /**
   * Human-readable error message for end users
   */
  user_message: string;
  /**
   * Detailed error message for debugging
   */
  debug_message: string;
  /**
   * Request correlation ID for tracing
   */
  correlation_id?: string;
}


// From protocol/intent.request.schema.json
/**
 * Request to submit an intent for processing
 */
export interface IntentRequest {
  /**
   * Operation identifier (e.g., 'file.write', 'test.echo')
   */
  op: string;
  /**
   * Operation-specific payload data
   */
  payload: {
    [k: string]: unknown;
  };
  /**
   * Optional AI provider/model override
   */
  ai_override?: {
    /**
     * AI provider to use (e.g., 'openai', 'claude')
     */
    provider?: string;
    /**
     * AI model to use (e.g., 'gpt-4', 'claude-3')
     */
    model?: string;
  };
}


// From protocol/intent.result.schema.json
/**
 * Result of intent processing
 */
export interface IntentResult {
  /**
   * Unique identifier for this intent
   */
  intent_id: string;
  /**
   * Correlation ID for request tracing
   */
  correlation_id: string;
  /**
   * Final decision outcome
   */
  decision: 'ALLOW' | 'BLOCK' | 'ESCALATE';
  /**
   * Intent processing status
   */
  status: 'received' | 'policy_resolved' | 'preflight_completed' | 'decided' | 'accepted' | 'denied' | 'escalated';
  /**
   * AI provider/model actually used
   */
  ai_used?: {
    /**
     * AI provider used
     */
    provider: string;
    /**
     * AI model used
     */
    model: string;
  };
  /**
   * Human-readable reason for decision (if applicable)
   */
  reason?: string;
}


// From protocol/event.stream.schema.json
/**
 * Discriminated union of pipeline events
 */
export type PipelineEvent = IntentReceivedEvent | PolicyResolvedEvent | PreflightCompletedEvent | IntentDecidedEvent;

export interface IntentReceivedEvent {
  type: 'intent_received';
  intent_id: string;
  correlation_id: string;
  /**
   * Operation identifier
   */
  op: string;
  timestamp: string;
}
export interface PolicyResolvedEvent {
  type: 'policy_resolved';
  intent_id: string;
  correlation_id: string;
  policy_source:
    | 'default'
    | {
        bundle: {
          bundle_id: string;
          version: string;
        };
      };
  timestamp: string;
}
export interface PreflightCompletedEvent {
  type: 'preflight_completed';
  intent_id: string;
  correlation_id: string;
  /**
   * Advisor that processed the preflight
   */
  advisor_id: string;
  decision: 'ALLOW' | 'BLOCK' | 'ESCALATE';
  confidence: number;
  timestamp: string;
}
export interface IntentDecidedEvent {
  type: 'intent_decided';
  intent_id: string;
  correlation_id: string;
  decision: 'ALLOW' | 'BLOCK' | 'ESCALATE';
  /**
   * Reason for decision
   */
  reason: string | null;
  timestamp: string;
}


// From governance/policy.profile.schema.json
/**
 * Policy profile configuration for an operation
 */
export interface PolicyProfile {
  /**
   * Operation this profile applies to (e.g., 'file.write', 'test.echo')
   */
  op: string;
  preflight: FlightConfig;
  postflight: FlightConfig1;
  /**
   * Default AI provider/model settings
   */
  ai_defaults: {
    /**
     * Default AI provider
     */
    provider: string;
    /**
     * Default AI model
     */
    model: string;
  };
  /**
   * Decision confidence thresholds
   */
  thresholds: {
    /**
     * Minimum confidence for ALLOW
     */
    allow_min: number;
    /**
     * Confidence below which to ESCALATE
     */
    escalate_below: number;
  };
  /**
   * Whether user can override AI settings
   */
  allow_overrides: boolean;
  /**
   * Fallback behavior when advisor fails
   */
  fallback: 'allow' | 'block' | 'escalate';
}
/**
 * Preflight advisor configuration
 */
export interface FlightConfig {
  /**
   * Whether this flight stage is enabled
   */
  enabled: boolean;
  /**
   * Advisor ID to use (e.g., 'stub.allow', 'llm.claude')
   */
  advisor_id: string;
}
/**
 * Postflight advisor configuration
 */
export interface FlightConfig1 {
  /**
   * Whether this flight stage is enabled
   */
  enabled: boolean;
  /**
   * Advisor ID to use (e.g., 'stub.allow', 'llm.claude')
   */
  advisor_id: string;
}


// From vault/bundle.manifest.schema.json
/**
 * Manifest file for a vault bundle
 */
export interface BundleManifest {
  /**
   * Unique identifier for this bundle
   */
  bundle_id: string;
  /**
   * SemVer version string
   */
  version: string;
  /**
   * ISO 8601 timestamp when bundle was created
   */
  created_at: string;
}


// From vault/resolved.policy.schema.json
/**
 * Resolved policy profile with source information
 */
export interface ResolvedPolicy {
  profile: PolicyProfile;
  /**
   * Source of the resolved policy
   */
  source: {
    /**
     * Bundle ID that provided this policy
     */
    bundle_id: string;
    /**
     * Bundle version
     */
    version: string;
  };
}
/**
 * The resolved policy profile
 */
export interface PolicyProfile {
  /**
   * Operation this profile applies to (e.g., 'file.write', 'test.echo')
   */
  op: string;
  preflight: FlightConfig;
  postflight: FlightConfig1;
  /**
   * Default AI provider/model settings
   */
  ai_defaults: {
    /**
     * Default AI provider
     */
    provider: string;
    /**
     * Default AI model
     */
    model: string;
  };
  /**
   * Decision confidence thresholds
   */
  thresholds: {
    /**
     * Minimum confidence for ALLOW
     */
    allow_min: number;
    /**
     * Confidence below which to ESCALATE
     */
    escalate_below: number;
  };
  /**
   * Whether user can override AI settings
   */
  allow_overrides: boolean;
  /**
   * Fallback behavior when advisor fails
   */
  fallback: 'allow' | 'block' | 'escalate';
}
/**
 * Preflight advisor configuration
 */
export interface FlightConfig {
  /**
   * Whether this flight stage is enabled
   */
  enabled: boolean;
  /**
   * Advisor ID to use (e.g., 'stub.allow', 'llm.claude')
   */
  advisor_id: string;
}
/**
 * Postflight advisor configuration
 */
export interface FlightConfig1 {
  /**
   * Whether this flight stage is enabled
   */
  enabled: boolean;
  /**
   * Advisor ID to use (e.g., 'stub.allow', 'llm.claude')
   */
  advisor_id: string;
}
