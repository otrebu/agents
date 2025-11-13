
🔍 Parallel Search

Search Configuration:
  Objective: "Best practices for implementing a CLI in TypeScript"
  Queries: 5
    1. "TypeScript CLI architecture patterns"
    2. "CLI argument parsing libraries Node.js"
    3. "TypeScript CLI error handling"
    4. "CLI user experience design"
    5. "TypeScript CLI testing strategies"
  Processor: pro (default)
  Max Results: 15 (default)
  Max Chars: 5000 (default)

- Searching...
✔ Found 15 results

# Parallel Search Results

**Query:** Best practices for implementing a CLI in TypeScript
**Results:** 15
**Execution:** 0.7s

**Top Domains:**
- medium.com: 3 results (20%)
- stackoverflow.com: 2 results (13%)
- refactoring.guru: 1 results (7%)
- www.typescriptlang.org: 1 results (7%)
- www.joshcanhelp.com: 1 results (7%)

---

## 1. [Creating a CLI with TypeScript](https://medium.com/rubber-ducking/creating-a-cli-with-typescript-1c5112ae101f)

**URL:** https://medium.com/rubber-ducking/creating-a-cli-with-typescript-1c5112ae101f
**Domain:** medium.com

**Excerpt:**

Last updated: 20190414
in](/m/signin?operation=login&redirect=https%3A%2F%2Fmedium.com%2Frubber-ducking%2Fcreating-a-cli-with-typescript-1c5112ae101f&source=post_page---top_nav_layout_nav-----------------------global_nav------------------)

[## Rubber Ducking](https://medium.com/rubber-ducking?source=post_page---publication_nav-2b47c8d7e9d3-1c5112ae101f---------------------------------------)

·

[](https://medium.com/rubber-ducking?source=post_page---post_publication_sidebar-2b47c8d7e9d3-1c5112ae101f---------------------------------------)

Thoughts on React, TypeScript, JavaScript, Design Systems and all things frontend.
 ... 
Considering `typed-scss-modules` is a tool for generating TypeScript type definitions, it seemed fit to also be written in TypeScript. But where to start? # 📦 Getting Started

After searching around and also digging through various packages that offered executables the packages below were the most helpful when creating a TypeScript command-line npm package. ## Core Tooling

Some of this tooling is specific to TypeScript, but the majority of this is useful for any npm package that includes an executable for doing things like creating the CLI options or printing formatted output. * `ts-node` : [TypeScript Node](https://github.com/TypeStrong/ts-node) is used to execute TypeScript. This is useful in development to run the CLI without needing to build anything.
Adding a custom script to `package.json` with the same name will enable executing the script the similarily during development and in the published version. For example, adding `"my-script": "ts-node ./lib/cli.ts"` to the `package.json` `scripts` property will running it with `yarn my-script` or `npm run my-script` . * `yargs` : [Yargs](http://yargs.js.org/) helps build interactive command line tools, by parsing arguments and generating a user interface. There are also other packages like [commander.js](https://github.com/tj/commander.js) that can be used for this as well. On an unrelated note, the type definitions for yargs ( `[@types/yargs](https://www.npmjs.com/package/@types/yargs)` ) are impressive.
 ... 
See [this post for more details](/rubber-ducking/generating-typescript-definitions-for-css-modules-using-sass-461e33623ec2) . ## Additional Tooling

There were some additional packages that were helpful when creating `typed-scss-modules` but may not be as useful depending on the purpose of the CLI. * `glob` : [Glob](https://github.com/isaacs/node-glob) is useful for matching files using patterns. For example, `src/**/*.scss` will match all of the SCSS files within a project. * `chokidar` : [Chokidar](https://github.com/paulmillr/chokidar) is a wrapper around node’s `fs.watch` but resolves some of the common problems. This was useful for implementing the watch feature seen in the gif above.
 ... 
The list of tools here is not exhaustive, but they were the most helpful packages for creating `typed-scss-modules` . # 🏗 Building & Publishing

For the most part, creating a CLI is the same as a standard npm package with TypeScript. However, there are a few important steps to ensure it functions properly. In order to make the script executable as a node script, the node shebang must be added to the top of the output script file. If it’s not included, the script is started without the node executable and obscure syntax related errors will likely be thrown. ```
_#!/usr/bin/env node_
```

The next step is to denote that the package has an executable script. This is done by adding the `[bin](https://docs.npmjs.com/files/package.json)` property to the `package.json` file.
For example, assuming the compiled output file lives at `dist/cli.js` then the `bin` property can be added with the name of the script as the key. Finally, to test the script, run `[npm link](https://docs.npmjs.com/cli/link.html)` in the package directory. Normally to use a package, `npm link [package]` would have to be run in another directory to symlink the local copy. When working with scripts it will also symlink the `bin` globally, so running `my-script` should now work. It’s also still possible to run `npm link [package]` and locally install the `bin` . # Conclusion

That’s all! Hopefully, these packages and key steps are useful when considering to build a command-line npm package written with TypeScript.

---

## 2. [Building a Powerful Command-Line Interface (CLI) Tool in ...](https://medium.com/@WC_/building-a-powerful-command-line-interface-cli-tool-in-typescript-a-step-by-step-guide-3eac3837e190)

**URL:** https://medium.com/@WC_/building-a-powerful-command-line-interface-cli-tool-in-typescript-a-step-by-step-guide-3eac3837e190
**Domain:** medium.com

**Excerpt:**

Last updated: 20241204
### Create a New Project

Create a new directory for your project and navigate into it:

```
mkdir typescript-cli-tool  
cd typescript-cli-tool
```

Initialize a new Node.js project by running:

```
npm init -y
```

This command creates a `package.json` file with default settings.
 ... 
### Entry Point ( `src/index.ts` )

Create the `src/index.ts` file with the following content:

```
#!/usr/bin/env node  
import { Command } from 'commander';  
import { loadCommands } from './commands/github';  
const program = new Command();  
program  
.name('typescript-cli-tool')  
.description('A powerful CLI tool built with TypeScript')  
.version('1.0.0');  
loadCommands(program);  
program.parse(process.argv);
```

Here, we import the `Command` class from the `commander` package and our `loadCommands` function, which we'll define in the next step. We create a new `Command` instance, set the program name, description, and version, and then load our commands. Finally, we parse the command-line arguments.
 ... 
Execute your CLI tool:

```
node dist/index.js github
```

You should see the message “GitHub command loaded” in the console. ### Step 3: Adding Functionality

Now, let’s add some real functionality to our `github` command. We'll use the `octokit` library to interact with the GitHub API.
 ... 
### Testing the Subcommand

Compile and run your CLI tool:

```
npx tsc  
node dist/index.js github list-repos
```

You should see a detailed list of your repositories. Press enter or click to view image in full size

### Step 5: Error Handling and Validation

A robust CLI tool should handle errors gracefully and validate user input. Let’s add these features.
### Error Handling

In your `src/commands/github.ts` file, add error handling to the `github` command:

```
// ... previous code ...  
program  
.command('github')  
.description('Interact with the GitHub API')  
.action(async () => {  
try {  
// ... API calls ...  
} catch (error) {  
console.error('An error occurred:', error.message);  
}  
});
```

### Input Validation

Let’s validate the `list-repos` subcommand to ensure it only accepts a specific argument:

```
// ... previous code ...  
program  
.command('list-repos')  
.description('List repositories with details')  
.argument('<sort>', 'Sort repositories by stars or forks')  
.action(async (sort) => {  
const { data: repos } = await octokit.repos.listForAuthenticatedUser({  
sort: sort as 'stars' | 'forks',  
});  
// ... rest
of the code ...  
});
```

We’ve added an argument to the subcommand, which the user must provide. ### Testing Error Handling and Validation

Compile and run your CLI tool with invalid input:

```
node dist/index.js github list-repos invalid-sort
```

You should see an error message indicating the issue. ### Step 6: Best Practices and Pro Tips

* **Use TypeScript Interfaces** : Define interfaces for your command options and arguments to improve type safety and documentation. * **Modularize Your Code** : Break down complex commands into smaller functions or modules for better maintainability. * **Unit Testing** : Write unit tests for your command modules to ensure they work as expected.
* **User Feedback** : Provide clear and informative feedback to users, especially when handling errors or validating input. * **Command Aliases** : Consider adding command aliases for convenience, e.g., `list` as an alias for `list-repos` . ### Troubleshooting

### Common Issues

* **Missing Dependencies** : Ensure you have all the required dependencies installed. Run `npm install` if you encounter issues. * **TypeScript Compilation Errors** : Double-check your TypeScript code for syntax errors and ensure your `tsconfig.json` is configured correctly. * **API Rate Limits** : GitHub’s API has rate limits. If you encounter rate limit errors, consider using a different API key or adjusting your code to handle rate limits.
### Resources

* [Commander.js Documentation](https://www.npmjs.com/package/commander)
* [Octokit Documentation](https://octokit.github.io/rest.js/)
* [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

### Next Steps

Congratulations! You’ve built a powerful CLI tool using TypeScript. Here are some ideas to further enhance your project:

* **Add More Commands** : Expand your tool by adding commands to create, update, or delete repositories. * **Configuration Files** : Implement a configuration system to store user preferences and API tokens. * **Interactive Mode** : Explore libraries like `inquirer` to add interactive prompts to your CLI. * **Continuous Integration** : Set up CI/CD pipelines to automate testing and deployment.

---

## 3. [Design Patterns in TypeScript](https://refactoring.guru/design-patterns/typescript)

**URL:** https://refactoring.guru/design-patterns/typescript
**Domain:** refactoring.guru

**Excerpt:**

Last updated: 20140101
[Check out my new Git course! Hey! Check out my new Git course! Hey! Check out my new Git course on GitByBit.com! Hey! Want a cool refresher on Git? Check out my new Git course on GitByBit.com! ](https://gitbybit.com/)

[]() []()

# Design Patterns in TypeScript

## The Catalog of **TypeScript** Examples

#### Creational Patterns

#### Abstract Factory

Lets you produce families of related objects without specifying their concrete classes. [Main article](/design-patterns/abstract-factory)

[Usage in TypeScript](/design-patterns/abstract-factory/typescript/example)

[Code example](/design-patterns/abstract-factory/typescript/example)

#### Builder

Lets you construct complex objects step by step.
The pattern allows you to produce different types and representations of an object using the same construction code. [Main article](/design-patterns/builder)

[Usage in TypeScript](/design-patterns/builder/typescript/example)

[Code example](/design-patterns/builder/typescript/example)

#### Factory Method

Provides an interface for creating objects in a superclass, but allows subclasses to alter the type of objects that will be created. [Main article](/design-patterns/factory-method)

[Usage in TypeScript](/design-patterns/factory-method/typescript/example)

[Code example](/design-patterns/factory-method/typescript/example)

#### Prototype

Lets you copy existing objects without making your code dependent on their classes.
[Main article](/design-patterns/prototype)

[Usage in TypeScript](/design-patterns/prototype/typescript/example)

[Code example](/design-patterns/prototype/typescript/example)

#### Singleton

Lets you ensure that a class has only one instance, while providing a global access point to this instance. [Main article](/design-patterns/singleton)

[Usage in TypeScript](/design-patterns/singleton/typescript/example)

[Code example](/design-patterns/singleton/typescript/example)

#### Structural Patterns

#### Adapter

Allows objects with incompatible interfaces to collaborate.
[Main article](/design-patterns/adapter)

[Usage in TypeScript](/design-patterns/adapter/typescript/example)

[Code example](/design-patterns/adapter/typescript/example)

#### Bridge

Lets you split a large class or a set of closely related classes into two separate hierarchies—abstraction and implementation—which can be developed independently of each other. [Main article](/design-patterns/bridge)

[Usage in TypeScript](/design-patterns/bridge/typescript/example)

[Code example](/design-patterns/bridge/typescript/example)

#### Composite

Lets you compose objects into tree structures and then work with these structures as if they were individual objects.
[Main article](/design-patterns/composite)

[Usage in TypeScript](/design-patterns/composite/typescript/example)

[Code example](/design-patterns/composite/typescript/example)

#### Decorator

Lets you attach new behaviors to objects by placing these objects inside special wrapper objects that contain the behaviors. [Main article](/design-patterns/decorator)

[Usage in TypeScript](/design-patterns/decorator/typescript/example)

[Code example](/design-patterns/decorator/typescript/example)

#### Facade

Provides a simplified interface to a library, a framework, or any other complex set of classes.
 ... 
This transformation lets you pass requests as a method arguments, delay or queue a request's execution, and support undoable operations. [Main article](/design-patterns/command)

[Usage in TypeScript](/design-patterns/command/typescript/example)

[Code example](/design-patterns/command/typescript/example)

#### Iterator

Lets you traverse elements of a collection without exposing its underlying representation (list, stack, tree, etc.). [Main article](/design-patterns/iterator)

[Usage in TypeScript](/design-patterns/iterator/typescript/example)

[Code example](/design-patterns/iterator/typescript/example)

#### Mediator

Lets you reduce chaotic dependencies between objects.
 ... 
[Main article](/design-patterns/strategy)

[Usage in TypeScript](/design-patterns/strategy/typescript/example)

[Code example](/design-patterns/strategy/typescript/example)

#### Template Method

Defines the skeleton of an algorithm in the superclass but lets subclasses override specific steps of the algorithm without changing its structure. [Main article](/design-patterns/template-method)

[Usage in TypeScript](/design-patterns/template-method/typescript/example)

[Code example](/design-patterns/template-method/typescript/example)

#### Visitor

Lets you separate algorithms from the objects on which they operate.

---

## 4. [cli input parsing for node.js - javascript](https://stackoverflow.com/questions/67756167/cli-input-parsing-for-node-js)

**URL:** https://stackoverflow.com/questions/67756167/cli-input-parsing-for-node-js
**Domain:** stackoverflow.com

**Excerpt:**

Last updated: 20210529
| [](# "Expand to show all comments on this post")

## 2 Answers 2

Sorted by: [Reset to default](/questions/67756167/cli-input-parsing-for-node-js?answertab=scoredesc)

Highest score (default) Trending (recent votes count more) Date modified (newest first) Date created (oldest first)

1

[](/posts/67756309/timeline "Show activity on this post.") Unless this is an exercise, I'd strongly recommend not to implement your own command and argument parser. Use one of the existing libraries. A quick web search for "node cli library" yields a lot of results, including comparisons.
The libraries range from tiny and simple like [`minimist`](https://www.npmjs.com/package/minimist) , very popular ones like [`yargs`](https://www.npmjs.com/package/yargs) or [`commander`](https://www.npmjs.com/package/commander) , to heavier ones like [`oclif`](https://www.npmjs.com/package/oclif) . I'd also recommend checking the [Command-line utilities section](https://github.com/sindresorhus/awesome-nodejs) of Sindre Sorhus' Awesome Node.js list. [Share](/a/67756309 "Short permalink to this answer")

[Improve this answer](/posts/67756309/edit)

Follow

answered May 29, 2021 at 22:51

[](/users/2021789/rsmeral)

[rsmeral](/users/2021789/rsmeral)

586 3 3 silver badges 8 8 bronze badges

Sign up to request clarification or add additional context in comments.
## 1 Comment

Add a comment

user14591266

user14591266 []()

it's an exercise. 0 Reply

* Copy link

0

[](/posts/67756371/timeline "Show activity on this post.") What you are doing is passing options and arguments to a program. You can use `process.argv` to get these. It's always good to have useful error messages and command line documentation. Hence, if you're distributing to users, a more robust library for this purpose is worth an extra dependency. Widely used is `yargs` , see their website at <https://www.npmjs.com/package/yargs> for some examples.
If you want to do it using the basic `process.argv` , here's a solution:

This is your command in a format most people are used to: `node some.js --user Yimmee --msg "well hello" --random`

And the implementation

```
let arguments = process.argv.slice(2); // this removes `node` and the filename from arguments list
console.log(arguments)
switch (arguments[0]) { // check that `say` is the first "command"
    case 'say':
        let options = process.argv.slice(3); // get the stuff after `say`
        let optionsObject = {} // key-value representation
        if (options.indexOf("--user") != -1) { // if it exists
            optionsObject.user = options[options.indexOf("--user")+1]
        }
        else {
            // you can throw an error here
        }
        if
 ... 
:[^"]*"){2})*[^"]*$)/); // split the string into an array at the spaces
    // ^ regex from https://stackoverflow.com/questions/23582276/
    console.log(arguments)
    switch (arguments[0]) { // check that `say` is the first "command"
        case 'say':
            let options = arguments.slice(1); // get the stuff after `say`
            let optionsObject = {} // key-value representation
            if (options.indexOf("--user") != -1) { // if it exists
                optionsObject.user = options[options.indexOf("--user") + 1]
            }
            else {
                // you can throw an error here
            }
            if (options.indexOf("--msg") != -1) { // if it exists
                optionsObject.msg = options[options.indexOf("--msg") + 1]
            }
            if
 ... 
](/questions/52249115/handling-nodejs-input-from-console)

[0](/questions/54896223/node-js-input-values-in-text-file "Question score (upvotes - downvotes)") [Node js input values in text file](/questions/54896223/node-js-input-values-in-text-file)

[0](/questions/58060534/how-to-accept-input-from-user-on-command-line-in-javascript "Question score (upvotes - downvotes)") [How to accept input from user on command line in javascript?
](/questions/58060534/how-to-accept-input-from-user-on-command-line-in-javascript)

[0](/questions/58848456/take-input-from-node-call-nodejs "Question score (upvotes - downvotes)") [Take input from node call nodejs](/questions/58848456/take-input-from-node-call-nodejs)

#### [Hot Network Questions](https://stackexchange.com/questions?tab=hot)

* [How did old programs handle signal safety when there weren't the POSIX realtime signal extension? ](https://retrocomputing.stackexchange.com/questions/32255/how-did-old-programs-handle-signal-safety-when-there-werent-the-posix-realtime)
* [Custom Error Exception Class in Python](https://codereview.stackexchange.com/questions/299526/custom-error-exception-class-in-python)
* [Is a functor a "natural function" between morphisms?

---

## 5. [Documentation - tsc CLI Options](https://www.typescriptlang.org/docs/handbook/compiler-options.html)

**URL:** https://www.typescriptlang.org/docs/handbook/compiler-options.html
**Domain:** www.typescriptlang.org

**Excerpt:**

Last updated: 20251110
Was this page helpful? # tsc CLI Options

## []() Using the CLI

Running `tsc` locally will compile the closest project defined by a `tsconfig.json` , or you can compile a set of TypeScript
files by passing in a glob of files you want. When input files are specified on the command line, `tsconfig.json` files are
ignored.
```
sh

`# Run a compile based on a backwards look through the fs for a tsconfig.json tsc # Emit JS for just the index.ts with the compiler defaults tsc index.ts # Emit JS for any .ts files in the folder src, with the default settings tsc src/*.ts # Emit files referenced in with the compiler settings from tsconfig.production.json tsc --project tsconfig.production.json # Emit d.ts files for a js file with showing compiler options which are booleans tsc index.js --declaration --emitDeclarationOnly # Emit a single .js file from two files via compiler options which take string arguments tsc app.ts util.ts --target esnext --outfile index.js`
```

## []() Compiler Options

**If you’re looking for more information about the compiler options in a tsconfig, check out the [TSConfig
Reference](/tsconfig)**

### CLI Commands

|Flag |Type |
| --- | --- |
|`--all` |`boolean` |
|Show all compiler options. |
|`--help` |`boolean` |
|Gives local information for help on the CLI. |
|`--init` |`boolean` |
|Initializes a TypeScript project and creates a tsconfig.json file. |
|`--listFilesOnly` |`boolean` |
|Print names of files that are part of the compilation and then stop processing. |
|`--locale` |`string` |
|Set the language of the messaging from TypeScript. This does not affect emit. |
|`--project` |`string` |
|Compile the project given the path to its configuration file, or to a folder with a 'tsconfig.json'. |
|`--showConfig` |`boolean` |
|Print the final configuration instead of building. |
|`--version` |`boolean` |
|Print the compiler's version.
 ... 
|
|`[--assumeChangesOnlyAffectDirectDependencies](/tsconfig/)` |`boolean` |`false` |
|Have recompiles in projects that use [`incremental`]() and `watch` mode assume that changes within a file will only affect files directly depending on it. |
|`[--baseUrl](/tsconfig/)` |`string` | |
|Specify the base directory to resolve bare specifier module names. |
|`[--charset](/tsconfig/)` |`string` |`utf8` |
|No longer supported. In early versions, manually set the text encoding for reading files. |
|`[--checkJs](/tsconfig/)` |`boolean` |`false` |
|Enable error reporting in type-checked JavaScript files. |
|`[--composite](/tsconfig/)` |`boolean` |`false` |
|Enable constraints that allow a TypeScript project to be used with project references.
|
|`[--customConditions](/tsconfig/)` |`list` | |
|Conditions to set in addition to the resolver-specific defaults when resolving imports. |
|`[--declaration](/tsconfig/)` |`boolean` |`true` if [`composite`]() ; `false` otherwise. |
|Generate .d.ts files from TypeScript and JavaScript files in your project. |
|`[--declarationDir](/tsconfig/)` |`string` | |
|Specify the output directory for generated declaration files. |
|`[--declarationMap](/tsconfig/)` |`boolean` |`false` |
|Create sourcemaps for d.ts files. |
|`[--diagnostics](/tsconfig/)` |`boolean` |`false` |
|Output compiler performance information after building. |
|`[--disableReferencedProjectLoad](/tsconfig/)` |`boolean` |`false` |
|Reduce the number of projects loaded automatically by TypeScript.
 ... 
|
|`[--noImplicitThis](/tsconfig/)` |`boolean` |`true` if [`strict`]() ; `false` otherwise. |
|Enable error reporting when `this` is given the type `any` . |
|`[--noImplicitUseStrict](/tsconfig/)` |`boolean` |`false` |
|Disable adding 'use strict' directives in emitted JavaScript files. |
|`[--noLib](/tsconfig/)` |`boolean` |`false` |
|Disable including any library files, including the default lib.d.ts. |
|`[--noPropertyAccessFromIndexSignature](/tsconfig/)` |`boolean` |`false` |
|Enforces using indexed accessors for keys declared using an indexed type. |
|`[--noResolve](/tsconfig/)` |`boolean` |`false` |
|Disallow `import` s, `require` s or `<reference>` s from expanding the number of files TypeScript should add to a project.
 ... 
[Terms of Use](https://go.microsoft.com/fwlink/?LinkID=206977)

### Using TypeScript

* [Get Started](/docs/)
* [Download](/download/)
* [Community](/community/)
* [Playground](/play/)
* [TSConfig Ref](/tsconfig/)
* [Code Samples](/play/)
* [Why TypeScript](/why-create-typescript/)
* [Design](/branding/)

### Community

* [Get Help](/community)
* [Blog](https://devblogs.microsoft.com/typescript/)
* [GitHub Repo](https://github.com/microsoft/TypeScript/)
* [Community Chat](https://discord.gg/typescript)
* [@TypeScript](https://twitter.com/TypeScript)
* [Mastodon](https://fosstodon.org/@TypeScript)
* [Stack Overflow](https://stackoverflow.com/questions/tagged/typescript)
* [Web Repo](https://github.com/microsoft/TypeScript-Website)

MSG

---

## 6. [Building a CLI from scratch with TypeScript and oclif](https://www.joshcanhelp.com/oclif/)

**URL:** https://www.joshcanhelp.com/oclif/
**Domain:** www.joshcanhelp.com

**Excerpt:**

Last updated: 20240408
[](/)

[Home](/) › [Posts](/posts) › Apr 08, 2024

# Building a CLI from scratch with TypeScript and oclif

I'm currently working on a pair of CLIs, [one I've written about here](budget-cli) and one I'll announce soon. I just love a good text-based interface so a lot of the tools I build for myself and built at work take on that form. I'm certainly no expert in this realm (yet) but I enjoy figuring out sane defaults for options, clear flag names, and helpful error messages. Despite that, I am also still pretty fun at parties.
 ... 
* * *

This tutorial assumes that you:

* Have Node and npm installed on your system
* Are or will be using TypeScript (TS going forward) to build the CLI

The [oclif CLI](https://github.com/oclif/oclif) has two options to create the files you need:

* The `generate` command that creates a new npm project from scratch in a new directory
* The `init` command that adds the basic configuration to an existing project

The `generate` command is the easiest way to get to a completely working CLI but it leaves you with a lot of boilerplate that you might not need and a number of unanswered questions about what comes next. We're going to start this tutorial with an empty directory and work our way to a functional CLI step-by-step, starting with the `init` command.
We'll rely on links to the documentation to expand on what's here and, by the end, you should have a clear path forward for your own CLI project. First, we need a new directory and a `package.json` file, which we'll get by initializing npm and installing TS:

```
$  mkdir  new-oclif-cli
$  cd  new-oclif-cli
$  npm  init
 # ... answer all prompts, defaults are fine for this tutorial 

$  npm install  typescript
```

We're going to do the absolute bare minimum of setup to get TS compiling since that's not the focus of this tutorial. If you're just getting started with TS, the [TypeScript Tooling in 5 minutes](https://www.typescriptlang.org/docs/handbook/typescript-tooling-in-5-minutes.html) is a great place to start.

---

## 7. [All Design Pattern Javascript/Typescript You Must Know](https://dev.to/tak089/typescript-design-patterns-5hei)

**URL:** https://dev.to/tak089/typescript-design-patterns-5hei
**Domain:** dev.to

**Excerpt:**

Last updated: 20250427
* Use **mediators and command queues** for workflows and background jobs. * * *

# []() **Full-Stack TypeScript Clean Architecture Plan**

**Tech stack:**

* **Backend:** NestJS (TypeScript, modular, DI-friendly)
* **Frontend:** Next.js (React + TypeScript)
* **API Protocol:** REST (optionally extendable to GraphQL)
* **Patterns:** Factory, Singleton, Adapter, Decorator, Proxy, Strategy, Chain of Responsibility, Command, Observer, Mediator
* **Tools:** Axios, Prisma or TypeORM, Zod/DTO validation, Swagger, JWT

* * *

## []() **1\.
Modular API Layer (Backend — NestJS)**

### []() **Backend App Modules**

```
src/
  modules/
    user/
      user.module.ts
      user.controller.ts
      user.service.ts
      user.repository.ts
      dto/
      strategy/
      observer/
    post/
    auth/
  common/
    middleware/
    guards/
    interceptors/
    exceptions/
    config/
  main.ts
```

**Best practices:**

* Keep **modules independent**
* Implement **middleware chains**
* Centralize **error handling**
* Use **DTOs + validation**
* Isolate **repositories**
* Apply **design patterns within services**

* * *

## []() **2\.
 ... 
Error Handling (Proxy + Decorator)**

**Global Exception Filter**

```
@ Catch () export class AllExceptionsFilter implements ExceptionFilter { catch ( exception : any , host : ArgumentsHost ) { const ctx = host . switchToHttp (); const response = ctx . getResponse < Response > (); response . status ( exception . status || 500 ). json ({ statusCode : exception . status || 500 , message : exception . message || ' Unexpected error occurred ' , }); } }
```

**Best practices:**

* Centralize error formatting
* Use interceptors or decorators for logging and validation

* * *

## []() **7\.
 ... 
Next.js Frontend Architecture**

**/services/userService.ts**

```
import axios from ' axios ' ; export const userService = { async getUser ( id : number ) { const res = await axios . get ( `/api/users/ ${ id } ` ); return res . data ; } }
```

**/hooks/useUser.ts**

```
import { useEffect , useState } from ' react ' ; import { userService } from ' ../services/userService ' ; export function useUser ( id : number ) { const [ user , setUser ] = useState ( null ); useEffect (() => { userService . getUser ( id ). then ( setUser ); }, [ id ]); return user ; }
```

**Best practices:**

* Keep **services isolated**
* Use **React hooks** for stateful API data
* Use **decorators** for logging or retry wrappers on services

* * *

## []() **9\.

---

## 8. [How to Parse Command Line Arguments in Node ?](https://www.geeksforgeeks.org/node-js/how-to-parse-command-line-arguments-in-node-js/)

**URL:** https://www.geeksforgeeks.org/node-js/how-to-parse-command-line-arguments-in-node-js/
**Domain:** www.geeksforgeeks.org

**Excerpt:**

Last updated: 20240916
](https://www.geeksforgeeks.org/node-js/how-to-handle-errors-in-node-js/) [Exception Handling in Node.js](https://www.geeksforgeeks.org/node-js/exception-handling-in-node-js/)
  
  ## Node.js NPM
  
  [NodeJS NPM](https://www.geeksforgeeks.org/node-js/node-js-npm-node-package-manager/) [Steps to Create and Publish NPM packages](https://www.geeksforgeeks.org/node-js/steps-to-create-and-publish-npm-packages/) [Introduction to NPM scripts](https://www.geeksforgeeks.org/node-js/introduction-to-npm-scripts/) [Node.js package.json](https://www.geeksforgeeks.org/node-js/node-js-package-json/) [What is package-lock.json ?
 ... 
](https://www.geeksforgeeks.org/node-js/node_env-variables-and-how-to-use-them/) [Difference Between Development and Production in Node.js](https://www.geeksforgeeks.org/node-js/difference-between-development-and-production-in-node-js/) [Best Security Practices in Node.js](https://www.geeksforgeeks.org/node-js/best-security-practices-in-node-js/) [Deploying Node.js Applications](https://www.geeksforgeeks.org/node-js/deploying-node-js-applications/) [How to Build a Microservices Architecture with NodeJS](https://www.geeksforgeeks.org/node-js/how-to-build-a-microservices-architecture-with-nodejs/) [Node.js with WebAssembly](https://www.geeksforgeeks.org/node-js/node-js-with-webassembly/)
  
  ## Resources & Tools
  
  [Node.js Web
 ... 
Last Updated : 16 Sep, 2024
  
  Comments
  
  Improve
  
    + 
    + 
      +
  
  Suggest changes
  
  2 Likes
  
  Like
  
  Report
  
  Command-line arguments, in the context of a command-line interface ( ****CLI**** ), are text strings that provide extra information to a program when it is executed. In Nodejs, these arguments are accessible through an array known as ****argv**** (arguments values), where the shell passes all received command-line arguments to the running process. ## Approach
  
  To parse the command line arguments in node js, we can use two methods to parse command-line arguments via ****process.argv**** array as well as popular package ****yargs.

---

## 9. [Error Handling in CLI Tools: A Practical Pattern That's ...](https://medium.com/@czhoudev/error-handling-in-cli-tools-a-practical-pattern-thats-worked-for-me-6c658a9141a9)

**URL:** https://medium.com/@czhoudev/error-handling-in-cli-tools-a-practical-pattern-thats-worked-for-me-6c658a9141a9
**Domain:** medium.com

**Excerpt:**

Last updated before: 2025-06-22
Sitemap
Open in app
Sign up
Sign in
Write
Sign up
Sign in
Error Handling in CLI Tools: A Practical Pattern That’s Worked for Me
Chloe Zhou
Follow
6 min read
· 3 days ago
--
Listen
Share
I’ve been building a small CLI tool recently to help manage personal notes from the terminal. It’s a simple project, but adding features like persistent user sessions and database access made me think more seriously about error handling. In particular, I wanted to find a balance between surfacing helpful messages to users while keeping my codebase clean and predictable. This post documents the approach I landed on, why I chose it, and how it plays out in a few real command implementations. Error handling isn’t just for catching bugs — it’s part of good UX. Here’s a glimpse of my approach.
Why Error Handling Matters in CLI Tools
When designing error handling for a CLI tool, my goal was to make sure that any failure a user runs into is:
    * Human-readable
    * Actionable
    * Context-aware

To get there, I explored common error handling patterns in async JavaScript — specifically how to structure error throwing in utility functions versus catching in command handlers, and how to categorize different types of errors. I ended up with an approach that distinguishes between expected errors, system errors, and business logic errors. Two Common Patterns
    * Pattern 1: Throw Errors (Recommended for CLI)
    * Pattern 2: Return Error Objects

Let me show you what they look like in practice.
 ... 
Expected “Errors” (Not Really Errors)
Some conditions aren’t really errors — they’re just normal edge cases that we expect to happen occasionally. For example, if there’s no session file, that simply means the user hasn’t logged in yet. export const getUserSession = async () => {
try {
await access(USER_SESSION_PATH);
const sessionData = await readFile(USER_SESSION_PATH, 'utf-8');
return JSON.parse(sessionData);
} catch (error) {
if (error.code === 'ENOENT') {
return null; // File doesn't exist = no session (EXPECTED)
}
throw error; // Unexpected error
}
};
2. System Errors
These usually come from the underlying platform — e.g. Node.js APIs, the file system, or corrupted files. They’re rare but should be surfaced with context.

---

## 10. [Starting a Typescript CLI Project from Scratch](https://akos.ma/blog/starting-a-typescript-cli-project-from-scratch/)

**URL:** https://akos.ma/blog/starting-a-typescript-cli-project-from-scratch/
**Domain:** akos.ma

**Excerpt:**

Last updated: 20201211
## Clean Task

It is a good practice to have a `clean` task to quickly remove all build products. We could add a line like this to our `package.json` to do that:

```
"scripts" :  {
 "build" :  "npx tsc" ,
 "release" :  "npx gulp" ,
 "clean" :  "rm -rf out" , // this line
 "test" :  "npx ts-node node_modules/.bin/jasmine spec/*"   } ,
```

But the problem is that the `rm -rf` command does not work in Windows (and yes, I care about our poor Windows users). Thankfully there’s a simple workaround to this issue:

```
$ npm install rimraf --save-dev
```

Now we can use the `rimraf` command, which works everywhere:

```
"scripts" :  {
 "build" :  "npx tsc" ,
 "release" :  "npx gulp" ,
 "clean" :  "npx rimraf out" , // better!
 ... 
✖  2  problems  ( 2  errors,  0  warnings ) 1  error and  0  warnings potentially fixable with the  ` --fix `  option. ```

Another benefit is that Visual Studio Code automatically detects the presence of ESLint and highlights the issues in our code. We can run the command with the `--fix` option, which will remove one of the errors:

```
npx eslint src --fix
 ~/project/src/customer.ts
   1:16  error  Require statement not part of import statement  @typescript-eslint/no-var-requires
 ✖  1  problem  ( 1  error,  0  warnings )
```

The remaining problem has to do the `require` statement; in TypeScript it is preferred to use the `import` statement instead, but the `Cowsay` library unfortunately does not include a `@types/cowsay` library with the type information.
 ... 
Add command-line argument parsing with [commander](https://www.npmjs.com/package/commander) or with [oclif](https://oclif.io/) . 6. Use `Promise` and `await` / `async` for asynchronous code. 7. Strip `alert()` and `console.log()` calls at build time with [gulp-strip-debug](https://github.com/sindresorhus/gulp-strip-debug) . 8. Create a desktop application and distribute it with [Electron](https://www.electronjs.org/) . 9. Manipulate date and time information with [Moment.js](https://momentjs.com/)
10. Run shell commands from your own code using [shelljs](https://www.npmjs.com/package/shelljs)
11. Create PDFs with [PDF-lib](https://pdf-lib.js.org/)
12. Style `console.log()` [to your liking](https://denic.hashnode.dev/use-consolelog-like-a-pro)

3396 words (reading time ~16 minutes).

---

## 11. [Documentation - Archi TS CLI](https://archits.dev/documentation)

**URL:** https://archits.dev/documentation
**Domain:** archits.dev

**Excerpt:**

Last updated: 20250102
* [GitHub](https://github.com/thomas-bressel/archi-ts-cli)
* [Discussions](https://github.com/thomas-bressel/archi-ts-cli/discussions)
* English Français

ArchiTS

* [Home](/home)
* [Documentation](/documentation)

* [Sponsor](https://github.com/sponsors/thomas-bressel)
* [Get Started]()
*

## ArchiTS CLI Documentation

Welcome to the complete documentation of ArchiTS CLI, your modern backend architecture generator for TypeScript. * ##### Quick Installation
  
  Install ArchiTS in a few minutes and create your first project
* ##### Quick Start
  
  Step-by-step guide to create your first backend architecture
* ##### Architectures
  
  Discover the three supported architectural patterns

## What is ArchiTS?
ArchiTS CLI is a command-line tool developed in Go that automatically generates robust and well-organized backend project structures. It supports three proven architectural patterns and generate modern TypeScript code. * 💡 Philosophy: ArchiTS helps you start your backend projects with a solid architecture, best practices, and automated configuration, allowing you to focus quickely on your business logic. * ### Why use ArchiTS?
+ #### Advantages
        
        - Time-saving: Project creation in 30 seconds
        - Best practices: Proven architectures and recommended patterns
        - Automatic configuration: Pre-configured ESLint, Jest, TypeScript
        - Flexibility: TypeScript support and optional ExpressJS, typeORM
        - Maintainability: Clear structure and separation of responsibilities
    + #### Use Cases
        
        - Quick start for REST APIs
        - Backend projects with complex architectures
        - Well-structured microservices
        - Applications following SOLID principles
        - Projects requiring high testability
* ### Main Features
  
  |Feature |Description |Support |
  | --- | --- | --- |
  |Architectures |3 professional architectural patterns |✅ Layered, Clean,

---

## 12. [Shell.js - argument parsing for Node.js CLI applications | Shell.js](https://shell.js.org/)

**URL:** https://shell.js.org/
**Domain:** shell.js.org

**Excerpt:**

Last updated before: 2025-10-25
# The tool for building CLI applications with Node.js

[Get started](/usage/tutorial/) [Github](https://github.com/adaltas/node-shell/)

[](https://www.npmjs.com/package/shell) [](https://github.com/adaltas/node-shell/actions)

[Supported](https://www.adaltas.com/en/)

[Documented](/usage/)

[MIT License](/project/license/)

## Why Shell.js? ### Configure your CLI app

Shell.js is simple to configure. All it takes is a declarative object describing your application. Consider it like the model of your application. It is enriched by plugins such as to route commands and to generate help screens.
[Read more](/config/)

```
const {  shell  } = require ( "shell" ) ; const  app  = shell ( { name : "myapp" , description : "My CLI application" , options : { config : { shortcut : "c" , description : "Some option" , } , } , commands : { start : { description : "Start something" , } , } , } ) ;
```

### Parse arguments

For the handling and adding the functionality to the application operate with the `args` object returned with the method `parse`. [Read more](/api/parse/)

```
/* ... */ const  args  =  app . parse ( ) ; console . log ( args ) ; // Run `node myapp -c value start` // { command: [ 'start' ], config: 'value' }
```

### Organize the code with routing

Load and configure the router in a separate top-level module.
 ... 
Via npm:

```
npm install shell
```

Via git (or downloaded tarball), copy or link the project from a discoverable Node.js directory:

```
git clone http://github.com/adaltas/node-shell.git
```

## Navigate

* [Getting started](/usage/tutorial/)
* [API](/api/)
* [Configuration](/config/)

## Contribute

* [GitHub](https://github.com/adaltas/node-shell/)
* [Issue Tracker](https://github.com/adaltas/node-shell/issues/)
* [MIT License](/project/license/)

## About

Node.js Parameters is the tool for building CLI applications with Node.js. It is developed and supported by [Adaltas](https://www.adaltas.com/en/) .

---

## 13. [How to check TypeScript code for syntax errors from a ...](https://stackoverflow.com/questions/41542907/how-to-check-typescript-code-for-syntax-errors-from-a-command-line)

**URL:** https://stackoverflow.com/questions/41542907/how-to-check-typescript-code-for-syntax-errors-from-a-command-line
**Domain:** stackoverflow.com

**Excerpt:**

Last updated: 20170109
1. 1. [Home](/)
    2. [Questions](/questions)
    3. [AI Assist Labs](https://stackoverflow.ai)
    4. [Tags](/tags)
    5. 6. [Challenges](/beta/challenges)
    7. [Chat](https://chat.stackoverflow.com/rooms/259507/stack-overflow-lobby)
    8. [Articles](https://stackoverflow.blog/contributed?utm_medium=referral&utm_source=stackoverflow-community&utm_campaign=so-blog&utm_content=experiment-articles)
    9. [Users](/users)
    10. 11. [Jobs](/jobs?source=so-left-nav)
    12. [Companies](https://stackoverflow.com/jobs/companies?so_medium=stackoverflow&so_source=SiteNav)
    13. [Collectives](javascript:void\(0\))
    14. Communities for your favorite technologies. [Explore all Collectives](/collectives-all)
2.
 ... 
> Do not emit compiler output files like JavaScript source code, source-maps or declarations. > 
> 

[source TSDocs](https://www.typescriptlang.org/tsconfig)

* * *

If you want lint code as well as check types on CI use `tsc --noEmit && eslint`

[source Stackoverflow comment](https://stackoverflow.com/a/60758789/9795603)

[Share](/a/69013629 "Short permalink to this answer")

[Improve this answer](/posts/69013629/edit)

Follow

[edited Nov 4, 2021 at 13:28](/posts/69013629/revisions "show all edits to this post")

answered Sep 1, 2021 at 12:18

[](/users/9795603/alex-gusev)

[Alex Gusev](/users/9795603/alex-gusev) Alex Gusev

1,109 10 10 silver badges 9 9 bronze badges

1

* 3
  
  You can use "tsc --noEmit --skipLibCheck" to ignore checking node\_modules.
 ... 
[Ask question](/questions/ask)

Explore related questions

* [typescript](/questions/tagged/typescript "show questions tagged 'typescript'")
* [syntax](/questions/tagged/syntax "show questions tagged 'syntax'")
* [compilation](/questions/tagged/compilation "show questions tagged 'compilation'")
* [verification](/questions/tagged/verification "show questions tagged 'verification'")
* [syntax-checking](/questions/tagged/syntax-checking "show questions tagged 'syntax-checking'")

See similar questions with these tags. lang-js

---

## 14. [oclif/cli-ux: CLI IO utilities](https://github.com/oclif/cli-ux)

**URL:** https://github.com/oclif/cli-ux
**Domain:** github.com

**Excerpt:**

Last updated: 20220131
=========

[]()

cli IO utilities

[](https://npmjs.org/package/cli-ux) [](https://circleci.com/gh/oclif/cli-ux/tree/main) [](https://ci.appveyor.com/project/heroku/cli-ux/branch/main) [](https://snyk.io/test/npm/cli-ux) [](https://npmjs.org/package/cli-ux) [](https://github.com/oclif/cli-ux/blob/main/package.json)

# Usage

[]()

The following assumes you have installed `cli-ux` to your project with `npm install cli-ux` or `yarn add cli-ux` and have it required in your script (TypeScript example):

```
import cli from 'cli-ux' 
 cli . prompt ( 'What is your name?' )
```

JavaScript:

```
const { cli } = require ( 'cli-ux' ) 

 cli . prompt ( 'What is your name?' )
```

# cli.prompt()

[]()

Prompt for user input. ```
// just prompt for input 
 await cli . prompt ( 'What is your name?'
 ... 
columns , 
  sort : flags . sort , 
  filter : flags . filter , 
  csv : flags . csv , 
  extended : flags . extended , 
  'no-truncate' : flags [ 'no-truncate' ] , 
  'no-header' : flags [ 'no-header' ] , 
 }
```

Example class:

```
import { Command } from '@oclif/core' 
 import { cli } from 'cli-ux' 
 import axios from 'axios' 

 export default class Users extends Command { 
  static flags = { 
    ... cli . table . flags ( ) 
  } 

  async run ( ) { 
    const { flags } = this . parse ( Users ) 
    const { data : users } = await axios . get ( 'https://jsonplaceholder.typicode.com/users' ) 

    cli . table ( users , { 
      name : { 
        minWidth : 7 , 
      } , 
      company : { 
        get : row => row . company && row . company .
 ... 
[\+ 18 contributors](/oclif/cli-ux/graphs/contributors)

## Languages

* [TypeScript 99\.8%](/oclif/cli-ux/search?l=typescript)
* [JavaScript 0\.2%](/oclif/cli-ux/search?l=javascript)

## Footer

[](https://github.com) © 2025 GitHub, Inc.

### Footer navigation

* [Terms](https://docs.github.com/site-policy/github-terms/github-terms-of-service)
* [Privacy](https://docs.github.com/site-policy/privacy-policies/github-privacy-statement)
* [Security](https://github.com/security)
* [Status](https://www.githubstatus.com/)
* [Community](https://github.community/)
* [Docs](https://docs.github.com/)
* [Contact](https://support.github.com?tags=dotcom-footer)
* Manage cookies
* Do not share my personal information

You can’t perform that action at this time.

---

## 15. [CLI Apps in TypeScript with `cmd-ts` (Part 1) - Gal Schlezinger](https://gal.hagever.com/posts/type-safe-cli-apps-in-typescript-with-cmd-ts-part-1)

**URL:** https://gal.hagever.com/posts/type-safe-cli-apps-in-typescript-with-cmd-ts-part-1
**Domain:** gal.hagever.com

**Excerpt:**

Last updated: 20251029
[Schlez](/)

2020

# CLI Apps in TypeScript with `cmd-ts` (Part 1)

Using `cmd-ts` to easily build a type-safe TypeScript CLI app. Published . 🤌 tl;dr

for a while now, I am using a custom module called [`cmd-ts`](https://github.com/Schniz/cmd-ts) , which is a type-first command line argument parser. Don't know what it means? I'll try to explain below! Anyway, give it a try, and let's make it better together. cmd-ts provides the nicest UX and DX

* * *

I write a lot of command line applications, both at work and for my own usage. Like many, my go-to toolkit for building them in Node.js was [`commander`](https://npm.im/commander) or similar packages.
 ... 
What if we want different parsing/validation behavior, or in other words — _why do we treat all input as simple strings?_

[🔗]()

## Enter [`cmd-ts`](https://github.com/Schniz/cmd-ts)

[`cmd-ts`](https://github.com/Schniz/cmd-ts) is a new command-line argument parser library that works kinda differently. It is influenced by Rust's [`structopt`](http://docs.rs/structopt) and provides a "type-first" approach to command line argument parsing:

* Everything is type-safe
* Types are both in runtime and compile-time, for maximum confidence
* Parsing/validation are handled by the argument parser
* _Extremely_ easy unit testing and code sharing

[🔗]()

### Cloning the previous example

`cmd-ts` ' syntax is very different from Commander's.
 ... 
[🔗]()

### Reading an existing file

Let's try running our command, and try to print a non-existing file:

```
$ ts-node cat.ts unknown-file
events.js:291
      throw er; // Unhandled 'error' event
      ^

Error: ENOENT: no such file or directory, open 'unknown-file'
Emitted 'error' event on ReadStream instance at:
    at internal/fs/streams.js:136:12
    at FSReqCallback.oncomplete (fs.js:156:23) {
  errno: -2,
  code: 'ENOENT',
  syscall: 'open',
  path: 'unknown-file'
}
```

This is not a nice error at all. It happens because `createReadStream` creates a stream from a non-existing file, and when trying to read it we get an `error` event which we didn't handle. A common practice in Commander apps is to validate in your action, and therefore have a userland reporting mechanism.

---

✓ 
Search completed in 0.7s
