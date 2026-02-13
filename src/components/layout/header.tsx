import { Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/ui/logo"

import { LanguageSwitcher } from "@/components/ui/language-switcher"
import { ThemeToggle } from "@/components/ui/theme-toggle"

export function Header() {
    return (
        <header className="sticky top-0 z-40 w-full glass border-b-0 transition-colors duration-300">
            <div className="flex h-14 sm:h-16 items-center justify-between px-3 sm:px-4 md:px-6 w-full">
                <div className="flex items-center gap-2 min-w-0">
                    <Logo className="w-7 h-7 sm:w-8 sm:h-8 shrink-0" />
                    <span className="text-lg sm:text-xl font-bold tracking-tight text-foreground transition-colors whitespace-nowrap">
                        Eco<span className="text-primary">Drop</span>
                    </span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    <ThemeToggle size="sm" />
                    <LanguageSwitcher />
                    <button className="p-2 rounded-full hover:bg-accent/20 transition-colors" aria-label="Share">
                        <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                </div>
            </div>
        </header>
    )
}
