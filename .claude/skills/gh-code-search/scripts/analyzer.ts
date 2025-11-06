import type { CodeFile, FactualAnalysis } from './types.js'

export function extractFactualData(files: CodeFile[]): FactualAnalysis {
  const totalLines = files.reduce((sum, f) => sum + f.lines, 0)

  return {
    totalFiles: files.length,
    totalLines,
    languages: countLanguages(files),
    commonImports: extractCommonImports(files),
    syntaxOccurrences: extractSyntaxOccurrences(files),
    fileStructure: {
      avgLinesPerFile: Math.round(totalLines / files.length),
      avgStarsPerFile: Math.round(
        files.reduce((sum, f) => sum + (f.stars || 0), 0) / files.length
      ),
      repoDistribution: countRepoDistribution(files)
    }
  }
}

function countLanguages(files: CodeFile[]): Record<string, number> {
  const langs: Record<string, number> = {}
  for (const file of files) {
    langs[file.language] = (langs[file.language] || 0) + 1
  }
  return langs
}

function extractCommonImports(files: CodeFile[]): Array<{ import: string; count: number }> {
  const importMap = new Map<string, number>()

  for (const file of files) {
    // Match ES6 imports
    const imports = file.content.match(/import\s+.+\s+from\s+['"]([^'"]+)['"]/g)
    if (!imports) continue

    for (const imp of imports) {
      const match = imp.match(/from\s+['"]([^'"]+)['"]/)
      if (match) {
        const pkg = match[1]
        // Only count external packages (not relative imports)
        if (!pkg.startsWith('.') && !pkg.startsWith('/')) {
          importMap.set(pkg, (importMap.get(pkg) || 0) + 1)
        }
      }
    }
  }

  return Array.from(importMap.entries())
    .map(([imp, count]) => ({ import: imp, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20)
}

function extractSyntaxOccurrences(files: CodeFile[]): Record<string, number> {
  const patterns: Record<string, RegExp> = {
    'async/await': /async\s+\w+|await\s+/g,
    'try/catch': /try\s*\{|catch\s*\(/g,
    'Promise': /new\s+Promise|Promise\./g,
    '.then/.catch': /\.then\(|\.catch\(/g,
    'useEffect': /useEffect\s*\(/g,
    'useState': /useState\s*\(/g,
    'class': /class\s+\w+/g,
    'interface': /interface\s+\w+/g,
    'type alias': /type\s+\w+\s*=/g,
    'arrow function': /=>\s*\{|=>\s*\(/g,
    'function declaration': /function\s+\w+/g,
    'export': /export\s+(default\s+)?(const|function|class|interface|type)/g,
  }

  const counts: Record<string, number> = {}

  for (const [name, regex] of Object.entries(patterns)) {
    let totalMatches = 0
    for (const file of files) {
      const matches = file.content.match(regex)
      if (matches) {
        totalMatches += matches.length
      }
    }
    counts[name] = totalMatches
  }

  return counts
}

function countRepoDistribution(files: CodeFile[]): Record<string, number> {
  const repos: Record<string, number> = {}
  for (const file of files) {
    repos[file.repository] = (repos[file.repository] || 0) + 1
  }
  return repos
}
