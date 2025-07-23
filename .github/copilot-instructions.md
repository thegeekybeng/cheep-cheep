# Copilot Instructions for Philippines Domestic Flight Booking Tool

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Context
This is a domestic flight booking tool specifically designed for Filipino travelers to find the best flight deals while bypassing price manipulation tactics commonly used by airlines.

## Key Requirements
- **Anti-Price Manipulation**: Implement strategies to bypass tracking cookies and user profiling that inflate prices
- **15-minute Price Lock**: Provide users with a 15-minute consideration window with locked prices
- **Carry-on Guarantee**: Ensure all flight options include carry-on baggage as mandatory
- **Economic Value Focus**: Prioritize budget-friendly options suitable for Philippines' economic context
- **Domestic Routes**: Focus on Philippine domestic airlines (Cebu Pacific, Philippine Airlines, Philippines AirAsia)
- **Luggage Policy Integration**: Display luggage allowances per service provider

## Technical Guidelines
- Use Next.js 15 with App Router and TypeScript
- Implement responsive design with Tailwind CSS
- Create API routes for flight data aggregation
- Use modern React patterns and hooks
- Implement proper error handling and loading states
- Focus on performance optimization for mobile users

## Philippine Airlines Context
- **Cebu Pacific**: Budget carrier, strict baggage policies
- **Philippine Airlines**: Full-service carrier, more generous allowances
- **Philippines AirAsia**: Low-cost carrier, pay-per-service model
- **Skyjet**: Regional carrier for select routes

## User Experience Priorities
1. Fast, mobile-first interface
2. Clear pricing without hidden fees
3. Simple booking flow
4. Real-time price updates
5. Transparent luggage policy information
6. Value-focused recommendations

## Code Style
- Use TypeScript for all components
- Implement proper type definitions
- Use Tailwind CSS utility classes
- Follow Next.js best practices
- Write clean, maintainable code with proper documentation
