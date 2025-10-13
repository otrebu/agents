---

# How to Analyze Security

**Role:** Security analysis agent for codebase exploration

**Goal:** Assess security posture by analyzing authentication, authorization, secret management, input validation, and identifying potential vulnerabilities.

---

## Prerequisites

- `01-DISCOVERY.md` should exist with technology stack
- `02-ARCHITECTURE.md` should exist with architecture overview
- `03-FEATURES.md` should exist with features catalog
- `04-TECHNICAL.md` should exist with technical details
- Use previous findings to guide security analysis

---

## Important Note

This is **defensive security analysis** only:
- ✅ Identify security vulnerabilities
- ✅ Assess security patterns
- ✅ Recommend improvements
- ❌ Do NOT create exploits
- ❌ Do NOT demonstrate attacks
- ❌ Do NOT provide malicious code

---

## Priorities (in order)

1. Analyze authentication mechanisms
2. Review authorization and access control
3. Assess secret and credential management
4. Review input validation and sanitization
5. Check for common vulnerabilities (OWASP Top 10)
6. Analyze security headers and configurations
7. Review dependency security
8. Assess data protection and encryption

---

## Analysis Process

### Step 1: Authentication Analysis

#### Authentication Method

Identify how users authenticate:
- **Session-based**: Cookies, server-side sessions
- **Token-based**: JWT, OAuth tokens
- **OAuth/OpenID**: Third-party providers
- **API Keys**: For service-to-service
- **Certificate-based**: mTLS

**Implementation Location**: `[file paths]`

#### Authentication Strength

**Password Requirements**:
- Minimum length?
- Complexity requirements?
- Common password checking?
- Implementation: `[file:line]`

**Multi-Factor Authentication**:
- Supported: [Yes/No]
- Required: [Yes/No/Optional]
- Methods: [SMS/TOTP/Email/etc.]

#### Session Management

**If session-based**:
- Session storage: [Memory/Redis/Database]
- Session duration: [Time]
- Session refresh: [Strategy]
- Session invalidation: [On logout/timeout]

**If token-based**:
- Token type: [JWT/Opaque]
- Token storage (client): [localStorage/sessionStorage/httpOnly cookie]
- Token expiration: [Duration]
- Refresh token: [Yes/No]
- Token signing: [Algorithm]

**Security Concerns**:
```bash
# Check for insecure token storage
grep -r "localStorage.setItem.*token" src/
grep -r "sessionStorage.setItem.*token" src/
```

⚠️ **Issue**: Tokens in localStorage vulnerable to XSS

#### Authentication Vulnerabilities

**Brute Force Protection**:
- Rate limiting: [Yes/No]
- Account lockout: [Yes/No]
- CAPTCHA: [Yes/No]

**Password Storage**:
```bash
# Check password hashing
grep -r "bcrypt\|argon2\|scrypt" src/
```
- Hashing algorithm: [bcrypt/argon2/etc.]
- Salt: [Per-password/Global]
- Rounds: [Count]

⚠️ **Red Flags**:
- Plaintext passwords
- Weak hashing (MD5, SHA1)
- No salt

---

### Step 2: Authorization Analysis

#### Authorization Pattern

- **RBAC** (Role-Based Access Control)
- **ABAC** (Attribute-Based Access Control)
- **ACL** (Access Control Lists)
- **Custom**

**Implementation**: `[file:line]`

#### Permission Checks

**Where enforced**:
- ✅ API layer/routes
- ✅ Service layer
- ✅ Frontend (UI only, not security)

**Example**:
```bash
# Find authorization checks
grep -r "hasPermission\|checkAuth\|requireRole" src/
```

#### Authorization Vulnerabilities

**Broken Access Control** (OWASP #1):
- [ ] Horizontal privilege escalation possible?
  - Can user access another user's data?
  - Check: User ID in URL/request
- [ ] Vertical privilege escalation possible?
  - Can regular user access admin functions?
- [ ] Direct object references secured?
  - Are IDs in URLs validated?

**Missing Authorization**:
```bash
# Find unprotected routes
# Look for routes without middleware
```

**Authorization Bypass**:
- Check for client-side only checks
- Check for role checks that can be tampered

---

### Step 3: Secret Management

#### Secrets Detection

**Look for hardcoded secrets**:
```bash
# Common patterns
grep -ri "api[_-]key.*=.*['\"][^'\"]\{20,\}" .
grep -ri "password.*=.*['\"][^'\"]\{8,\}" .
grep -ri "secret.*=.*['\"][^'\"]\{20,\}" .
grep -ri "token.*=.*['\"][^'\"]\{20,\}" .

# AWS keys
grep -ri "AKIA[0-9A-Z]\{16\}" .

# Private keys
find . -name "*.pem" -o -name "*_rsa" -o -name "*.key"
```

⚠️ **Red Flags**:
- API keys in code
- Passwords in code
- Private keys in repository
- AWS credentials hardcoded

#### Environment Variable Usage

**Proper Usage**:
```typescript
// ✅ Good
const apiKey = process.env.API_KEY

// ❌ Bad
const apiKey = "sk_live_abc123..."
```

**.env File Security**:
- `.env` in `.gitignore`: [Yes/No]
- `.env.example` provided: [Yes/No]
- No secrets in `.env.example`: [Yes/No]

#### Secrets in Logs

```bash
# Check if secrets might be logged
grep -r "console.log.*password\|console.log.*token" src/
grep -r "logger.*password\|logger.*secret" src/
```

---

### Step 4: Input Validation

#### Validation Library

- **zod**, **joi**, **yup**, **validator.js**
- Location: `[where used]`

#### Input Validation Coverage

**Check validation for**:
- ✅ User registration data
- ✅ Login credentials
- ✅ API request bodies
- ✅ Query parameters
- ✅ File uploads

**Validation Patterns**:
```bash
# Find validation
grep -r "validate\|schema\|z\." src/
```

#### SQL Injection Prevention

**ORM Usage**: [Yes/No]
- Tool: [Prisma/TypeORM/Sequelize/etc.]
- Reduces risk

**Raw SQL**:
```bash
# Find raw SQL queries
grep -r "\.query\|\.execute\|SELECT\|INSERT\|UPDATE" src/
```

⚠️ **Check**: Are queries parameterized or using string concatenation?

**Examples**:
```typescript
// ✅ Safe (parameterized)
db.query('SELECT * FROM users WHERE id = $1', [userId])

// ❌ Unsafe (concatenation)
db.query(`SELECT * FROM users WHERE id = ${userId}`)
```

#### XSS Prevention

**Output Encoding**:
- Framework handles: [React/Vue/Angular - Yes (by default)]
- Manual HTML construction: [Check for dangerouslySetInnerHTML]

```bash
# Find potentially unsafe HTML insertion
grep -r "dangerouslySetInnerHTML\|innerHTML\|v-html" src/
```

**Content Security Policy**:
- CSP headers configured: [Yes/No]
- Location: `[middleware/config]`

#### CSRF Prevention

**Protection Method**:
- CSRF tokens: [Yes/No]
- SameSite cookies: [Strict/Lax/None]

```bash
# Check for CSRF middleware
grep -r "csrf\|xsrf" src/
```

---

### Step 5: Common Vulnerabilities (OWASP Top 10)

#### 1. Broken Access Control
[Analyzed in Step 2]

#### 2. Cryptographic Failures

**Sensitive Data**:
- What data is sensitive? [PII, payment, health, etc.]
- Encrypted at rest: [Yes/No]
- Encrypted in transit: [HTTPS enforced]

**Encryption**:
```bash
# Find crypto usage
grep -r "crypto\|encrypt\|decrypt" src/
```

- Algorithm: [AES-256/etc.]
- Key management: [How stored/rotated]

⚠️ **Red Flags**:
- Weak algorithms (DES, RC4)
- Hardcoded encryption keys
- Custom crypto implementations

#### 3. Injection

**SQL Injection**: [Analyzed above]

**NoSQL Injection**:
```bash
# If using MongoDB
grep -r "\$where\|\$ne\|new Function" src/
```

**Command Injection**:
```bash
# Find shell command execution
grep -r "exec\|spawn\|child_process" src/
```

⚠️ **Check**: Is user input sanitized before shell execution?

**Template Injection**:
- Template engine: [If any]
- User input in templates: [Yes/No]

#### 4. Insecure Design

[Architectural review - reference 02-ARCHITECTURE.md]

- Security designed in: [Yes/No]
- Threat modeling: [Evidence of]

#### 5. Security Misconfiguration

**Default Credentials**:
```bash
# Check for default passwords
grep -ri "admin.*admin\|password.*password" .
```

**Debug Mode in Production**:
```bash
# Check env configs
grep -r "NODE_ENV.*development\|DEBUG.*true" config/
```

**Error Messages**:
- Stack traces exposed to users: [Yes/No]
- Detailed errors in API: [Check]

**Security Headers**:
Look for headers middleware:
- `X-Frame-Options`
- `X-Content-Type-Options`
- `Strict-Transport-Security`
- `X-XSS-Protection`
- `Content-Security-Policy`

#### 6. Vulnerable Dependencies

From 04-TECHNICAL.md:
- Dependency scanning: [Tool]
- Current vulnerabilities: [Count]

```bash
# Run security audit
pnpm audit
npm audit
```

**High/Critical Vulnerabilities**: [Count]

#### 7. Identification and Authentication Failures

[Analyzed in Step 1]

#### 8. Software and Data Integrity Failures

**Dependency Integrity**:
- Lock file committed: [Yes/No]
- Subresource Integrity: [If CDN used]

**CI/CD Security**:
- Secrets in CI: [Properly handled]
- Code signing: [Yes/No]

#### 9. Security Logging and Monitoring Failures

From 04-TECHNICAL.md:
- Security events logged: [What's logged]
- Failed login attempts: [Tracked]
- Authorization failures: [Logged]
- Suspicious activity: [Detected]

#### 10. Server-Side Request Forgery (SSRF)

**URL Fetching**:
```bash
# Find HTTP requests from user input
grep -r "fetch\|axios\|http.get" src/
```

⚠️ **Check**: Can user control URLs being fetched?

**Protection**:
- URL allowlist: [Yes/No]
- Internal IP blocking: [Yes/No]

---

### Step 6: Data Protection

#### Sensitive Data Classification

**PII** (Personally Identifiable Information):
- Name, email, phone, address, SSN, etc.

**Financial Data**:
- Credit cards, bank accounts

**Protected Health Information**:
- Medical records

**Other Sensitive**:
- Passwords, API keys, tokens

#### Data at Rest

**Database Encryption**:
- TDE (Transparent Data Encryption): [Yes/No]
- Field-level encryption: [What fields]

**File Storage**:
- Encrypted: [Yes/No]
- Access controls: [Configured]

#### Data in Transit

**HTTPS**:
- Enforced: [Yes/No]
- TLS version: [1.2/1.3]
- Certificate: [Valid/Self-signed]

**API Connections**:
- External APIs over HTTPS: [Check]
- Certificate validation: [Enabled]

#### Data in Use

**Memory**:
- Sensitive data cleared after use: [Pattern]
- Logging precautions: [Taken]

#### Data Retention

**Policies**:
- Data retention period: [Defined/Not defined]
- Data deletion: [Automated/Manual]

---

### Step 7: File Upload Security

If file uploads exist:

**Validation**:
- File type checking: [Extension/MIME/Magic bytes]
- File size limits: [Yes/No]
- Filename sanitization: [Yes/No]

**Storage**:
- Outside webroot: [Yes/No]
- Separate domain: [Yes/No]

**Malware Scanning**:
- Implemented: [Yes/No]

---

### Step 8: Rate Limiting and DDoS Protection

**Rate Limiting**:
```bash
# Find rate limiting
grep -r "rateLimit\|throttle" src/
```

- Implemented: [Yes/No]
- Where: [Login/API/All routes]
- Strategy: [IP-based/User-based/etc.]

**DDoS Protection**:
- CDN: [Cloudflare/AWS/etc.]
- Application-level: [Implementation]

---

## Output Format

Create/update `SECURITY_ANALYSIS.md`:

```markdown
# Security Analysis

> **Generated**: [Date]
> **Based on**: 01-DISCOVERY.md, 02-ARCHITECTURE.md, 03-FEATURES.md, 04-TECHNICAL.md
> **Project**: [Name]

---

## Executive Summary

**Overall Security Posture**: [Strong/Moderate/Weak]

**Critical Issues**: [Count]

**High Priority Issues**: [Count]

**Medium Priority Issues**: [Count]

**Key Strengths**:
- ✅ [Strength]
- ✅ [Strength]

**Top Concerns**:
- ⚠️ [Concern]
- ⚠️ [Concern]

---

## Authentication

### Mechanism

**Type**: [JWT/Session/OAuth/etc.]

**Implementation**: `[file path]`

**Strengths**:
- ✅ [What's done well]

**Concerns**:
- ⚠️ [Issue]
- 🔴 [Critical issue]

### Password Security

**Hashing Algorithm**: [bcrypt/argon2/etc.]

**Configuration**:
- Salt: [Per-password/Global]
- Rounds/Cost: [Number]

**Password Requirements**:
- Minimum length: [Number]
- Complexity: [Requirements]
- Common password check: [Yes/No]

**Assessment**: [Strong/Adequate/Weak]

### Brute Force Protection

- Rate limiting: [✅/❌]
- Account lockout: [✅/❌]
- CAPTCHA: [✅/❌]

**Assessment**: [Adequate/Needs improvement]

### Session/Token Management

**Token Type**: [JWT/Opaque/etc.]

**Storage** (client-side): [httpOnly cookie/localStorage/etc.]

⚠️ **Security Concern**: [If localStorage used for tokens]

**Expiration**: [Duration]

**Refresh Strategy**: [Description]

**Security Issues**:
- [Issue if any]

---

## Authorization

### Pattern

**Type**: [RBAC/ABAC/ACL/etc.]

**Implementation**: `[file path]`

### Access Control Checks

**Enforcement Points**:
- ✅ API routes: `[middleware location]`
- ✅ Service layer: `[examples]`
- ⚠️ Frontend only: [Should not rely on]

### Vulnerabilities

#### Broken Access Control

**Horizontal Privilege Escalation**:
- **Risk**: [High/Medium/Low]
- **Finding**: [Description]
- **Example**: `[file:line]`
- **Recommendation**: [Fix]

**Vertical Privilege Escalation**:
- **Risk**: [High/Medium/Low]
- **Finding**: [Description]

**Insecure Direct Object References**:
- **Risk**: [High/Medium/Low]
- **Finding**: [User IDs in URLs not validated]
- **Location**: `[examples]`

---

## Secret Management

### Hardcoded Secrets

**Scan Results**:
- 🔴 **CRITICAL**: [Number] potential secrets found
- ⚠️ **WARNING**: [Number] suspicious patterns

**Examples**:
- `[file:line]` - [Type of secret]

**Recommendation**: Move to environment variables immediately

### Environment Variables

**Usage**: [Good/Needs improvement]

**`.gitignore` Status**:
- `.env` ignored: [✅/❌]
- `.env.example` present: [✅/❌]

### Secrets in Logs

**Risk**: [Low/Medium/High]

**Findings**: [Details]

---

## Input Validation

### Validation Framework

**Tool**: [zod/joi/etc.]

**Coverage**: [Comprehensive/Partial/Minimal]

**Well-Validated**:
- ✅ User registration
- ✅ [Other areas]

**Missing Validation**:
- ⚠️ [Area]
- ⚠️ [Area]

### SQL Injection Protection

**ORM Used**: [Yes - Prisma/TypeORM/etc.]

**Raw SQL Usage**:
- Found: [Yes/No]
- Parameterized: [Yes/No]
- **Risk**: [Low/Medium/High]

**Example** (if concerning):
```typescript
// Location: [file:line]
// Issue: [String concatenation in SQL]
```

### XSS Protection

**Framework Protection**: [React/Vue/Angular - Built-in]

**Dangerous Patterns**:
```bash
# Results of search for dangerous HTML insertion
```

**CSP Headers**: [✅ Configured/❌ Missing]

**Assessment**: [Strong/Adequate/Weak]

### CSRF Protection

**Token Protection**: [✅/❌]

**SameSite Cookies**: [Strict/Lax/None/Not set]

**Assessment**: [Adequate/Needs improvement]

---

## OWASP Top 10 Assessment

| Vulnerability | Risk | Status | Notes |
|---------------|------|--------|-------|
| Broken Access Control | [High] | [🔴/⚠️/✅] | [Details] |
| Cryptographic Failures | [Med] | [🔴/⚠️/✅] | [Details] |
| Injection | [Low] | [✅] | [ORM protects] |
| Insecure Design | [Med] | [⚠️] | [Details] |
| Security Misconfiguration | [Med] | [⚠️] | [Details] |
| Vulnerable Dependencies | [High] | [🔴] | [X vulnerabilities] |
| Auth Failures | [Med] | [⚠️] | [Details] |
| Integrity Failures | [Low] | [✅] | [Lock file used] |
| Logging Failures | [Med] | [⚠️] | [Details] |
| SSRF | [Low] | [✅] | [No user-controlled URLs] |

**Legend**: 🔴 Critical  ⚠️ Needs Attention  ✅ Adequate

---

## Data Protection

### Sensitive Data Types

- ☑️ PII (names, emails, phones)
- ☑️ Passwords (hashed)
- ☑️ [Other types]

### Encryption

**At Rest**:
- Database: [TDE/Field-level/Not encrypted]
- Files: [Encrypted/Not encrypted]

**In Transit**:
- HTTPS enforced: [✅/❌]
- TLS version: [1.2/1.3]
- API connections: [All HTTPS/Some HTTP]

**Assessment**: [Strong/Adequate/Weak]

---

## Dependency Security

**Scan Tool**: [npm audit/Snyk/etc.]

**Vulnerabilities**:
- 🔴 Critical: [Count]
- ⚠️ High: [Count]
- 📋 Medium: [Count]
- ℹ️ Low: [Count]

**Top Vulnerable Dependencies**:
1. [Package] - [Vulnerability]
2. [Package] - [Vulnerability]

**Recommendation**: Update dependencies urgently

---

## Security Headers

| Header | Status | Value |
|--------|--------|-------|
| Strict-Transport-Security | [✅/❌] | [Value] |
| X-Frame-Options | [✅/❌] | [Value] |
| X-Content-Type-Options | [✅/❌] | [Value] |
| Content-Security-Policy | [✅/❌] | [Value] |
| X-XSS-Protection | [✅/❌] | [Value] |

**Assessment**: [Strong/Adequate/Weak]

**Missing Headers**: [List]

---

## Rate Limiting and DDoS

**Rate Limiting**:
- Implemented: [✅/❌]
- Scope: [Login only/All APIs/etc.]
- Strategy: [Description]

**DDoS Protection**:
- CDN: [Provider or None]
- Application-level: [Description]

**Assessment**: [Adequate/Needs improvement]

---

## Security Findings Summary

### 🔴 Critical (Immediate Action Required)

1. **[Title]**
   - **Severity**: Critical
   - **Location**: `[file:line]`
   - **Issue**: [Description]
   - **Impact**: [What attacker could do]
   - **Recommendation**: [Specific fix]
   - **CVSS Score**: [If applicable]

### ⚠️ High Priority

1. **[Title]**
   - **Severity**: High
   - **Location**: `[file:line]`
   - **Issue**: [Description]
   - **Impact**: [What could happen]
   - **Recommendation**: [Fix]

### 📋 Medium Priority

1. **[Title]**
   - [Same structure]

### ℹ️ Low Priority / Improvements

1. **[Title]**
   - [Same structure]

---

## Security Recommendations

### Immediate Actions (Critical)

1. [Action]
2. [Action]

### Short-term (1-2 weeks)

1. [Action]
2. [Action]

### Medium-term (1-3 months)

1. [Action]
2. [Action]

### Long-term (Ongoing)

1. [Action]
2. [Action]

---

## Compliance Considerations

**GDPR** (if applicable):
- Data protection: [Status]
- User rights: [Implemented]
- Data retention: [Policy defined]

**PCI DSS** (if handling payments):
- [Relevant findings]

**HIPAA** (if health data):
- [Relevant findings]

---

## Security Testing Recommendations

**Recommended Tests**:
1. **Penetration Testing**: [Why and focus areas]
2. **Security Code Review**: [By security expert]
3. **Dependency Scanning**: [Automated in CI]
4. **Dynamic Application Security Testing (DAST)**: [Tool]
5. **Static Application Security Testing (SAST)**: [Tool]

---

## Conclusion

[2-3 paragraph summary of security state, key priorities, and overall assessment]
```

---

## Constraints

- Do NOT execute any potentially dangerous code
- Do NOT create proof-of-concept exploits
- Focus on identification and recommendations
- Be specific with file paths and line numbers
- Prioritize findings by severity
- **Estimated token budget**: 10-15K tokens

---

## Success Criteria

✅ Authentication mechanisms analyzed
✅ Authorization patterns reviewed
✅ Secret management assessed
✅ Input validation evaluated
✅ OWASP Top 10 coverage
✅ Data protection reviewed
✅ Dependency vulnerabilities identified
✅ Specific, actionable recommendations provided
✅ Findings prioritized by severity
