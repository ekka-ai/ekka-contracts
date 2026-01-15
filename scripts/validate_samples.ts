/**
 * Validate sample files against JSON schemas
 */

import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

// Initialize AJV with formats
const ajv = new Ajv({
  strict: false,
  allErrors: true,
  verbose: true,
});
addFormats(ajv);

// Load all schemas
function loadSchemas(): void {
  const schemaFiles = [
    'common/error.schema.json',
    'protocol/envelope.schema.json',
    'protocol/intent.request.schema.json',
    'protocol/intent.result.schema.json',
    'protocol/event.stream.schema.json',
    'governance/policy.profile.schema.json',
    'vault/bundle.manifest.schema.json',
    'vault/resolved.policy.schema.json',
  ];

  for (const file of schemaFiles) {
    const schema = JSON.parse(readFileSync(join(rootDir, file), 'utf-8'));
    ajv.addSchema(schema);
    console.log(`✓ Loaded schema: ${file}`);
  }
}

// Validate a single JSON file
function validateFile(filePath: string, schemaId: string): boolean {
  const data = JSON.parse(readFileSync(filePath, 'utf-8'));
  const validate = ajv.getSchema(schemaId);

  if (!validate) {
    console.error(`✗ Schema not found: ${schemaId}`);
    return false;
  }

  const valid = validate(data);
  if (valid) {
    console.log(`✓ Valid: ${filePath}`);
    return true;
  } else {
    console.error(`✗ Invalid: ${filePath}`);
    console.error(JSON.stringify(validate.errors, null, 2));
    return false;
  }
}

// Validate JSONL file (each line against schema)
function validateJsonl(filePath: string, schemaId: string): boolean {
  const content = readFileSync(filePath, 'utf-8');
  const lines = content.trim().split('\n');
  const validate = ajv.getSchema(schemaId);

  if (!validate) {
    console.error(`✗ Schema not found: ${schemaId}`);
    return false;
  }

  let allValid = true;
  for (let i = 0; i < lines.length; i++) {
    const data = JSON.parse(lines[i]);
    const valid = validate(data);
    if (!valid) {
      console.error(`✗ Invalid line ${i + 1} in ${filePath}`);
      console.error(JSON.stringify(validate.errors, null, 2));
      allValid = false;
    }
  }

  if (allValid) {
    console.log(`✓ Valid: ${filePath} (${lines.length} events)`);
  }
  return allValid;
}

// Main
function main(): void {
  console.log('=== Loading schemas ===\n');
  loadSchemas();

  console.log('\n=== Validating samples ===\n');

  const results: boolean[] = [];

  // Validate intent success (envelope with IntentResult)
  results.push(validateFile(
    join(rootDir, 'samples/intent_success.json'),
    'https://schemas.ekka.ai/protocol/envelope.schema.json'
  ));

  // Validate intent error (envelope with error)
  results.push(validateFile(
    join(rootDir, 'samples/intent_error.json'),
    'https://schemas.ekka.ai/protocol/envelope.schema.json'
  ));

  // Validate events JSONL
  results.push(validateJsonl(
    join(rootDir, 'samples/events_tail.jsonl'),
    'https://schemas.ekka.ai/protocol/event.stream.schema.json'
  ));

  console.log('\n=== Summary ===\n');

  const passed = results.filter(r => r).length;
  const failed = results.length - passed;

  console.log(`Passed: ${passed}/${results.length}`);

  if (failed > 0) {
    console.error(`Failed: ${failed}`);
    process.exit(1);
  }

  console.log('\n✓ All validations passed!');
}

main();
