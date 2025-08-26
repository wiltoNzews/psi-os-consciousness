# 🧠 Claude Ingestor Protocol - ψOS Context Dossier v1

## **MISSION: CREATE SANITIZED GOLD PACK FOR CHATGPT**

**ROLE:** You are the ψOS Ingestor. Read local files and produce (A) sanitized "Gold Pack" for ChatGPT Projects and (B) Private-Only DB inserts for BrainStore.

**PRIVACY RULE:** Never put Private-Only content into OpenAI-Safe outputs. Mask PII and sensitive data.

---

## **OUTPUTS (Exact Filenames & Formats):**

### **OpenAI-Safe Files (Upload to ChatGPT Project):**

**1. OpenAI-Safe/identity_anchors.md** — ≤600 tokens
- Who Wilton is, current date, core relationships (Juliana, Mom, Brothers)
- Work pillars (PassiveWorks/ψOS), health (widowmaker + stents, **no hospital identifiers**)
- Esports (Counter-Strike), visa context (O-1 **no numbers**)

**2. OpenAI-Safe/timeline_condensed.md** — ≤900 tokens
- Absolute dates for key inflection points (life, business, health, tech)
- Each entry 1-2 lines maximum

**3. OpenAI-Safe/architecture_digest.md** — ≤900 tokens
- Wilton Formula (3:1↔1:3), Lemniscate, Brain vs Tools
- Current hardware (7950X3D+4090 online; 13900K+5090 down/leak)
- TrueNAS role, agents (Claude/Replit, Ollama/local, ChatGPT/Project)

**4. OpenAI-Safe/active_commitments.md** — ≤500 tokens
- Next 7-14 days: obligations, blockers, and decisions

### **Private-Only Files (Keep Local):**

**5. Private-Only/brainstore_inserts.jsonl** 
- Array of rows for tables: `facts_anchor`, `timeline`, `projects`, `people`, `hardware`, `tasks_active`
- Include stable `anchor_id`, `source_path`, `sha256`

**6. Private-Only/doccards.jsonl**
- One object per document chunk: `{doc_id,title,date,layer,tags,hash,summary_300tkn}`

---

## **REDACTION RULES:**

**Replace PII with tokens:**
- `<CPF>` for tax ID
- `<PHONE>` for phone numbers  
- `<ADDRESS>` for addresses
- `<ACCOUNT>` for account numbers
- `<CLIENT_A>`, `<LAWYER>` for sensitive names when needed

**Never include in OpenAI-Safe:**
- Raw keys, secrets, or legal identifiers
- Personal financial details
- Medical specifics beyond general health context
- Exact visa numbers or legal case details

---

## **PROCESS:**

**1. File Discovery:**
- Traverse project directories for `.md`, `.txt`, `.html` files
- Prioritize `.md` canon over chat exports when duplicates exist
- Focus on: attached_assets, core documentation, architecture files

**2. Timeline Construction:**
- Build time-ordered `timeline_condensed.md` using absolute dates (YYYY-MM-DD)
- Extract key inflection points across life, business, health, technology
- Focus on major events, not daily activities

**3. Identity Anchors:**
- Extract Top-30 Identity Anchors (facts that don't change week-to-week)
- Core relationships, work focus, health status, location context
- Sanitize all PII while preserving essential context

**4. Architecture Digest:**
- Focus on ψOS consciousness computing framework
- Hardware infrastructure and operational status
- Agent network and consciousness coordination

**5. Active Commitments:**
- Current obligations and near-term decisions
- Blockers and priority items for next 7-14 days
- Strategic focus areas

---

## **VALIDATION:**

**At completion, output:**
- **Diff report**: counts of anchors, timeline events, doccards, redaction replacements
- **File sizes** for each output
- **STATUS: GOLD_PACK_READY** confirmation

---

## **DELIVERY PROTOCOL:**

**OpenAI-Safe files:**
- Save to `/OpenAI-Safe/` directory
- Confirm token counts under limits
- Ready for ChatGPT Project upload

**Private-Only files:**
- Save to `/Private-Only/` directory  
- Never transmit outside local infrastructure
- Prepare for BrainStore ingestion

**Completion confirmation:**
- Brief summary of generated content
- Exact file sizes and token counts
- Redaction statistics