# ekka-contracts

EKKA Protocol Contracts - JSON Schemas and TypeScript types for the EKKA wire protocol.

## Installation

```bash
npm install @ekka/contracts
```

## Usage

### TypeScript Types

```typescript
import type {
  IntentRequest,
  IntentResult,
  PipelineEvent,
  PolicyProfile,
  ErrorPayload,
} from '@ekka/contracts';

const request: IntentRequest = {
  op: 'file.write',
  payload: { path: '/tmp/test.txt', content: 'hello' },
  ai_override: { provider: 'openai', model: 'gpt-4' },
};
```

### JSON Schema Validation

Schemas are available at runtime:

```typescript
import Ajv from 'ajv';
import intentResultSchema from '@ekka/contracts/protocol/intent.result.schema.json';

const ajv = new Ajv();
const validate = ajv.compile(intentResultSchema);
```

## Schema URLs

All schemas are published at `https://schemas.ekka.ai/`:

| Schema | URL |
|--------|-----|
| Error | `https://schemas.ekka.ai/common/error.schema.json` |
| Envelope | `https://schemas.ekka.ai/protocol/envelope.schema.json` |
| Intent Request | `https://schemas.ekka.ai/protocol/intent.request.schema.json` |
| Intent Result | `https://schemas.ekka.ai/protocol/intent.result.schema.json` |
| Event Stream | `https://schemas.ekka.ai/protocol/event.stream.schema.json` |
| Policy Profile | `https://schemas.ekka.ai/governance/policy.profile.schema.json` |
| Bundle Manifest | `https://schemas.ekka.ai/vault/bundle.manifest.schema.json` |
| Resolved Policy | `https://schemas.ekka.ai/vault/resolved.policy.schema.json` |

## Development

### Validate Samples

```bash
npm install
npm run validate
```

### Generate TypeScript Types

```bash
npm run generate:types
```

### Build (validate + generate)

```bash
npm run build
```

## Directory Structure

```
ekka-contracts/
├── protocol/           # Wire protocol schemas
│   ├── envelope.schema.json
│   ├── intent.request.schema.json
│   ├── intent.result.schema.json
│   └── event.stream.schema.json
├── governance/         # Policy configuration
│   └── policy.profile.schema.json
├── vault/              # Bundle management
│   ├── bundle.manifest.schema.json
│   └── resolved.policy.schema.json
├── common/             # Shared types
│   └── error.schema.json
├── samples/            # Example payloads
├── scripts/            # Build tools
└── generated/ts/       # Generated TypeScript
```

## Versioning

This package follows [SemVer](https://semver.org/):

- **MAJOR**: Breaking schema changes
- **MINOR**: New optional fields, new event types
- **PATCH**: Documentation, non-breaking fixes

## License

MIT
