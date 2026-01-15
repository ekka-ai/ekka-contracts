# EKKA Protocol Specification

Version: 0.1.0

## Overview

This document defines the wire protocol for EKKA clients. All schemas use JSON Schema draft 2020-12.

## Schema Locations

All schemas are published at `https://schemas.ekka.ai/<folder>/<file>`.

## Response Envelope

All API responses use a standard envelope:

```json
// Success
{ "ok": true, "data": <T> }

// Error
{ "ok": false, "error": { "kind": "...", "retryable": false, "user_message": "...", "debug_message": "..." } }
```

## Decision Values

Decisions are always uppercase strings:

- `ALLOW` - Intent approved for execution
- `BLOCK` - Intent denied
- `ESCALATE` - Intent requires human review

## Intent Pipeline Events

Events are emitted as JSONL (one JSON object per line). Each event has a `type` discriminator:

| Type | Description |
|------|-------------|
| `intent_received` | Intent submitted to pipeline |
| `policy_resolved` | Policy profile resolved (bundle or default) |
| `preflight_completed` | Preflight advisor completed |
| `intent_decided` | Final decision made |

## Policy Sources

Policy can come from:

- **Bundle**: `{ "bundle": { "bundle_id": "...", "version": "..." } }`
- **Default**: `"default"`

## Versioning

This contract follows SemVer:

- **MAJOR**: Breaking changes to schema structure
- **MINOR**: New optional fields, new event types
- **PATCH**: Documentation, fixes that don't change wire format

## Compatibility

Clients MUST:

- Ignore unknown fields in responses
- Handle all enum values (including future additions gracefully)
- Validate against schemas before sending requests
