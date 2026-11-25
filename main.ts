// Fortune Cookie for the Liquidated Trader — a make.fun entry.
// One funny fortune-cookie line for a liquidated crypto trader, written to /output/entry.txt.
// Deterministic: the same bytes on every run. No network, no clock, no random.
import { chmodSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

const FORTUNE =
  "The stars went 100x long on you, trader — and like you, they are now eating this cookie.";

const MAX_CHARS = 160;
const MAX_WORDS = 20;

function countCodePoints(text: string): number {
  return [...text].length;
}

function assertGate(text: string): void {
  const chars = countCodePoints(text);
  if (chars < 1 || chars > MAX_CHARS) {
    throw new Error(`fortune must be 1-${MAX_CHARS} characters, got ${chars}`);
  }
  const words = text.trim().split(/\s+/).length;
  if (words > MAX_WORDS) {
    throw new Error(`fortune must be at most ${MAX_WORDS} words, got ${words}`);
  }
  if (text.trim().length === 0) {
    throw new Error("fortune must not be whitespace only");
  }
  for (const ch of text) {
    const code = ch.codePointAt(0) ?? 0;
    if (code < 0x20 && ch !== "\n" && ch !== "\t") {
      throw new Error("fortune must not contain control characters");
    }
    if (code === 0x00a0 || code === 0x200b) {
      throw new Error("fortune must not contain invisible whitespace");
    }
  }
}

function main(): void {
  assertGate(FORTUNE);
  mkdirSync("/output", { recursive: true });
  writeFileSync("/output/entry.txt", FORTUNE, "utf8");
  chmodSync("/output/entry.txt", 0o644);
  // Read the file back: the entry only counts if what landed on disk is
  // byte-identical to the fortune we gated above.
  const landed = readFileSync("/output/entry.txt", "utf8");
  if (landed !== FORTUNE) {
    throw new Error("read-back mismatch: /output/entry.txt differs from FORTUNE");
  }
}

main();
// The stars bet on the trader too — and lost with him.
