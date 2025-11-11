# TypeScript Scaffolding Code Systems Research

**Research Date:** 2025-11-11
**Timestamp:** 20251111141807
**Query:** How to write a scaffolding code system in TypeScript, what libraries to use

---

## Executive Summary

TypeScript scaffolding systems can be built using several approaches:

1. **Template-based generators** (Yeoman, Plop.js, Hygen) - Best for file/component generation
2. **AST manipulation** (ts-morph, TypeScript Compiler API) - Best for code generation
3. **Hybrid approaches** - Combining templates with programmatic code generation

The research identified ts-morph as the leading library for programmatic TypeScript code generation, while Plop.js and Hygen are favored for template-based scaffolding in modern TypeScript projects.

---

## Key Findings

### 1. AST-Based Code Generation (Recommended for Complex Scenarios)

**ts-morph** is the most recommended library for programmatic TypeScript code generation:

- **Library:** [ts-morph](https://github.com/dsherret/ts-morph)
- **Use Case:** When you need to generate, manipulate, or analyze TypeScript code programmatically
- **Advantages:**
  - High-level API over TypeScript Compiler API
  - Type-safe code generation
  - Active development and maintenance
  - Comprehensive documentation
  - Can read, modify, and write TypeScript files

**Example from research:**
```typescript
import {Project, Scope, SourceFile} from "ts-morph";

const project = new Project();
const sourceFile = project.createSourceFile(`./target/file.ts`);

const classDeclaration = sourceFile.addClass({
    name: 'SomeClass'
});

const constr = classDeclaration.addConstructor({});
constr.setBodyText('this.myProp = myProp');

classDeclaration.addProperty({
    name: 'myProp',
    type: 'string',
    initializer: 'hello world!'
});
```

**Source:** [StackOverflow - Is there code generation API for TypeScript?](https://stackoverflow.com/questions/36407154/is-there-code-generation-api-for-typescript)

### 2. Template-Based Scaffolding (Recommended for File/Project Generation)

#### Plop.js
- **Website:** [plopjs.com](https://plopjs.com/)
- **Best For:** JavaScript/TypeScript micro-generation, component creation
- **Advantages:**
  - Simple, focused API
  - Perfect for repetitive tasks (components, configs)
  - Favorite among frontend developers
  - Lightweight and fast

**Source:** [12 Scaffolding Tools - Resourcely](https://www.resourcely.io/post/12-scaffolding-tools)

#### Hygen
- **Website:** [hygen.io](https://www.hygen.io/)
- **Best For:** Automating repeatable code patterns
- **Advantages:**
  - Lightweight and fast
  - Developer-first design
  - Highly customizable
  - EJS-based templates
  - Can generate and modify existing files

**Sources:**
- [Medium - Writing a TypeScript Code Generator](https://medium.com/singapore-gds/writing-a-typescript-code-generator-templates-vs-ast-ab391e5d1f5e)
- [12 Scaffolding Tools - Resourcely](https://www.resourcely.io/post/12-scaffolding-tools)

#### Yeoman
- **Website:** [yeoman.io](https://yeoman.io/)
- **Best For:** Full project scaffolding, especially web apps
- **Advantages:**
  - Mature ecosystem with many generators
  - Cross-platform
  - Supports any programming language
  - Large community
- **Disadvantages:**
  - Complex for beginners
  - Can be time-consuming to set up custom generators
  - Not as actively maintained as newer alternatives

**Sources:**
- [Cookiecutter.io - Yeoman Alternative](https://www.cookiecutter.io/article-post/cookiecutter-alternatives)
- [StackShare - Yeoman Alternatives](https://stackshare.io/yeoman/alternatives)

### 3. Hybrid Approach (Templates + AST)

The Medium article "Writing a TypeScript Code Generator: Templates vs AST" suggests a balanced approach:

**When to use Templates:**
- Simple file generation
- Consistent boilerplate
- Straightforward patterns

**When to use AST:**
- Complex code transformations
- Dynamic type generation
- Code analysis and refactoring
- Type-safe code modifications

**Source:** [Medium - Templates vs AST](https://medium.com/singapore-gds/writing-a-typescript-code-generator-templates-vs-ast-ab391e5d1f5e)

---

## Popular Real-World Examples

### 1. TypeScript Project Scaffolding
**Project:** [typescript-project-scaffolding](https://github.com/Trickfilm400/typescript-project-scaffolding)
- NPM package: `create-typescript-project-scaffolding`
- Interactive CLI for generating TypeScript projects
- Supports multiple project types (Express API, WebSocket, npm package)
- Configurable dependencies (eslint, prettier, testing frameworks)
- Includes Docker, CI/CD templates

**Usage:**
```bash
npm init typescript-project-scaffolding@latest
```

### 2. Bystro
**Article:** [DEV.to - Template Scaffolding CLI](https://dev.to/n1stre/bystro-an-open-sourced-template-scaffolding-cli-util-built-with-typescript-and-clean-architecture-41gm)
- Built with TypeScript and Clean Architecture
- Open-source template scaffolding utility
- Demonstrates practical CLI implementation

---

## TypeScript Compiler API (Low-Level Alternative)

**When to use:** Maximum control over code generation, but requires more effort

The TypeScript package itself provides all tools needed to:
- Assemble an AST of typings and/or code
- Emit TypeScript code from AST

**Recommendation:** Use ts-morph instead unless you need very specific low-level control. Original askers confirmed they ended up using ts-morph after trying the raw TypeScript Compiler API because it was "too low level."

**Source:** [Reddit - General TypeScript Codegen Library](https://www.reddit.com/r/typescript/comments/1boxj2u/general_typescript_codegen_library/)

---

## Template Engines for TypeScript

### EJS (Embedded JavaScript)
- Used by Hygen
- JavaScript-based templating
- Simple syntax for loops, conditionals

### Handlebars
- Logic-less templates
- Clean separation of code and templates

### Custom String Templates
While tempting for simple cases, string manipulation approaches are generally discouraged:
```typescript
// NOT RECOMMENDED for complex scenarios
function generateClass(name: string) {
    return [
        `export class ${pascalCase(name)}Api implements ICredentialType {`,
        `  name = '${camelCase(name)}Api';`,
        `}`,
    ].join('\n');
}
```

**Issues:** Fragile, hard to maintain, doesn't scale with complexity

**Source:** [Medium - Templates vs AST](https://medium.com/singapore-gds/writing-a-typescript-code-generator-templates-vs-ast-ab391e5d1f5e)

---

## Architectural Recommendations

### For Simple Component/File Generation
**Stack:** Plop.js or Hygen + EJS templates
- Quick setup
- Easy to maintain
- Good for teams

### For Complex Code Generation
**Stack:** ts-morph + custom logic
- Type-safe
- Robust
- Maintainable at scale

### For Full Project Scaffolding
**Options:**
1. **Yeoman** - If you need the mature ecosystem
2. **Custom npm init script** - Like `create-typescript-project-scaffolding`
3. **Plop.js/Hygen** - For lighter-weight solutions

---

## Development Workflow Integration

From "EASY Typescript project setup" article, common setup includes:
- Prettier
- ESLint
- TypeScript
- Nodemon
- Dotenv

**Source:** [Level Up Coding - TypeScript Setup](https://levelup.gitconnected.com/easy-typescript-project-setup-89088bc705e7)

---

## Additional Tools Worth Noting

### Yellicode
- Not web-based but lightweight
- Template-driven
- Uses JavaScript/TypeScript for templates
- Accepts any JSON file as input

**Source:** [StackOverflow - Code/Text Generation Tools](https://stackoverflow.com/questions/54893199/what-is-a-good-tool-for-code-text-generation)

### Telosys
- Code generator working with templates
- Uses Velocity templating engine
- Entity-based approach
- Supports project variables

**Source:** [StackOverflow - Code/Text Generation Tools](https://stackoverflow.com/questions/54893199/what-is-a-good-tool-for-code-text-generation)

---

## Decision Matrix

| Use Case | Recommended Tool | Why |
|----------|-----------------|-----|
| Component generation (React, Vue) | Plop.js | Simple, focused, frontend-friendly |
| Route/service generation | Hygen | Fast, good for backend patterns |
| Full project scaffolding | Custom npm init or Yeoman | Complete project setup |
| Dynamic type generation | ts-morph | Type-safe, robust |
| Code analysis/transformation | ts-morph | High-level API, well-maintained |
| Simple boilerplate | Templates (EJS/Handlebars) | Easy to understand |

---

## Community Resources

### GitHub Awesome Lists
- [awesome-typescript](https://github.com/dzharii/awesome-typescript) - Curated list includes code generation tools
- Large collection of TypeScript resources
- Includes MicroTS - Microservice code generator with OpenAPI support

**Source:** [GitHub - awesome-typescript](https://github.com/dzharii/awesome-typescript)

### Helpful Tools
- [TypeScript AST Viewer](https://ts-ast-viewer.com/) - Visualize TypeScript AST
- [AST Explorer](https://astexplorer.net/) - General AST exploration

**Source:** [Medium - TypeScript Code Generator References](https://medium.com/singapore-gds/writing-a-typescript-code-generator-templates-vs-ast-ab391e5d1f5e)

---

## Implementation Strategy

### Phase 1: Choose Your Approach
1. **Simple templates** → Plop.js or Hygen
2. **Code generation** → ts-morph
3. **Full scaffolding** → Custom npm init script

### Phase 2: Set Up Core Infrastructure
- CLI framework (Commander.js, Yargs)
- Template engine (if using templates)
- File system utilities

### Phase 3: Build Generators
- Define templates or AST builders
- Add validation
- Implement dry-run mode

### Phase 4: Testing
- Unit tests for generators
- Integration tests for file output
- Example: Yeoman supports writing unit tests on generated files

### Phase 5: Distribution
- NPM package
- `npm init` compatibility
- Documentation

---

## Key Takeaways

1. **ts-morph is the gold standard** for programmatic TypeScript code generation
2. **Plop.js and Hygen** are modern favorites for template-based scaffolding
3. **Yeoman is mature but heavy** - consider lighter alternatives for new projects
4. **Hybrid approach** (templates + AST) offers best of both worlds
5. **String concatenation** is fragile - avoid for complex scenarios
6. **Community consensus**: Use higher-level tools (ts-morph) over raw TypeScript Compiler API

---

## References

1. [StackOverflow - Is there code generation API for TypeScript?](https://stackoverflow.com/questions/36407154/is-there-code-generation-api-for-typescript)
2. [Medium - Writing a TypeScript Code Generator: Templates vs AST](https://medium.com/singapore-gds/writing-a-typescript-code-generator-templates-vs-ast-ab391e5d1f5e)
3. [GitHub - typescript-project-scaffolding](https://github.com/Trickfilm400/typescript-project-scaffolding)
4. [Hygen Official Site](https://www.hygen.io/)
5. [Plop.js Official Site](https://plopjs.com/)
6. [Yeoman Official Site](https://yeoman.io/)
7. [Resourcely - 12 Scaffolding Tools](https://www.resourcely.io/post/12-scaffolding-tools)
8. [Cookiecutter - Project Templating Tools Comparison](https://www.cookiecutter.io/article-post/cookiecutter-alternatives)
9. [Level Up Coding - TypeScript Setup](https://levelup.gitconnected.com/easy-typescript-project-setup-89088bc705e7)
10. [GitHub - awesome-typescript](https://github.com/dzharii/awesome-typescript)
11. [Reddit - General TypeScript Codegen Library](https://www.reddit.com/r/typescript/comments/1boxj2u/general_typescript_codegen_library/)
12. [Reddit - What's up with Yeoman?](https://www.reddit.com/r/node/comments/16m7rrr/whats_up_with_yeoman/)
13. [StackOverflow - Code/Text Generation Tools](https://stackoverflow.com/questions/54893199/what-is-a-good-tool-for-code-text-generation)
14. [StackShare - Yeoman Alternatives](https://stackshare.io/yeoman/alternatives)
15. [DEV.to - Bystro Template Scaffolding CLI](https://dev.to/n1stre/bystro-an-open-sourced-template-scaffolding-cli-util-built-with-typescript-and-clean-architecture-41gm)
