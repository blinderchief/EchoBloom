# Testing Guide - Wellness Activities

## Quick Start Testing

### Prerequisites
1. Frontend server running on `localhost:3000`
2. Backend server running on `localhost:8000`
3. Signed in with Clerk authentication

## Test Sequence

### 1. Activities Hub Access
**Steps:**
1. Navigate to `http://localhost:3000/garden`
2. Click "Wellness Activities" button (orange, top right)
3. Verify redirect to `/activities`

**Expected:**
- ✅ Activities hub loads
- ✅ 4 activity cards visible (Breathing, Journal, Gratitude, Grounding)
- ✅ Each card shows icon, title, description
- ✅ Hover effects work (scale, border color change, arrow appears)
- ✅ Pro Tips section at bottom

**Screenshots Needed:**
- Activities hub overview
- Card hover state

---

### 2. Box Breathing Exercise
**Steps:**
1. From activities hub, click "Box Breathing" card
2. Read instructions (4 phases: inhale, hold, exhale, hold)
3. Click "Start" button
4. Observe animated circle for 2-3 cycles
5. Click "Pause" button
6. Click "Reset" button
7. Navigate back with "Back to Activities"

**Expected:**
- ✅ Breathing page loads
- ✅ Instructions card shows 4-step diagram
- ✅ Circle animates (expand on inhale, shrink on exhale, stable on hold)
- ✅ Colors change per phase:
  - Inhale: Blue to Cyan
  - Hold 1: Cyan to Teal
  - Exhale: Purple to Pink
  - Hold 2: Pink to Rose
- ✅ Countdown shows 4 → 3 → 2 → 1 in center
- ✅ Phase text updates ("Breathe In", "Hold", "Breathe Out", "Hold")
- ✅ Cycles counter increments
- ✅ Duration timer counts up (MM:SS)
- ✅ Pause stops animation and timers
- ✅ Reset returns to initial state (0 cycles, 0:00)
- ✅ Milestone notification at 5, 10, 15 cycles

**Test Cases:**
```
Test 1: Complete 5 cycles
Expected: Milestone notification "5 cycles completed 🎉"

Test 2: Pause mid-cycle
Expected: Animation freezes, timers stop, can resume

Test 3: Reset after 3 cycles
Expected: All stats return to 0, phase returns to "Breathe In"
```

**Bugs to Watch:**
- Timer drift (should be accurate to ±1 second)
- Animation sync (visual should match countdown)
- Memory leaks (check DevTools after 10+ cycles)

---

### 3. Guided Journal
**Steps:**
1. From activities hub, click "Guided Journal" card
2. Select "Anxiety & Worry" category
3. Read first prompt
4. Type response (min 20 characters)
5. Click "Next" to progress
6. Navigate to prompt 3/5
7. Click "Previous" to go back
8. Click "Save Progress"
9. Click "Change Category" to return to selection
10. Select "Gratitude" category
11. Complete all 5 prompts
12. Click "Complete" on final prompt

**Expected:**
- ✅ Category selection screen shows 5 cards
- ✅ Each card shows icon, title, description
- ✅ Clicking category loads first prompt
- ✅ Progress bar shows X/5 prompts
- ✅ Prompt number displays correctly (Prompt 1 of 5)
- ✅ Textarea accepts input
- ✅ "Next" button advances to next prompt
- ✅ "Previous" button goes back (disabled on first prompt)
- ✅ Responses persist when navigating back/forward
- ✅ "Save Progress" shows "Saved!" confirmation
- ✅ "Change Category" returns to selection (preserves responses)
- ✅ "Complete" button appears only on prompt 5/5
- ✅ Progress bar fills correctly (20%, 40%, 60%, 80%, 100%)

**Test Cases:**
```
Test 1: Navigate all prompts forward
Expected: 1→2→3→4→5, progress bar 20%→100%

Test 2: Navigate backward
Expected: 5→4→3, responses preserved

Test 3: Save at prompt 3, change category, return
Expected: Can continue from prompt 3 (not implemented yet - will lose data)

Test 4: Type long response (500+ chars)
Expected: Textarea expands, no overflow

Test 5: Complete all 5 prompts
Expected: "Complete" button enabled, clicking shows success
```

**Bugs to Watch:**
- Response loss when navigating categories
- Progress bar calculation errors
- Textarea not auto-focusing

---

### 4. Gratitude Practice
**Steps:**
1. From activities hub, click "Gratitude Practice" card
2. Click "Add Gratitude" button (3 times)
3. Fill first gratitude:
   - What: "My morning coffee"
   - Why: "It gives me a peaceful moment to start my day"
4. Fill second gratitude:
   - What: "My friend who checked in on me"
   - Why: "Made me feel seen and cared for during a hard week"
5. Fill third gratitude (auto-added)
6. Remove second gratitude (trash icon)
7. Re-add gratitude
8. Fill proud moment: "Finished a challenging project at work"
9. Click "Complete Gratitude Practice"

**Expected:**
- ✅ Empty state shows heart icon and "Add Gratitude" button
- ✅ Add button creates new gratitude card (max 3)
- ✅ Each card shows:
  - Number circle (1, 2, 3)
  - "What are you grateful for?" input
  - "Why does this matter?" input with sparkle icon
  - Trash icon
- ✅ Add button disappears after 3 gratitudes
- ✅ Trash icon removes gratitude
- ✅ Proud moment textarea accepts input
- ✅ Complete button disabled until:
  - 3 gratitudes with both fields filled
  - Proud moment filled
- ✅ Complete button enabled when conditions met
- ✅ Clicking Complete shows:
  - Celebration animation (confetti/fireworks)
  - "Beautiful Work!" message
  - "Your gratitude has been saved"
- ✅ Celebration auto-dismisses after 3 seconds
- ✅ Benefits card shows educational content

**Test Cases:**
```
Test 1: Add maximum gratitudes
Expected: 3 gratitudes, Add button hidden

Test 2: Try to complete with incomplete data
Expected: Button disabled, no action

Test 3: Remove and re-add gratitude
Expected: Can remove any, can re-add up to 3 total

Test 4: Complete with all fields filled
Expected: Celebration shows, button changes to "Practice Completed!"

Test 5: Type long gratitude reasons
Expected: Input fields handle 200+ characters
```

**Bugs to Watch:**
- Can add more than 3 gratitudes
- Complete button enables prematurely
- Celebration animation doesn't show
- Input fields not focusing properly

---

### 5. 5-4-3-2-1 Grounding
**Steps:**
1. From activities hub, click "5-4-3-2-1 Grounding" card
2. Read instructions (5 senses exercise)
3. Phase 1 - See (5 things):
   - Type "my laptop" → press Enter (or click Add)
   - Type "the window" → press Enter
   - Type "my coffee mug" → press Enter
   - Type "the clock on the wall" → press Enter
   - Type "my notebook" → press Enter
4. Observe auto-progression to Phase 2 - Touch
5. Complete Touch phase (4 items)
6. Complete Hear phase (3 items)
7. Complete Smell phase (2 items)
8. Complete Taste phase (1 item)
9. Review complete screen
10. Click "Practice Again"

**Expected:**
- ✅ Instructions show sense-by-sense breakdown
- ✅ Phase 1 (See) starts automatically:
  - Icon: Eye (blue gradient)
  - Prompt: "Name 5 things you can see around you"
  - Counter: "5 more to go"
  - Progress: 0/15
- ✅ Input field accepts text
- ✅ "Add" button adds response to list
- ✅ Enter key also adds response
- ✅ Added response shows with checkmark ✓
- ✅ Counter decrements (4, 3, 2, 1 more to go)
- ✅ Progress bar updates (1/15, 2/15, 3/15...)
- ✅ Auto-progresses to next sense after completing current
- ✅ Each sense has unique:
  - Icon (eye, hand, ear, droplet, apple)
  - Color gradient
  - Prompt text
  - Item count
- ✅ Step indicators at bottom show progress (dots)
- ✅ Complete screen (15/15) shows:
  - Success checkmark
  - "You're Grounded! 🌿" message
  - Summary of all 15 responses organized by sense
  - "Return to Garden" button
  - "Practice Again" button
- ✅ "Practice Again" resets to beginning

**Test Cases:**
```
Test 1: Complete full exercise
Expected: All 5 phases, 15 total responses, complete screen

Test 2: Press Enter vs Click Add
Expected: Both methods work identically

Test 3: Try to add empty response
Expected: Add button disabled, Enter does nothing

Test 4: Complete and restart
Expected: All data resets, starts at See (5)

Test 5: Progress bar accuracy
Expected: Shows X/15, fills proportionally (33% at 5/15, 67% at 10/15)
```

**Transitions:**
```
See (5) → Touch (4) → Hear (3) → Smell (2) → Taste (1) → Complete
Auto    Auto      Auto      Auto      Auto      Manual
```

**Bugs to Watch:**
- Doesn't auto-progress to next sense
- Can add empty responses
- Progress bar calculation wrong
- Complete screen doesn't show all responses
- Practice Again doesn't fully reset

---

## Cross-Cutting Tests

### Navigation Flow
```
Test: Full navigation loop
Garden → Activities Hub → Breathing → Back → Journal → Back → 
Gratitude → Back → Grounding → Complete → Return to Garden
Expected: All pages load, no broken links, state preserved where expected
```

### Responsive Design
```
Test: Mobile view (375px width)
1. Resize browser to 375px width
2. Navigate through all activities
Expected: 
- Cards stack vertically
- Text readable without zooming
- Buttons accessible
- Animations smooth
```

### Authentication
```
Test: Signed out user
1. Sign out of Clerk
2. Try to access /activities/breathing directly
Expected: Redirect to landing page (/)

Test: Signed in user
Expected: All activities accessible
```

### Performance
```
Test: Page load times
1. Open DevTools Network tab
2. Navigate to each activity
Expected: Load time < 2 seconds on good connection

Test: Memory usage
1. Open DevTools Performance tab
2. Run Box Breathing for 20 cycles
Expected: Memory stable, no leaks (< 100MB growth)
```

### Accessibility
```
Test: Keyboard navigation
1. Use only Tab and Enter keys
2. Navigate through an activity
Expected: Can complete without mouse

Test: Focus indicators
1. Tab through form fields
Expected: Clear focus rings visible

Test: Screen reader (optional)
1. Enable screen reader
2. Navigate activities hub
Expected: All content readable, buttons labeled
```

## Bug Report Template

```markdown
### Bug: [Short Description]

**Activity:** [Breathing/Journal/Gratitude/Grounding/Hub]
**Severity:** [Critical/High/Medium/Low]
**Reproducible:** [Always/Sometimes/Rarely]

**Steps to Reproduce:**
1. 
2. 
3. 

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happens]

**Screenshots:**
[If applicable]

**Environment:**
- Browser: [Chrome/Firefox/Safari/Edge]
- OS: [Windows/Mac/Linux]
- Screen Size: [Desktop/Tablet/Mobile]

**Console Errors:**
```
[Paste any errors from browser console]
```

**Additional Notes:**
[Any other relevant information]
```

## Success Criteria

All activities should meet these standards:

### Functionality ✅
- [ ] All features work as designed
- [ ] No console errors
- [ ] Data persists appropriately
- [ ] Animations smooth (60fps)
- [ ] No memory leaks

### UX ✅
- [ ] Clear instructions
- [ ] Immediate feedback
- [ ] Error states handled
- [ ] Loading states shown
- [ ] Success confirmations

### Accessibility ✅
- [ ] Keyboard navigable
- [ ] Focus indicators visible
- [ ] Color contrast sufficient
- [ ] Text readable at all sizes
- [ ] Works with screen readers (bonus)

### Performance ✅
- [ ] Load time < 2 seconds
- [ ] Animations 60fps
- [ ] Memory usage stable
- [ ] Mobile responsive

### Design ✅
- [ ] Consistent with design system
- [ ] Gradients render correctly
- [ ] Icons display properly
- [ ] Responsive layout works
- [ ] Glass morphism effects visible

## Test Results Log

Copy this template for each test session:

```markdown
## Test Session: [Date/Time]

**Tester:** [Name]
**Environment:** [Browser/OS]

### Activities Hub
- [ ] Loads correctly
- [ ] Cards clickable
- [ ] Hover effects work
- [ ] Navigation functions

### Box Breathing
- [ ] Animation smooth
- [ ] Timer accurate
- [ ] Controls work
- [ ] Stats track correctly

### Guided Journal
- [ ] Categories load
- [ ] Prompts display
- [ ] Navigation works
- [ ] Responses persist

### Gratitude Practice
- [ ] Add/remove works
- [ ] Validation correct
- [ ] Completion triggers
- [ ] Celebration shows

### 5-4-3-2-1 Grounding
- [ ] Progression works
- [ ] Input accepted
- [ ] Auto-advance triggers
- [ ] Complete screen shows

### Issues Found
1. [Issue description] - [Severity]
2. [Issue description] - [Severity]

### Notes
[Any additional observations]
```

---

**Ready to test?** Start with the Activities Hub and work through each activity systematically. Good luck! 🎯
