# Migration Guide: Stratimux v0.3.293

**Version**: v0.3.293 - Quality Type Naming Convention Standardization
**Breaking Change**: Yes
**Impact**: Projects using action type string comparisons

---

## ⚠️ Breaking Change Summary

Stratimux v0.3.293 standardizes ALL quality type strings to follow the **Verbose Split Naming Convention**. This is a **breaking change** that requires updating any code in your project that references action type strings.

**What Changed**: Quality type strings are now consistently formatted as Space-Separated Capitalized strings derived from their camelCase variable names.

**Example**:
```typescript
// BEFORE v0.3.293
type: 'Muxium received a Bad Action'  // Inconsistent
type: 'add Concepts from Que'          // Inconsistent

// AFTER v0.3.293 (Verbose Split Pattern)
type: 'Muxium Bad Action'              // Consistent
type: 'Muxium Add Concepts From Que'   // Consistent
```

---

## 🎯 Who Needs to Migrate?

You need to update your project if you have ANY code that:

1. **Compares action types** using string literals:
   ```typescript
   if (action.type === 'Muxium received a Bad Action') { ... }
   ```

2. **Checks action types** in switch statements:
   ```typescript
   switch (action.type) {
     case 'Muxium received a Bad Action':
   ```

3. **Uses type strings** in tests:
   ```typescript
   expect(action.type).toBe('add Concepts from Que');
   ```

4. **References type constants** directly

5. **Has documentation** referencing old type strings

---

## 🔍 Step 1: Find All Type References in Your Project

Use grep to search your codebase for action type references:

```bash
# Search for potential type string references
grep -r "\.type ===" --include="*.ts" --include="*.js" your-project/
grep -r "\.type ===" --include="*.ts" --include="*.js" your-project/
grep -r "case '" --include="*.ts" --include="*.js" your-project/
grep -r "toBe('" --include="*.test.ts" your-project/
```

**Common locations**:
- Test files (`**/*.test.ts`)
- Type guards and validators
- Switch statements handling actions
- Error handling code checking for BadAction
- Logging/debugging code

---

## 🔧 Step 2: Determine New Type Names

For each old type string you find, convert it using the **Verbose Split Pattern**:

### Conversion Algorithm

```typescript
// Pattern: camelCase variable name → Space-Separated Capitalized type string

function convertToVerboseType(variableName: string): string {
  return variableName
    .split(/(?=[A-Z])/)                    // Split before capital letters
    .map(word =>
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join(' ');
}

// Examples:
// muxiumBadAction → 'Muxium Bad Action'
// addConceptsFromQue → 'Add Concepts From Que'
// ownershipClearPayloadStubs → 'Ownership Clear Payload Stubs'
```

### Quick Reference Table

**Common Stratimux Core Actions**:

| Variable Name | Old Type (v0.3.2) | New Type (v0.3.293) |
|---------------|-------------------|---------------------|
| `muxiumBadAction` | `'Muxium received a Bad Action'` | `'Muxium Bad Action'` |
| `muxiumKick` | `'Kick Muxium'` | `'Muxium Kick'` |
| `muxiumClose` | `'Close Muxium'` | `'Muxium Close'` |
| `muxiumConclude` | `'Conclude'` | `'Muxium Conclude'` |
| `muxiumOpen` | `'Open Muxium'` | `'Muxium Open'` |
| `addConceptsFromQue` | `'add Concepts from Que'` | `'Muxium Add Concepts From Que'` |

**For custom concepts**: Apply the same pattern to your own quality variable names.

---

## 🔄 Step 3: Update Your Code

### Pattern 1: Type Comparisons

```typescript
// BEFORE
if (action.type === 'Muxium received a Bad Action') {
  // handle bad action
}

// AFTER
if (action.type === 'Muxium Bad Action') {
  // handle bad action
}
```

### Pattern 2: Switch Statements

```typescript
// BEFORE
switch (action.type) {
  case 'add Concepts from Que':
    return handleAddConcepts(action);
  case 'Kick Muxium':
    return handleKick(action);
}

// AFTER
switch (action.type) {
  case 'Muxium Add Concepts From Que':
    return handleAddConcepts(action);
  case 'Muxium Kick':
    return handleKick(action);
}
```

### Pattern 3: Test Assertions

```typescript
// BEFORE
expect(action.type).toBe('Muxium received a Bad Action');

// AFTER
expect(action.type).toBe('Muxium Bad Action');
```

### Pattern 4: Type Guards

```typescript
// BEFORE
function isBadAction(action: AnyAction): boolean {
  return action.type === 'Muxium received a Bad Action';
}

// AFTER
function isBadAction(action: AnyAction): boolean {
  return action.type === 'Muxium Bad Action';
}

// OR use the new utility (recommended):
import { isBadAction } from 'stratimux';
```

---

## 🆕 Step 4: Use New Validation Utilities (Recommended)

Stratimux v0.3.293 includes new utilities for bidirectional action validation:

```typescript
import {
  validateAndRecreateAction,
  validateActionBatch,
  isBadAction
} from 'stratimux';

// Validate single action
const validatedAction = validateAndRecreateAction(
  concepts,
  deck,
  incomingAction
);

// Validate multiple actions
const validatedActions = validateActionBatch(
  concepts,
  deck,
  incomingActions
);

// Check if action is BadAction
if (isBadAction(action)) {
  console.error('Received bad action:', action);
}
```

**Benefits**:
- Type-safe action validation
- Prevents execution of unknown actions
- Consistent with new naming convention
- Works across network boundaries (WebSocket, HTTP)

---

## ✅ Step 5: Verify Your Migration

### 1. Run TypeScript Compilation
```bash
npm run build
# or
tsc --noEmit
```

### 2. Run Your Test Suite
```bash
npm test
```

### 3. Search for Remaining Old References
```bash
# Search for common old patterns
grep -r "received a Bad Action" --include="*.ts" your-project/
grep -r "Kick Muxium" --include="*.ts" your-project/
grep -r "add Concepts" --include="*.ts" your-project/

# Should return no results
```

### 4. Test Runtime Behavior
- Test action dispatching
- Test action validation (if using WebSocket/network communication)
- Test error handling for BadActions
- Verify logging output matches expectations

---

## 🔧 Troubleshooting

### Issue: Tests Failing with Type Mismatches

**Symptom**: Tests expecting old type strings fail
```
Expected: 'Muxium received a Bad Action'
Received: 'Muxium Bad Action'
```

**Solution**: Update test assertions to use new type strings (see Step 3, Pattern 3)

---

### Issue: Actions Not Being Recognized

**Symptom**: Actions dispatched but not handled, or showing as BadActions

**Cause**: Code comparing action types using old strings

**Solution**:
1. Find all type comparisons (see Step 1)
2. Update to new type strings (see Step 3)
3. Consider using `validateAndRecreateAction()` for network-received actions

---

### Issue: Custom Concepts Not Working

**Symptom**: Your custom concept qualities not working after upgrade

**Cause**: Your custom quality type strings don't follow Verbose Split Pattern

**Solution**:
1. Update your custom quality type strings to match variable names:
   ```typescript
   // Variable: myConceptCustomAction
   export const myConceptCustomAction = createQualityCard({
     type: 'My Concept Custom Action',  // Must match variable name pattern
     // ...
   });
   ```

2. Update any references to old type strings in your code

---

### Issue: BadAction Validation Not Working

**Symptom**: `isBadAction()` returning false when it should return true

**Cause**: Updated to new utility but still dispatching with old type string

**Solution**: Ensure you're using Stratimux v0.3.293's `muxiumBadAction()` which uses the new type string, or update your custom BadAction creator

---

## 📚 Additional Resources

- **Stratimux Documentation**: [Link to docs]
- **v0.3.293 Changelog**: See `CHANGELOG.md` in Stratimux repository
- **Issue Tracker**: Report migration issues at [repository issues]

---

## 🎯 Migration Checklist

Use this checklist to track your migration progress:

- [ ] Searched codebase for action type references
- [ ] Identified all old type string usages
- [ ] Converted old types to new Verbose Split format
- [ ] Updated type comparisons
- [ ] Updated switch statements
- [ ] Updated test assertions
- [ ] Updated type guards
- [ ] Updated documentation
- [ ] Integrated new validation utilities (optional but recommended)
- [ ] Ran TypeScript compilation successfully
- [ ] Ran test suite successfully
- [ ] Verified no remaining old type references
- [ ] Tested runtime behavior

---

## 💡 Best Practices Going Forward

1. **Use Action Creators**: Always use the action creator functions from your concept's `e` parameter instead of hardcoding type strings

2. **Avoid Hardcoding Types**: Don't compare against string literals; use the action creators or type constants

3. **Use Validation Utilities**: For network-received actions, use `validateAndRecreateAction()` instead of manual validation

4. **Keep Tests Updated**: When updating Stratimux, run your tests to catch type mismatches early

---

**Migration Support**: If you encounter issues not covered in this guide, please open an issue in the Stratimux repository with:
- Your Stratimux version (before and after)
- Error messages or unexpected behavior
- Minimal reproduction example

**Version**: v0.3.293
**Last Updated**: 2025
