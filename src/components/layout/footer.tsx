'use client'

import React from 'react'
import { useTranslation } from '@/lib/i18n/i18n-context'
import { Activity, ShieldCheck, Database, Cpu } from 'lucide-react'

export function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/60 py-10 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
            <span className="text-sm font-semibold text-white tracking-wide">
              {t.common.brandName} • E-Commerce & Delivery Hub
            </span>
            <p className="text-xs text-slate-400">
              {t.common.tagline}
            </p>
          </div>

          {/* Architecture badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-400">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-900 border border-slate-800">
              <Cpu className="h-3 w-3 text-blue-400" />
              Saga Choreography
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-900 border border-slate-800">
              <Database className="h-3 w-3 text-indigo-400" />
              PostgreSQL 16 + Redis 7
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-900 border border-slate-800">
              <ShieldCheck className="h-3 w-3 text-emerald-400" />
              AppSec Hardened
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-900 border border-slate-800">
              <Activity className="h-3 w-3 text-purple-400" />
              Prometheus & Grafana
            </span>
          </div>

          <div className="text-xs text-slate-400">
            © {new Date().getFullYear()} {t.common.brandName}. {t.common.allRightsReserved}
          </div>
        </div>
      </div>
    </footer>
  )
}
