# Design System Standardization - Plataforma Angélica

## Current State Analysis

### Border-Radius Inconsistencies Found

**Total instances:** 569 border-radius declarations across 51 CSS files

**Most common values (showing inconsistency):**
- 12px: 71 instances
- 50%: 61 instances (circles - correct)
- 20px: 56 instances
- 8px: 45 instances
- 10px: 43 instances
- 15px: 41 instances
- 25px: 40 instances
- 16px: 33 instances
- 4px: 16 instances
- 0.5rem: 10 instances
- 3px: 8 instances
- 1.5rem: 6 instances
- 0: 6 instances

**Issues Identified:**
1. Mix of px and rem units
2. Too many different values (30+ unique values)
3. No clear design system
4. Some elements with borders but no border-radius

## Standardized Design System

### Border-Radius Scale

Based on the purple/pink gradient theme and modern design principles:

```css
/* Small elements: buttons, badges, inputs */
--radius-sm: 0.5rem;    /* 8px */

/* Medium elements: cards, modals, panels */
--radius-md: 0.75rem;   /* 12px */

/* Large elements: containers, sections */
--radius-lg: 1rem;      /* 16px */

/* Extra large: main containers, instruction boxes */
--radius-xl: 1.5rem;    /* 24px */

/* Circles: avatars, icons */
--radius-full: 50%;

/* Pills: tags, status indicators */
--radius-pill: 9999px;

/* No radius: specific design needs */
--radius-none: 0;
```

### Application Guidelines

1. **Buttons & Inputs:** `0.5rem` (8px)
2. **Cards & Audio Players:** `0.75rem` (12px) to `1rem` (16px)
3. **Instruction Boxes:** `1.5rem` (24px)
4. **Main Containers:** `1.5rem` (24px)
5. **Avatars & Icons:** `50%`
6. **Badges & Pills:** `9999px`

## Implementation Plan

### Phase 1: Critical Files (Sonoterapia & Apertura Angelical)
- ✅ Sonoterapia.css - Already adjusted to 1.5rem for instruction boxes
- ⏳ Verify consistency with Apertura Angelical
- ⏳ Ensure all internal cards use consistent rounded borders

### Phase 2: Main Components
- Dashboard.css
- TiradaAngelical.css
- CanalizacionesAngelicales.css
- CanalizacionesSonoterapia.css
- BlogPodcast.css

### Phase 3: Supporting Components
- All header components
- All modal components
- All card components
- All button components

### Phase 4: Verification
- Visual regression testing
- Responsive design check
- Cross-browser compatibility

## Files to Update (Priority Order)

### High Priority (User-facing main features)
1. `/src/components/Sonoterapia.css` - ✅ DONE
2. `/src/pages/AperturaAngelica.jsx` - Verify
3. `/src/components/Dashboard.css` - 127 instances
4. `/src/components/TiradaAngelical.css` - 29 instances
5. `/src/components/BlogPodcast.css` - 44 instances

### Medium Priority (Secondary features)
6. `/src/components/CanalizacionesAngelicales.css` - 30 instances
7. `/src/components/CanalizacionesSonoterapia.css` - 21 instances
8. `/src/components/AudioCardWorldClass.css` - 12 instances
9. `/src/components/VideoConsultaJitsi.css` - 13 instances

### Low Priority (Supporting components)
10. All remaining CSS files

## Expected Improvements

1. **Visual Consistency:** All rounded corners will follow the same scale
2. **Professional Appearance:** Cohesive design language
3. **Easier Maintenance:** Fewer values to remember
4. **Better UX:** Predictable visual hierarchy
5. **Faster Development:** Clear guidelines for new components

## Next Steps

1. ✅ Complete audit of current state
2. ⏳ Verify Sonoterapia/Apertura Angelical consistency
3. ⏳ Update high-priority files
4. ⏳ Update medium-priority files
5. ⏳ Visual testing and verification
6. ⏳ Documentation and style guide creation

