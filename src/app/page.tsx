"use client"

import { useEffect, useState } from "react"
import { ScanLine, MapPin, Calendar } from "lucide-react"
import { StatsCard } from "@/components/features/stats-card"
import { ActionCard } from "@/components/features/action-card"
import { ActivityList } from "@/components/features/activity-list"
import { DailyTip } from "@/components/features/daily-tip"
import { MotionWrapper } from "@/components/ui/motion-wrapper"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/context/auth-context"
import { useTranslation } from "@/context/language-context"

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
        const txRes = await fetch(`/api/transactions?userId=${user._id}`)
        const txData = await txRes.json()

        if (txData.success) setTransactions(txData.data)

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

  // Calculate total points from all approved transactions
  const totalPoints = transactions.reduce((acc, tx: any) => {
    if (tx.status === 'approved') {
      return acc + (tx.pointsEarned || 0)
    }
    return acc
  }, 0)

  return (
    <div className="flex flex-col gap-4 sm:gap-5 md:gap-4 lg:gap-5 pb-4 sm:pb-6 md:pb-4 lg:pb-6 w-full">
      {/* Greeting & Stats */}
      <MotionWrapper delay={0} direction="down" variant="slideUp" className="flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          {t("greeting")}, <span className="text-primary">{loading ? "User" : (user?.name?.split(" ")[0] || "EcoFriend")}</span> 👋
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">{t("ready_message")}</p>
      </MotionWrapper>

      {/* Main Stats Card */}
      <MotionWrapper delay={0.1} variant="scale">
        {loading ? (
          <Skeleton className="w-full h-32 rounded-3xl" />
        ) : (
          <StatsCard
            points={totalPoints}
            weeklyPoints={weeklyPoints}
            totalItems={user?.totalItemsRecycled || 0}
            co2Saved={user?.totalCO2Saved || 0}
          />
        )}
      </MotionWrapper>

      {/* Quick Actions - Always single column on mobile */}
      <div className="grid grid-cols-1 gap-3 sm:gap-4">
        <MotionWrapper delay={0.2} direction="left">
          <ActionCard
            href="/scan"
            title={t("scan_button")}
            subtitle={t("scan_subtitle")}
            icon={<ScanLine className="h-6 w-6 sm:h-7 sm:w-7" />}
            color="primary"
          />
        </MotionWrapper>

        <MotionWrapper delay={0.3} direction="down">
          <ActionCard
            href="/find-bin"
            title={t("find_bin")}
            subtitle={t("find_bin_subtitle")}
            icon={<MapPin className="h-6 w-6 sm:h-7 sm:w-7" />}
            color="secondary"
          />
        </MotionWrapper>

        <MotionWrapper delay={0.4} direction="right">
          <ActionCard
            href="/schedule"
            title={t("schedule_pickup")}
            subtitle={t("schedule_subtitle")}
            icon={<Calendar className="h-6 w-6 sm:h-7 sm:w-7" />}
            color="primary"
          />
        </MotionWrapper>
      </div>

      {/* Daily AI Insight */}
      <DailyTip />

      {/* Recent Activity */}
      <ActivityList transactions={transactions} loading={loading} />
    </div>
  )
}
