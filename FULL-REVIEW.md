---
phase: full-code-review
reviewed: 2026-06-10T00:00:00Z
depth: deep
files_reviewed: 9
files_reviewed_list:
  - src/gen-xml.ts
  - src/gen-objects.ts
  - src/gen-charts.ts
  - src/gen-tables.ts
  - src/gen-media.ts
  - src/gen-utils.ts
  - src/slide.ts
  - src/pptxgen.ts
  - src/core-interfaces.ts
findings:
  critical: 0
  warning: 7
  info: 6
  total: 13
status: issues_found
---

# Phase Full: Code Review Report

**Reviewed:** 2026-06-10T00:00:00Z
**Depth:** deep
**Files Reviewed:** 9
**Status:** issues_found

## Summary

Reviewed the PptxGenJS XML generation layer for architecture, ID assignment patterns, and areas requiring modification to support custom element IDs for animation. The codebase uses a formula-based ID system derived from array indices (`idx + 2`) with some special cases for tables and media. There is no current mechanism for users to specify custom element IDs, which is the primary gap for animation support.

## Warnings

### WR-01: No Custom Element ID Mechanism

**File:** `src/core-interfaces.ts:1804`
**Issue:** The `ObjectOptions` interface (which extends `ImageProps`, `PositionProps`, `ShapeProps`, `TableCellProps`, `TextPropsOptions`) has no `objectId` or `id` property. Users cannot assign custom IDs to shapes/text/images for animation targeting.

**Fix:** Add an optional `objectId?: string` property to `ObjectOptions` interface (line 1804).

---

### WR-02: Index-Based IDs Are Fragile

**File:** `src/gen-xml.ts:412`
**Issue:** Text/shape elements use `<p:cNvPr id="${idx + 2}"...>` where `idx` is the array index from `.forEach()`. If slide objects are reordered or removed, IDs change and animations break.

```typescript
// Line 412:
strSlideXml += `<p:cNvPr id="${idx + 2}" name="${slideItemObj.options.objectName}">`
```

**Fix:** Consider using a stable counter that persists across exports, or allow user-specified ID override.

---

### WR-03: Table ID Formula Is Order-Dependent

**File:** `src/gen-xml.ts:175`
**Issue:** Tables use `intTableNum * slide._slideNum + 1` for ID. The `intTableNum` is incremented per table on each slide. This creates unique IDs but they are not stable if table order changes.

```typescript
strXml = `<p:graphicFrame><p:nvGraphicFramePr><p:cNvPr id="${intTableNum * slide._slideNum + 1}" name="${slideItemObj.options.objectName}"/>`
```

**Fix:** Same as WR-02 - provide optional custom ID support.

---

### WR-04: Media ID Depends on Relationship ID

**File:** `src/gen-xml.ts:675,692`
**Issue:** Media elements use `slideItemObj.mediaRid + 2` for their ID. This creates a dependency on the relationship ID system which may not align with animation ID requirements.

```typescript
// Line 675:
strSlideXml += `<p:cNvPr id="${slideItemObj.mediaRid + 2}" name="${slideItemObj.options.objectName}"/>`
```

**Fix:** Consider decoupling media element IDs from relationship IDs.

---

### WR-05: No Uniqueness Validation

**File:** `src/gen-xml.ts`
**Issue:** There is no validation to ensure user-provided custom IDs would be unique across the slide. A collision could corrupt the PPTX file.

**Fix:** Add uniqueness checking when custom IDs are provided, or establish a clear namespace/prefix convention.

---

### WR-06: Hardcoded Slide Number ID

**File:** `src/gen-xml.ts:742`
**Issue:** Slide number placeholder uses hardcoded `id="25"`:

```typescript
strSlideXml += ' <p:cNvPr id="25" name="Slide Number Placeholder 0"/>'
```

**Fix:** This is unlikely to conflict with user IDs since it starts at 25 and user IDs would typically be lower, but consider using a reserved namespace.

---

### WR-07: Group Shape Uses id="1"

**File:** `src/gen-xml.ts:102`
**Issue:** The group shape tree root always uses `id="1"`:

```typescript
strSlideXml += '<p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>'
```

This is standard OOXML behavior but means `id="1"` is reserved. Any custom ID system should exclude `1`.

**Fix:** Document that `id="1"` is reserved for the group shape container.

---

## Info

### IN-01: Debug Console.log Still Present

**File:** `src/gen-utils.ts:77`
**Issue:** `console.log('str', str)` appears to be debug output that should be removed:

```typescript
export function encodeXmlEntities (xml: string): string {
    // ...
    console.log('str', str)
    return str
}
```

**Fix:** Remove this line before production use.

---

### IN-02: Debug Console.log in Text Body Generation

**File:** `src/gen-xml.ts:1402`
**Issue:** `console.log('genXmlTextBody:', strSlideXml)` should be removed:

```typescript
// STEP 7: Close the textBody
strSlideXml += slideObj._type === SLIDE_OBJECT_TYPES.tablecell ? '</a:txBody>' : '</p:txBody>'
console.log('genXmlTextBody:', strSlideXml) // <-- debug artifact
return strSlideXml
```

**Fix:** Remove debug logging.

---

### IN-03: UUID Generator Exists But Unused

**File:** `src/gen-utils.ts:50-56`
**Issue:** A UUID generator exists but is not used for element IDs in the XML generation layer:

```typescript
export function getUuid (uuidFormat: string): string {
    return uuidFormat.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0
        const v = c === 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
    })
}
```

This function is used in `gen-charts.ts` for scatter chart field IDs, but NOT for shape element IDs.

**Fix:** For animation support, consider using UUIDs or a similar stable ID scheme.

---

### IN-04: Chart Field IDs Use UUIDs

**File:** `src/gen-charts.ts:1141,1152`
**Issue:** Chart scatter labels use UUIDs for internal field identification:

```typescript
strXml += '<a:fld id="{'+getUuid('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx')+'}" type="XVALUE">'
// ...
strXml += '<a:fld id="{'+getUuid('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx')+'}" type="YVALUE">'
```

This demonstrates UUID generation is already in use for certain ID attributes.

**Fix:** Consider similar approach for element IDs.

---

### IN-05: objectName Exists But Not Used for ID

**File:** `src/gen-objects.ts:695-697`
**Issue:** `objectName` is set on options but only used as the `name` attribute in XML, not as an ID:

```typescript
options.objectName = options.objectName
    ? encodeXmlEntities(options.objectName)
    : `Shape ${target._slideObjects.filter(obj => obj._type === SLIDE_OBJECT_TYPES.text).length}`
```

The `name` attribute in OOXML is separate from `id` and is not suitable for animation targeting.

**Fix:** Clarify that `objectName` is for human-readable names in PowerPoint's selection pane, not for programmatic ID.

---

### IN-06: modId Hardcoded in Tables

**File:** `src/gen-xml.ts:178`
**Issue:** Tables include a hardcoded `p14:modId` value:

```typescript
'<p:extLst><p:ext uri="{D42A27DB-BD31-4B8C-83A1-F6EECF244321}"><p14:modId xmlns:p14="http://schemas.microsoft.com/office/powerpoint/2010/main" val="1579011935"/></p:ext></p:extLst>'
```

**Fix:** This is a Microsoft Office internal modification ID - likely fine to leave as-is.

---

## Architectural Analysis for Animation Support

### Current ID Assignment Summary

| Element Type | ID Source | Location (gen-xml.ts) |
|-------------|-----------|----------------------|
| Group Shape | Hardcoded `1` | Line 102 |
| Text/Shape | `idx + 2` | Line 412 |
| Image | `idx + 2` | Line 579 |
| Table | `intTableNum * slide._slideNum + 1` | Line 175 |
| Media | `mediaRid + 2` | Lines 675, 692 |
| Chart | `idx + 2` | Line 716 |
| Slide Number | Hardcoded `25` | Line 742 |

### Required Changes for Custom Element IDs

1. **Add `objectId` property** to `ObjectOptions` in `core-interfaces.ts`

2. **Modify `slideObjectToXml()`** in `gen-xml.ts` to use custom ID when provided:
   - For text/shapes: Check `slideItemObj.options.objectId` before using `idx + 2`
   - For images: Check `options.objectId` before using `idx + 2`
   - For tables: Check `options.objectId` before using formula
   - For media: Check `options.objectId` before using `mediaRid + 2`
   - For charts: Check `options.objectId` before using `idx + 2`

3. **Add uniqueness validation** to prevent ID collisions

4. **Document ID namespace** - clarify that `1` is reserved for group shape, `25` for slide numbers

### OOXML Animation ID Requirements

PowerPoint animations typically target elements via their `id` attribute on `<p:cNvPr>` elements. The animation XML (`timing.xml`) references these IDs. For custom animation support:

- Each shape needs a stable, user-specified ID
- IDs must be unique within a slide
- IDs should persist across exports if the object is not removed

### Existing Patterns to Follow

- `SLDNUMFLDID` constant for slide number field ID (used in timing/anim context)
- Chart field IDs using `getUuid()` for scatter chart data labels
- The `objectName` property already exists as an optional user-facing identifier

---

_Reviewed: 2026-06-10T00:00:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: deep_