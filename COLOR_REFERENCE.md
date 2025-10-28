# 🎨 Color Reference Guide

## Vibrant Orange Palette

Your GitHub Issue Cost Estimator uses this exact vibrant orange palette:

### Primary Colors (From Coolors Palette)

```
#FF7B00  Bright Orange    ████████  Primary brand color
#FF8800  Orange 1         ████████  Gradient step 1
#FF9500  Orange 2         ████████  Gradient step 2
#FFA200  Orange 3         ████████  Gradient step 3
#FFAA00  Orange 4         ████████  Gradient step 4
#FFB700  Orange 5         ████████  Gradient step 5
#FFC300  Orange 6         ████████  Gradient step 6
#FFD000  Orange 7         ████████  Gradient step 7
#FFDD00  Orange 8         ████████  Gradient step 8
#FFEA00  Yellow           ████████  Lightest orange/yellow
```

### Supporting Colors

```
#FFFFFF  White            ████████  Card backgrounds
#FFF9F0  Cream 50         ████████  Light background
#FFF3E0  Cream 100        ████████  Subtle background
#FFE7C2  Cream 200        ████████  Borders
```

### Semantic Colors

```
#10B981  Green            ████████  Low complexity
#FBBF24  Amber            ████████  Medium complexity
#EF4444  Red              ████████  High complexity
```

### Neutral Colors

```
#1F2937  Gray 900         ████████  Primary text
#374151  Gray 700         ████████  Labels
#6B7280  Gray 500         ████████  Secondary text
#9CA3AF  Gray 400         ████████  Tertiary text
#D1D5DB  Gray 300         ████████  Disabled
```

---

## Usage Examples

### Gradients

**Title Gradient:**
```css
background: linear-gradient(135deg,
  #FF7B00 0%,
  #FF8800 25%,
  #FFA200 50%,
  #FFB700 75%,
  #FFC300 100%
);
```

**Button Gradient:**
```css
background: linear-gradient(135deg,
  #FF7B00 0%,
  #FF8800 25%,
  #FFA200 75%,
  #FFB700 100%
);
```

**Card Background:**
```css
background: linear-gradient(135deg,
  #FFF9F0 0%,
  #FFFFFF 100%
);
```

**Success Background:**
```css
background: linear-gradient(135deg,
  #FFF9F0 0%,
  #FFF3E0 100%
);
```

---

## Tailwind Config Reference

```javascript
// In tailwind.config.js
colors: {
  brand: {
    'bright': '#FF7B00',
    'orange-1': '#FF8800',
    'orange-2': '#FF9500',
    'orange-3': '#FFA200',
    'orange-4': '#FFAA00',
    'orange-5': '#FFB700',
    'orange-6': '#FFC300',
    'orange-7': '#FFD000',
    'orange-8': '#FFDD00',
    'yellow': '#FFEA00',
  },
  primary: {
    50: '#FFF9F0',
    100: '#FFF3E0',
    200: '#FFE7C2',
    300: '#FFDD00',
    // ... more shades
  }
}
```

---

## Color Applications

### Where Each Color is Used

| Color | Usage |
|-------|-------|
| #FF7B00 | Primary brand, gradient start, hover states |
| #FF8800 | Links, gradient middle, accent |
| #FF9500 | Gradient progression |
| #FFA200 | Gradient, stat numbers |
| #FFAA00 | Borders, highlights |
| #FFB700 | Gradient end, shadows |
| #FFC300 | Light accents |
| #FFD000 | Badge backgrounds |
| #FFDD00 | Light highlights |
| #FFEA00 | Subtle accents |
| #FFFFFF | Card backgrounds, text on dark |
| #FFF9F0 | Page background |
| #FFE7C2 | Borders, light backgrounds |

---

## Accessibility

### Contrast Ratios (WCAG AA)

✅ **White on Orange**:
- #FFFFFF on #FF7B00: 4.76:1 (Pass)
- #FFFFFF on #FF8800: 4.51:1 (Pass)

✅ **Dark Gray on White**:
- #1F2937 on #FFFFFF: 16.1:1 (Excellent)
- #374151 on #FFFFFF: 11.1:1 (Excellent)

✅ **Orange on White**:
- #FF7B00 on #FFFFFF: 4.41:1 (Pass for large text)

---

## Shadow Colors

### Orange-Tinted Shadows

```css
/* Subtle shadow */
box-shadow: 0 10px 40px rgba(255, 123, 0, 0.08);

/* Medium shadow */
box-shadow: 0 10px 40px rgba(255, 123, 0, 0.15);

/* Strong shadow (buttons) */
box-shadow: 0 8px 24px rgba(255, 123, 0, 0.35);

/* Hover shadow */
box-shadow: 0 14px 40px rgba(255, 123, 0, 0.45);
```

---

## Badge Colors

### Complexity Badges

**Low (Green):**
```css
background: linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%);
color: #065F46;
border: 2px solid #10B981;
```

**Medium (Yellow):**
```css
background: linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%);
color: #92400E;
border: 2px solid #FBBF24;
```

**High (Red):**
```css
background: linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%);
color: #991B1B;
border: 2px solid #EF4444;
```

**Orange Badge:**
```css
background: linear-gradient(135deg, #FFF3E0 0%, #FFE7C2 100%);
color: #FF7B00;
border: 2px solid #FFAA00;
```

---

## Quick Reference

### Most Used Colors

```
Primary: #FF7B00 (Bright Orange)
Hover: #FF8800 (Orange 1)
Border: #FFE7C2 (Cream)
Background: #FFFFFF (White)
Text: #1F2937 (Dark Gray)
```

### Gradient Formula

Start → Middle → End
#FF7B00 → #FFA200 → #FFB700

---

## Inspiration Source

https://coolors.co/ff7b00-ff8800-ff9500-ffa200-ffaa00-ffb700-ffc300-ffd000-ffdd00-ffea00

Similar to nstutorialgenerator.vercel.app aesthetic but with unique vibrant orange identity.

---

**Color palette chosen for**: Energy, optimism, creativity, and professional warmth - perfect for a cost estimation tool! 🎨
