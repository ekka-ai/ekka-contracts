import { compileFromFile } from 'json-schema-to-typescript';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTPUT_DIR = path.join(__dirname, '..', 'generated', 'ts');

async function generateTypes() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const schemas = [
    { file: 'common/error.schema.json', name: 'ErrorPayload' },
    { file: 'protocol/envelope.schema.json', name: 'ResponseEnvelope' },
    { file: 'protocol/intent.request.schema.json', name: 'IntentRequest' },
    { file: 'protocol/intent.result.schema.json', name: 'IntentResult' },
    { file: 'protocol/event.stream.schema.json', name: 'PipelineEvent' },
    { file: 'governance/policy.profile.schema.json', name: 'PolicyProfile' },
    { file: 'vault/bundle.manifest.schema.json', name: 'BundleManifest' },
    { file: 'vault/resolved.policy.schema.json', name: 'ResolvedPolicy' },
  ];

  const allTypes: string[] = [];

  for (const schema of schemas) {
    const schemaPath = path.join(__dirname, '..', schema.file);
    try {
      const ts = await compileFromFile(schemaPath, {
        bannerComment: '',
        style: { semi: true, singleQuote: true },
      });
      allTypes.push('// From ' + schema.file + '\n' + ts);
    } catch (err) {
      console.error('Failed to compile ' + schema.file + ':', err);
    }
  }

  const header = '/**\n * EKKA Protocol Contracts - TypeScript Types\n * AUTO-GENERATED. Do not edit manually.\n */\n\n';
  const combined = header + allTypes.join('\n\n');
  fs.writeFileSync(path.join(OUTPUT_DIR, 'types.ts'), combined);

  const index = 'export * from "./types.js";\n\nexport const Decision = {\n  ALLOW: "ALLOW" as const,\n  BLOCK: "BLOCK" as const,\n  ESCALATE: "ESCALATE" as const,\n};\n\nexport type DecisionType = typeof Decision[keyof typeof Decision];\n\nexport const ErrorKind = {\n  NotFound: "not_found" as const,\n  InvalidInput: "invalid_input" as const,\n  CryptoError: "crypto_error" as const,\n  IoError: "io_error" as const,\n  SerdeError: "serde_error" as const,\n  QueueError: "queue_error" as const,\n  LeaseInvalid: "lease_invalid" as const,\n  VaultError: "vault_error" as const,\n  Internal: "internal" as const,\n};\n\nexport type ErrorKindType = typeof ErrorKind[keyof typeof ErrorKind];\n';
  fs.writeFileSync(path.join(OUTPUT_DIR, 'index.ts'), index);
  console.log('Generated types in ' + OUTPUT_DIR);
}

generateTypes().catch(console.error);
