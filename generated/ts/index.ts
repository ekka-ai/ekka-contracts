export * from "./types.js";

export const Decision = {
  ALLOW: "ALLOW" as const,
  BLOCK: "BLOCK" as const,
  ESCALATE: "ESCALATE" as const,
};

export type DecisionType = typeof Decision[keyof typeof Decision];

export const ErrorKind = {
  NotFound: "not_found" as const,
  InvalidInput: "invalid_input" as const,
  CryptoError: "crypto_error" as const,
  IoError: "io_error" as const,
  SerdeError: "serde_error" as const,
  QueueError: "queue_error" as const,
  LeaseInvalid: "lease_invalid" as const,
  VaultError: "vault_error" as const,
  Internal: "internal" as const,
};

export type ErrorKindType = typeof ErrorKind[keyof typeof ErrorKind];
