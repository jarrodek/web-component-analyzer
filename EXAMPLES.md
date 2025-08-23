# Examples

This file contains more detailed examples of how to use the programmatic API of `web-component-analyzer`.

## Analyzing a single file

This example shows how to analyze a single file.

```typescript
import { analyzeText } from "web-component-analyzer";

const code = `
import { LitElement, html, customElement, property } from "lit-element";

@customElement("my-element")
export class MyElement extends LitElement {
  @property({ type: String })
  name = "World";

  render() {
    return html\`<h1>Hello, \${this.name}</h1>\`;
  }
}
`;

const { results, program } = analyzeText(code);

console.log(results[0].componentDefinitions[0].tagName); // my-element
```

## Analyzing multiple files

This example shows how to analyze multiple files that depend on each other.

```typescript
import { analyzeText } from "web-component-analyzer";

const files = [
  {
    fileName: "my-element.ts",
    text: `
      import { LitElement, html, customElement, property } from "lit-element";
      import { MyOtherElement } from "./my-other-element.js";

      @customElement("my-element")
      export class MyElement extends LitElement {
        @property({ type: String })
        name = "World";

        render() {
          return html\`
            <h1>Hello, \${this.name}</h1>
            <my-other-element></my-other-element>
          \`;
        }
      }
    `,
  },
  {
    fileName: "my-other-element.ts",
    text: `
      import { LitElement, html, customElement } from "lit-element";

      @customElement("my-other-element")
      export class MyOtherElement extends LitElement {
        render() {
          return html\`<p>I'm the other element</p>\`;
        }
      }
    `,
  },
];

const { results, program } = analyzeText(files);

console.log(results[0].componentDefinitions[0].tagName); // my-element
console.log(results[1].componentDefinitions[0].tagName); // my-other-element
```

## Transforming the result

This example shows how to transform the result to different formats.

```typescript
import { analyzeText, transformAnalyzerResult } from "web-component-analyzer";

const code = `
import { LitElement, html, customElement, property } from "lit-element";

@customElement("my-element")
export class MyElement extends LitElement {
  @property({ type: String })
  name = "World";

  render() {
    return html\`<h1>Hello, \${this.name}</h1>\`;
  }
}
`;

const { results, program } = analyzeText(code);

const markdown = transformAnalyzerResult("markdown", results, program);
const json = transformAnalyzerResult("json", results, program);
const vscode = transformAnalyzerResult("vscode", results, program);

console.log(markdown);
console.log(json);
console.log(vscode);
```

## Using a custom TypeScript configuration

This example shows how to use a custom TypeScript configuration.

```typescript
import { analyzeText } from "web-component-analyzer";
import ts from "typescript";

const code = `
import { LitElement, html, customElement, property } from "lit-element";

@customElement("my-element")
export class MyElement extends LitElement {
  @property({ type: String })
  name = "World";

  render() {
    return html\`<h1>Hello, \${this.name}</h1>\`;
  }
}
`;

const { results, program } = analyzeText(code, {
  ts,
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ESNext,
    allowJs: true,
    sourceMap: false,
    strictNullChecks: true,
  },
});

console.log(results[0].componentDefinitions[0].tagName); // my-element
```
