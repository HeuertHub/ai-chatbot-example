## Project Setup:

pnpx create-next-app@latest project-name

# Tailwind
pnpm add -D tailwindcss postcss autoprefixer next-themes
# Shadcn
pnpm add -D tailwind-merge class-variance-authority
pnpm add lucide-react
pnpx shadcn@latest init -d

pnpm dlx shadcn@latest add button card input select slider switch badge tabs tooltip dialog dropdown-menu progress textarea label sheet separator sonner scroll-area avatar skeleton drawer checkbox command popover table
pnpm add @tanstack/react-table
pnpm add @ai-sdk/react

# Supabase
pnpm add @supabase/ssr

# Open AI
pnpm add openai

# Chat Template
https://shadcnexamples.com/ai-chat