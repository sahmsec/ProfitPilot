# Design Guidelines: Business Profit & Expense Tracker

## Design Approach: Material Design System (Data-Focused Variant)
Selected for its excellent handling of data-dense interfaces, clear visual hierarchy, and proven patterns for financial applications. Drawing inspiration from modern fintech dashboards like Stripe Dashboard, QuickBooks Online, and Linear's data views.

## Core Design Principles
1. **Data Clarity First**: Every visual decision prioritizes readability of financial data
2. **Action-Oriented**: Clear pathways to add income/expenses with prominent CTAs
3. **Trust Through Precision**: Professional aesthetic that conveys reliability and accuracy
4. **Cybersecurity Brand Alignment**: Modern, tech-forward visual language appropriate for a security-focused organization

## Color Palette

### Light Mode
- **Primary**: 220 85% 55% (Professional blue - primary actions, charts)
- **Success/Income**: 142 76% 45% (Green for positive values, income indicators)
- **Danger/Expense**: 0 72% 55% (Red for expenses, negative trends)
- **Background**: 0 0% 98% (Off-white for main canvas)
- **Surface**: 0 0% 100% (Pure white for cards, panels)
- **Surface Elevated**: 220 15% 97% (Subtle blue tint for elevated cards)
- **Text Primary**: 220 20% 15%
- **Text Secondary**: 220 10% 45%
- **Border**: 220 15% 88%

### Dark Mode
- **Primary**: 220 90% 65% (Brighter blue for visibility)
- **Success/Income**: 142 70% 50%
- **Danger/Expense**: 0 75% 60%
- **Background**: 220 18% 8% (Deep blue-tinted dark)
- **Surface**: 220 15% 12% (Elevated dark surface)
- **Surface Elevated**: 220 15% 16% (Cards stand out from background)
- **Text Primary**: 0 0% 95%
- **Text Secondary**: 220 10% 65%
- **Border**: 220 15% 20%

## Typography
- **Primary Font**: Inter (Google Fonts) - exceptional readability for data
- **Numeric Display**: Tabular numbers enabled for proper alignment
- **Hierarchy**:
  - **Page Titles**: 2.5rem (40px), font-bold, tracking-tight
  - **Section Headers**: 1.875rem (30px), font-semibold
  - **Card Titles**: 1.25rem (20px), font-medium
  - **Large Metrics**: 2.25rem (36px), font-bold, tabular-nums
  - **Body Text**: 1rem (16px), font-normal
  - **Small Labels**: 0.875rem (14px), font-medium, uppercase tracking-wide
  - **Captions**: 0.75rem (12px), text-secondary

## Layout System
Using Tailwind spacing units: **2, 3, 4, 6, 8, 12, 16, 20** for consistent rhythm.
- **Page Padding**: px-4 md:px-6 lg:px-8
- **Component Spacing**: gap-6 to gap-8 between major sections
- **Card Padding**: p-6 to p-8
- **Form Fields**: space-y-4
- **Container Max Width**: max-w-7xl for dashboard, max-w-2xl for forms

## Component Library

### Dashboard Metrics Cards
Three prominent cards displaying Total Income, Total Expenses, and Net Profit:
- **Structure**: White/elevated surface with subtle shadow (shadow-sm hover:shadow-md transition)
- **Layout**: Icon + Label + Large Number + Trend indicator
- **Icon Treatment**: 48px circular background with primary/success/danger tint, white icon
- **Trend Indicators**: Small badge showing percentage change with up/down arrow
- **Spacing**: p-6, gap-4 between elements

### Income/Expense Entry Forms
Side-by-side cards or stacked on mobile:
- **Input Fields**: Outlined style with floating labels, rounded-lg borders
- **Field States**: Focus ring using primary color (ring-2 ring-primary/50)
- **Category Dropdown**: Custom styled select with icons for each category
- **Date Picker**: Native input with calendar icon prefix
- **Amount Input**: Large, prominent with currency symbol prefix (₹/$)
- **Submit Button**: Full-width primary button, h-12, rounded-lg, font-semibold

### Transaction History Table
- **Header**: Sticky top bar with column labels, subtle background separation
- **Rows**: Alternating subtle background (hover state with elevated surface color)
- **Columns**: Date | Description | Category | Amount | Actions
- **Amount Display**: Right-aligned, green for income, red for expenses, tabular numbers
- **Category Badges**: Small rounded pill badges with category-specific colors
- **Action Buttons**: Icon-only edit/delete buttons, subtle appearance until hover

### Chart Visualization
Two primary charts using Chart.js:
- **Monthly Trend Line Chart**: Dual-line showing income vs expenses over time
  - Clean grid lines with low opacity
  - Smooth curved lines (tension: 0.4)
  - Gradient fill under lines (subtle)
  - Tooltip styling matching application theme
- **Category Breakdown Doughnut Chart**: Expense categories distribution
  - Custom color palette matching category badges
  - Center displays total with label
  - Legend positioned right on desktop, bottom on mobile

### Navigation
Top navigation bar with:
- **Logo/Brand**: Left-aligned, cybersecurity training organization name
- **Nav Items**: Dashboard, Add Transaction, Reports (horizontal on desktop)
- **User Menu**: Right-aligned avatar with dropdown
- **Mobile**: Hamburger menu transforming to slide-out drawer

### Empty States
When no data exists:
- **Illustration**: Simple icon-based graphic (chart icon, wallet icon)
- **Heading**: "No transactions yet"
- **Description**: "Start tracking your finances by adding your first transaction"
- **CTA Button**: Large primary button to add transaction

## Responsive Behavior
- **Desktop (lg+)**: Three-column metric cards, side-by-side forms, charts in 2-column grid
- **Tablet (md)**: Two-column layouts where appropriate, stacked forms
- **Mobile (base)**: Single column, full-width cards, simplified table (transform to cards)

## Animations
Minimal, purposeful animations only:
- **Card Hover**: Subtle shadow elevation (transition-shadow duration-200)
- **Button States**: Quick scale on active (active:scale-95 transition-transform)
- **Chart Entrance**: Smooth animation on initial data load (Chart.js built-in)
- **Form Validation**: Shake animation for errors (animate-shake custom class)

## Images
No hero image required - this is a utility application. However:
- **Empty State Illustrations**: Use heroicons or custom SVG illustrations showing financial concepts (charts, coins, documents)
- **Dashboard Icons**: Material icons for income (trending-up), expenses (trending-down), profit (wallet)
- **Category Icons**: Specific icons for each category type (users for salaries, megaphone for marketing, etc.)

## Accessibility Notes
- Maintain WCAG AA contrast ratios in both light and dark modes
- All interactive elements have minimum 44px touch target
- Form inputs have associated labels and error messages
- Charts include accessible data tables as fallback
- Color is never the only indicator (use icons + text alongside color coding)