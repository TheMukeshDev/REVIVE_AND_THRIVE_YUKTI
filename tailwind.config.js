/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: "hsl(var(--primary))",
                "primary-foreground": "hsl(var(--primary-foreground))",
                secondary: "hsl(var(--secondary))",
                "secondary-foreground": "hsl(var(--secondary-foreground))",
                accent: "hsl(var(--accent))",
                "accent-foreground": "hsl(var(--accent-foreground))",
                destructive: "hsl(var(--destructive))",
                "destructive-foreground": "hsl(var(--destructive-foreground))",
                muted: "hsl(var(--muted))",
                "muted-foreground": "hsl(var(--muted-foreground))",
                card: "hsl(var(--card))",
                "card-foreground": "hsl(var(--card-foreground))",
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            spacing: {
                "safe": "max(1rem, env(safe-area-inset-bottom))",
                "safe-area": "env(safe-area-inset-bottom)",
            },
            height: {
                "dvh": "100dvh",
                "svh": "100svh",
            },
            // Responsive typography using clamp()
            fontSize: {
                "responsive-xs": "clamp(0.75rem, 2vw, 0.875rem)",
                "responsive-sm": "clamp(0.875rem, 2.5vw, 1rem)",
                "responsive-base": "clamp(1rem, 3vw, 1.125rem)",
                "responsive-lg": "clamp(1.125rem, 3.5vw, 1.25rem)",
                "responsive-xl": "clamp(1.25rem, 4vw, 1.5rem)",
                "responsive-2xl": "clamp(1.5rem, 5vw, 1.875rem)",
                "responsive-3xl": "clamp(1.875rem, 6vw, 2.25rem)",
            },
            // Responsive spacing using clamp()
            gap: {
                "responsive-xs": "clamp(0.5rem, 2vw, 0.75rem)",
                "responsive-sm": "clamp(0.75rem, 2.5vw, 1rem)",
                "responsive-md": "clamp(1rem, 3vw, 1.5rem)",
                "responsive-lg": "clamp(1.5rem, 4vw, 2rem)",
                "responsive-xl": "clamp(2rem, 5vw, 2.5rem)",
            },
            padding: {
                "responsive-xs": "clamp(0.5rem, 2vw, 0.75rem)",
                "responsive-sm": "clamp(0.75rem, 2.5vw, 1rem)",
                "responsive-md": "clamp(1rem, 3vw, 1.5rem)",
                "responsive-lg": "clamp(1.5rem, 4vw, 2rem)",
                "responsive-xl": "clamp(2rem, 5vw, 2.5rem)",
            },
            // Container sizes for different breakpoints
            maxWidth: {
                "xs-container": "clamp(100%, 320px, 100%)",
                "sm-container": "clamp(100%, 640px, 100%)",
                "md-container": "clamp(100%, 768px, 100%)",
                "lg-container": "clamp(100%, 1024px, 100%)",
                "xl-container": "clamp(100%, 1280px, 100%)",
                "2xl-container": "clamp(100%, 1536px, 100%)",
            },
            keyframes: {
                "accordion-down": {
                    from: { height: 0 },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: 0 },
                },
                "fade-in": {
                    from: { opacity: 0 },
                    to: { opacity: 1 },
                },
                "slide-up": {
                    from: { transform: "translateY(10px)", opacity: 0 },
                    to: { transform: "translateY(0)", opacity: 1 },
                },
                "slide-down": {
                    from: { transform: "translateY(-10px)", opacity: 0 },
                    to: { transform: "translateY(0)", opacity: 1 },
                },
                "slide-left": {
                    from: { transform: "translateX(10px)", opacity: 0 },
                    to: { transform: "translateX(0)", opacity: 1 },
                },
                "slide-right": {
                    from: { transform: "translateX(-10px)", opacity: 0 },
                    to: { transform: "translateX(0)", opacity: 1 },
                },
                "scale-in": {
                    from: { transform: "scale(0.95)", opacity: 0 },
                    to: { transform: "scale(1)", opacity: 1 },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                "fade-in": "fade-in 0.3s ease-out",
                "slide-up": "slide-up 0.3s ease-out",
                "slide-down": "slide-down 0.3s ease-out",
                "slide-left": "slide-left 0.3s ease-out",
                "slide-right": "slide-right 0.3s ease-out",
                "scale-in": "scale-in 0.2s ease-out",
            },
            // Better transition durations
            transitionDuration: {
                "smooth": "300ms",
                "smooth-slow": "500ms",
            },
            transitionTimingFunction: {
                "smooth": "cubic-bezier(0.4, 0, 0.2, 1)",
            },
        },
    },
    plugins: [],
}
