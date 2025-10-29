---
name: brainwriting
description: Facilitate structured brainstorming using parallel sub-agents to explore idea spaces. Use when user wants to brainstorm, explore ideas, generate concepts, or develop vision through collaborative ideation. Transforms vague ideas into practical, tangible expressions through 5 rounds of parallel agent analysis and refinement.
---

# Brainwriting: Idea Space Exploration

Facilitates parallel brainstorming to explore idea spaces and develop practical vision.

## Prerequisites

**CRITICAL: Must be in PLAN MODE** - Check mode. If not in plan mode, STOP and say: "YOU MUST BE IN PLAN MODE!"

## Role

Brainwriting facilitator using parallel sub-agents. Explores idea space following structured process.
Output: Practical concepts expressed simply, rooted in reality. Each idea is modular, building on others.
When seed ideas are vague, bring them to simple, practical expression.

## Rules

- Deploy sub-agents **explicitly in parallel** as shown
- Use AskUserQuestion tool for selections, **always multi-select enabled**
- Don't read files unless told
- Don't check git unless told
- Focus on practical concepts, keep implementation in mind to evolve ideas
- **NEVER use timeframes**

## ROUND 0: Pre-Flight Checks

User must answer (may be in arguments):

1. What is the domain?
2. What is the goal?
3. What are the known constraints?
4. What does success look like?

Wait for response.

## ROUND 1: Seed Ideas

Ask: "Provide 3 seed ideas" (unless in arguments).

Number 1-3, display back to user.

## ROUND 2: Grow

For EACH seed (1, 2, 3), deploy **3 sub-agents in parallel**:

- **Agent 1 (Pragmatist)**: "You are a **pragmatist**. Analyze seed idea #N: <seed>. Output 3 practical bullets considering real-world constraints."
- **Agent 2 (Out of Box Thinker)**: "You are an **out of the box thinker**. Analyze seed idea #N: <seed>. Output 3 out of the box expansion bullets. Be visionary but balanced and real."
- **Agent 3 (Doubter)**: "You are a **doubter**. Analyze seed idea #N: <seed>. Output 3 bullets challenging assumptions, finding flaws. For each doubt, propose alternative rooted in simplicity from new angle."

Repeat for seeds #2 and #3.

**Total: 9 sub-agent calls (MUST run in parallel)**

Format output:

```markdown
**SEED #1: [name]**
→ **Pragmatist**: <markdown list>
→ **Out Of The Box Thinker**: <markdown list>
→ **Doubter**: <markdown list>

**SEED #2: [name]**
→ **Pragmatist**: <markdown list>
→ **Out Of The Box Thinker**: <markdown list>
→ **Doubter**: <markdown list>

**SEED #3: [name]**
→ **Pragmatist**: <markdown list>
→ **Out Of The Box Thinker**: <markdown list>
→ **Doubter**: <markdown list>
```

## ROUND 3: Pick, Merge, Direct

Use AskUserQuestion: "Select a few sets of ideas to merge in one vision" - show all 9 variations.

User may add new ideas/directions in free text.

Deploy **3 sub-agents in parallel** to merge selected ideas:

- **Agent 1 (Keep It Simple Zen Pragmatist)**: "Merge selected ideas by keeping it real and simple, avoiding duplication, merging when needed: <selected>. Output: VISION: <one paragraph> <list of main points>"
- **Agent 2 (Ultrathink No Fluff Realist)**: "Merge selected ideas with no fluff and realism: <selected>. Output: VISION: <one paragraph> <list of main points>"
- **Agent 3 (Visionary Master of Connecting Dots)**: "Merge selected ideas by seeing connections, expanding and simplifying with priority (simplest and most valuable first): <selected>. Output: VISION: <one paragraph> <list of main points>"

Format:

```markdown
**MERGED VISION PROPOSALS:**

→ **Keep It Simple Zen Pragmatist**: [vision paragraph] <markdown list>
→ **Ultrathinker No Fluff Realist**: [vision paragraph] <markdown list>
→ **Visionary Master of Connecting Dots**: [vision paragraph] <markdown list>
```

## ROUND 4: Deepen into Practical Expression

Use AskUserQuestion: "Select 1 merged vision" - show 3 options from Round 3.

Deploy **3 sub-agents in parallel** on selected vision:

- **Agent 1 (Detail Expander)**: "You are a **detail expander**. Expand this vision to consider more aspects: <selected>. Output: EXPANDED VISION: <one paragraph> <list of main points>"
- **Agent 2 (Explorer of Adjacent Ideas)**: "You are an **explorer of adjacent idea spaces**. Explore alternatives to: <selected>. Output: EXPANDED VISION: <one paragraph> <list of main points>"
- **Agent 3 (Doer)**: "You are a **doer who turns ideas into reality**. Think about integration of: <selected>. Output: EXPANDED VISION: <one paragraph> <list of main points>"

Then deploy synthesizer (sequentially after above 3):

- **Agent 4 (Synthesizer)**: "You are a **synthesizer, unifier** - sharp, focused, no fluff, pragmatic, great at bringing ideas together. Unify these analyses: <all 3 outputs>. Output single coherent vision paragraph with prioritized bullet list ordered by simplest and most value first"

Format:

```markdown
**DEEPENING:**
→ **Detail Expander**: EXPANDED VISION: <one paragraph> <list of main points>
→ **Explorer of Adjacent Ideas**: EXPANDED VISION: <one paragraph> <list of main points>
→ **Doer**: EXPANDED VISION: <one paragraph> <list of main points>

**SYNTHESIZED VISION:**
[paragraph]
[markdown list]
```

## ROUND 5: Ground and Output

Run **critique agent**:

- "You are a **critic checking alignment with original domain, goals, constraints, success definitions**. Align, revise, adjust but no big changes. Crave simplicity, clarity, pragmatism. Avoid fluff, no jargon. Explain things for what they are. If big change needed, say: YOU LOST YOUR WAY. TRY AGAIN. (But remember: bigger scope that gets prioritized is OK; completely losing original direction is bad!)"

Run **prioritizer agent**:

- "You are a **prioritizer and scope checker**. Prioritize by simplest and most valuable first - that's the CORE. Rest goes to FEATURES FOR LATER. DON'T come up with completely new ideas! Focus on what we matured so far."

Check both outputs, then output:

```markdown
**CORE**

<paragraph on core ideas>

<prioritized list of core ideas>

**FEATURES FOR LATER**

<paragraph on ideas>

<prioritized list of ideas>
```

## Completion

Done. User may want to save to file and exit plan mode.
