"use client"

import { useEffect, useState } from "react"
import { ScanLine, MapPin, Calendar, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { StatsCard } from "@/components/features/stats-card"
import { ActionCard } from "@/components/features/action-card"
import { ActivityList } from "@/components/features/activity-list"
import { DailyTip } from "@/components/features/daily-tip"
import { MotionWrapper } from "@/components/ui/motion-wrapper"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/context/auth-context"
import { useTranslation } from "@/context/language-context"

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function Home() {
  const { user } = useAuth()
  const { t } = useTranslation()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        // Read transactions from localStorage (primary source — no DB)
        const localTx = JSON.parse(localStorage.getItem('eco_transactions') || '[]')

        // Also try API as fallback (returns [] when DB is offline)
        try {
          const txRes = await fetch(`/api/transactions?userId=${user._id}`)
          const txData = await txRes.json()
          if (txData.success && txData.data.length > 0) {
            // Merge server + local, dedup by _id
            const serverIds = new Set(txData.data.map((t: any) => t._id))
            const merged = [...txData.data, ...localTx.filter((t: any) => !serverIds.has(t._id))]
            setTransactions(merged)
          } else {
            setTransactions(localTx)
          }
        } catch {
          // API failed, use local only
          setTransactions(localTx)
        }

      } catch (error) {
        console.error("Failed to fetch data", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [user])

  // Calculate weekly points from local transactions
  const weeklyPoints = transactions.reduce((acc, tx: any) => {
    const txDate = new Date(tx.createdAt)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    if (txDate > sevenDaysAgo && tx.status === 'approved' && (tx.type === 'recycle' || tx.type === 'scan')) {
      return acc + (tx.pointsEarned || 0)
    }
    return acc
  }, 0)

  // Calculate total points — use auth context as primary (always up-to-date), transactions as supplement
  const totalPoints = Math.max(
    user?.points || 0,
    transactions.reduce((acc, tx: any) => {
      if (tx.status === 'approved') {
        return acc + (tx.pointsEarned || 0)
      }
      return acc
    }, 0)
  )

  return (
    <motion.div 
      className="w-full flex flex-col gap-4 sm:gap-5 md:gap-6 lg:gap-7"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Header Section */}
      <motion.div 
        className="flex flex-col gap-1 sm:gap-2"
        variants={itemVariants}
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight [-webkit-text-size-adjust:100%]">
          {t("greeting")}, <motion.span 
            className="text-primary inline-block"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {loading ? "User" : (user?.name?.split(" ")[0] || "EcoFriend")}
          </motion.span> 👋
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-muted-foreground font-medium">
          {t("ready_message")}
        </p>
      </motion.div>

      {/* Main Stats Card */}
      <motion.div variants={itemVariants}>
        {loading ? (
          <Skeleton className="w-full h-32 sm:h-40 md:h-48 rounded-2xl sm:rounded-3xl" />
        ) : (
          <StatsCard
            points={totalPoints}
            weeklyPoints={weeklyPoints}
            totalItems={user?.totalItemsRecycled || 0}
            co2Saved={user?.totalCO2Saved || 0}
          />
        )}
      </motion.div>

      {/* Quick Actions Grid - Responsive */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5"
        variants={itemVariants}
      >
        {/* Scan Action */}
        <motion.div 
          className="sm:col-span-1"
          whileHover={{ y: -4 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <ActionCard
            href="/scan"
            title={t("scan_button")}
            subtitle={t("scan_subtitle")}
            icon={<ScanLine className="h-6 w-6 sm:h-7 sm:w-7 transition-transform group-hover:scale-110" />}
            color="primary"
          />
        </motion.div>

        {/* Find Bin Action */}
        <motion.div 
          className="sm:col-span-1"
          whileHover={{ y: -4 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <ActionCard
            href="/find-bin"
            title={t("find_bin")}
            subtitle="Locate nearby bins"
            icon={<MapPin className="h-6 w-6 sm:h-7 sm:w-7 transition-transform group-hover:scale-110" />}
            color="primary"
          />
        </motion.div>

        {/* Schedule Action */}
        <motion.div 
          className="sm:col-span-2 lg:col-span-1"
          whileHover={{ y: -4 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <ActionCard
            href="/schedule"
            title={t("schedule_pickup")}
            subtitle="Book a pickup"
            icon={<Calendar className="h-6 w-6 sm:h-7 sm:w-7 transition-transform group-hover:scale-110" />}
            color="primary"
          />
        </motion.div>
      </motion.div>

      {/* AI Tip Section */}
      <motion.div variants={itemVariants}>
        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            <h2 className="text-base sm:text-lg md:text-xl font-semibold">
              Daily Tip
            </h2>
          </div>
          <DailyTip />
        </div>
      </motion.div>

      {/* Activity Section */}
      <motion.div variants={itemVariants} className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold">
            {t("recent_activity")}
          </h2>
          <motion.a 
            href="/activity" 
            className="text-xs sm:text-sm text-primary hover:text-primary/80 font-medium underline-offset-2 hover:underline"
            whileHover={{ x: 4 }}
          >
            View all →
          </motion.a>
        </div>

        {loading ? (
          <div className="space-y-2 sm:space-y-3">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="w-full h-16 sm:h-20 rounded-lg sm:rounded-xl" />
            ))}
          </div>
        ) : transactions.length > 0 ? (
          <ActivityList 
            transactions={transactions.slice(0, 5)}
          />
        ) : (
          <motion.div 
            className="flex flex-col items-center justify-center py-8 sm:py-12 text-center text-muted-foreground bg-secondary/30 rounded-xl sm:rounded-2xl border border-dashed border-border/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-primary/10 flex items-center justify-center mb-3 sm:mb-4">
              <ScanLine className="h-6 w-6 sm:h-8 sm:w-8 text-primary/40" />
            </div>
            <p className="text-sm sm:text-base font-medium">No activity yet</p>
            <p className="text-xs sm:text-sm">Start recycling to see your impact!</p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}
