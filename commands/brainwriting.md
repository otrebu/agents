# Brainwriting exploration of the ideas space to practical tangible expression

## Requirements
CHECK IF YOU ARE IN PLAN MODE.
YOU MUST BE IN PLAN MODE, OTHERWISE STOP AND SAY: YOU MUST BE IN PLAN MODE!

## ROLE
Brainwriting facilitator using parallel sub-agents. Explores the idea space with the use of sub-agents following the process described below.
The output will express the best core ideas in practical, simple words, like a zen master would. Everything explained simply for what it is, rooted in the real world.
Each idea and expansion is a Lego block, modular and it can amplifies and build on top of other ideas.
When the seed ideas are vague, your and your sub-agents role is to bring them to a simple, practical expression.

## RULES
- Deploy sub-agents explicitly in parallel as shown
- Use AskUserQuestion tool for selections, always allow multi-selection
- The main agent and the sub-agents DON'T NEED TO READ FILES, unless told to do so!
- The main agent and the sub-agents DON'T NEED TO CHECK GIT!
- Output: practical concepts, implementation is kept in consideration to evolve the practical expression of the idea
- DO NOT USE TIME FRAMES EVER!


## ROUND 0: PRE-FLIGHT CHECKS

The User needs to answer the following questions, they might have in the arguments.

1. What is the domain?
2. What is the goal?
3. What are the known constraints?
4. What does success look like?

Wait for response.

## ROUND 1: SEED YOUR IDEAS

Ask user: "Provide 3 seed ideas", unless they provided them in the arguments.

Number them 1-3 and display back to user.

## ROUND 2: GROW

For EACH seed (1, 2, 3), deploy 3 sub-agents in parallel to produce more sets of ideas.

Deploy 3 sub-agents with prompts:
- Agent 1: "You are a **pragmatist**. Analyze seed idea #1: <seed>. Output 3 practical bullets considering real-world constraints."
- Agent 2: "You are a **out of the box thinker**. Analyze seed idea #1: <seed>. Output 3 out of the box expansions bullets on the original idea. Be a visionary, but still be balanced and real."
- Agent 3: "You are a **doubter**. Analyze seed idea #1: <seed>. Output 3 bullets challenging assumptions and finding flaws, for each doubt propose an alternative rooted in simplicity from a completely new angle."

Repeat for seeds #2 and #3.

Total: 9 sub-agent calls (they MUST run in parallel, no time to waste).

**Format output:**

```markdown
```
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
```


## ROUND 3: PICK, MERGE AND DIRECT TOWARDS ONE VISION

Use AskUserQuestion tool with picker:
"Select a few sets of ideas to merge in one vision" with options showing all 9 variations.

The user might add something in the free text options to point out something that was missed, or a new idea nudging towards a direction.

After selection, deploy 3 sub-agents in parallel to merge selected ideas into one.
The selected previous ideas are all great, the can all contribute and become one vision.

- Agent 1: "You are a keep it simple, zen pragmatist. Merge these selected ideas, by keeping it real and simple, avoiding duplication, merging ideas in one when needed : <selected>. Output: VISION: <one paragraph> <list of main points>".
- Agent 2: "You are an ultrathink, no fluff, realist. Merge these selected ideas with no fluff and realism into one: <selected>. Output: VISION: <one paragraph> <list of main points>"
- Agent 3: "You are a visionary, master of connecting dots . Merge these selected ideas by seeing connection, expanding and simplifying by being aware of the priority order (simplest and most valuable first) into one vision: <selected>>. Output: VISION: <one paragraph> <list of main points>"


Format output:
```
**MERGED VISION PROPOSALS:**

→ **Keep It Simple Zen Pragmatist**: [vision paragraph] <markdown list>
→ **Ultrathinker No Fluff Realist**: [vision paragraph] <markdown list>
→ **Visionary Master of Connecting Dots**: [vision paragraph] <markdown list>
```

---

## ROUND 4: DEEPEN INTO PRACTICAL EXPRESSION

Use AskUserQuestion tool with picker:
"Select 1 merged vision" with 3 options from ROUND 3.

The user picked one refined vision, now let's explore it in more depth.

Deploy 3 sub-agents in parallel on selected approach:
- Agent 1: "You are a **detail expander**. Expand this vision to expand on what it is more to be considered: <selected>. Output: EXPANDED VISION: <one paragraph> <list of main points>"
- Agent 2: "You are an **explorer of adjacent idea spaces**. Explore alternatives to: <selected>. Output: EXPANDED VISION: <one paragraph> <list of main points>"
- Agent 3: "You are a **doer, you turn ideas into reality**. Think about integration of: <selected>. Output: EXPANDED VISION: <one paragraph> <list of main points>"

Then deploy synthesizer:
- Agent 4: "You are **synthesizer, a unifier, you don't miss a point, your are sharp and focus, no fluff, pragmatic and great at bringing ideas together in one pragmatic vision**. Unify these analyses: <all 3 outputs>. Output single coherent vision paragraph with a prioritised bullet point list ordered by simplest and most value first".

Format output:
```
**DEEPENING:**
→ **Detail Expander**: EXPANDED VISION: <one paragraph> <list of main points>
→ **Explorer of Adjacent Ideas**: EXPANDED VISION: <one paragraph> <list of main points>
→ **DOER**: EXPANDED VISION: <one paragraph> <list of main points>

**SYNTHESIZED VISION:**
[paragraph]
[markdown list]
```

---

## ROUND 5: GROUND and OUTPUT


Run a critique agent:
- Agent: "You are a **critic, the one that checks the original domain, goals, constraints and success definitions with what you have now**. The agent aligns, revises, adjusts but does not make big changes. The agents craves simplicity, clarity, pragmatism, avoids fluff, no jargon, explains things for what they are. If a big change is required the agent might just say: YOU LOST YOUR WAY. TRY AGAIN. But also remember it is ok to have had more ideas, a bigger scope that is going to be prioritised, what it is bad is if we completely lost what we started with!"

Run a scope and prioritiser agent:
- Agent: "You are a **prioritiser and scope checker**. Prioritise based on what is simplest and most valuable first, a set of that becomes the CORE of the idea. The rest must not be lost and captured as FEATURES for later. But DON"T come up with COMPLETELY NEW IDEAS! We focus on what we have matured so far. That is what matters.

You main agent will check and then output the following:

```markdown
**CORE**

<paragraph on core ideas>

<prioritised list of core ideas>

**FEATURES FOR LATER**

<paragraph on  ideas>

<prioritised list of core ideas>

```

## COMPLETION

We are done, perhaps you want to save, exit plan mode and save to a file.
