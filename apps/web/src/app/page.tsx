import {MessageCircle} from "lucide-react"

export default function Home() {
    return (
        <div className="flex flex-1 items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] animate-[spin_60s_linear_infinite] opacity-20">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-accent/30 blur-[128px]" />
                    <div className="absolute top-2/3 left-2/3 w-72 h-72 rounded-full bg-accent/20 blur-[96px]" />
                </div>
            </div>

            <div className="relative z-10 text-center px-6">
                <div className="mb-8 inline-block">
                    <div className="w-20 h-20 rounded-2xl bg-accent-soft border border-accent/20 flex items-center justify-center">
                        <svg className="w-10 h-10 text-accent-text" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085" />
                        </svg>
                    </div>
                </div>

                <h1 className="text-5xl font-bold text-white tracking-tight mb-3">Pollux</h1>
                <p className="text-muted text-lg mb-12 max-w-md mx-auto leading-relaxed">
                    Configure and manage your Discord bot from a single dashboard.
                </p>

                <a
                    href="/api/auth/login"
                    className="group inline-flex items-center gap-3 rounded-xl bg-[#5865F2] px-8 py-3.5 text-white font-semibold text-base hover:bg-[#4752c4] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                    <MessageCircle className="w-5 h-5 transition-transform group-hover:-rotate-12" />
                    Continue with Discord
                </a>

                <p className="text-subtle text-xs mt-8">Requires Manage Server permission</p>
            </div>
        </div>
    )
}
