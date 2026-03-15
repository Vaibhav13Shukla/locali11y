"use client";

import { motion } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";

interface ComparisonItem {
  check: string;
  lighthouse: "pass" | "na";
  locali11y: "pass" | "fail";
  detail?: string;
}

const COMPARISONS: ComparisonItem[] = [
  {
    check: "ARIA label exists",
    lighthouse: "pass",
    locali11y: "pass",
  },
  {
    check: "ARIA label is translated",
    lighthouse: "na",
    locali11y: "fail",
    detail: '"Search" still in English on Japanese page',
  },
  {
    check: "html lang attribute exists",
    lighthouse: "pass",
    locali11y: "pass",
  },
  {
    check: "html lang matches page locale",
    lighthouse: "na",
    locali11y: "fail",
    detail: 'Japanese page declares lang="en"',
  },
  {
    check: "Alt text exists",
    lighthouse: "pass",
    locali11y: "pass",
  },
  {
    check: "Alt text is translated",
    lighthouse: "na",
    locali11y: "fail",
    detail: "Alt text identical to English version",
  },
  {
    check: "Placeholder exists",
    lighthouse: "pass",
    locali11y: "pass",
  },
  {
    check: "Placeholder is translated",
    lighthouse: "na",
    locali11y: "fail",
    detail: '"Describe your issue" still in English',
  },
];

export function LighthouseComparison() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
        What Lighthouse says vs What Locali11y finds
      </h2>
      <p className="text-gray-500 dark:text-gray-400 text-center mb-8 text-sm max-w-xl mx-auto">
        Lighthouse validates whether attributes exist. Locali11y validates whether they were translated.
      </p>

      <div className="max-w-3xl mx-auto">
        <div className="grid grid-cols-12 gap-4 px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          <div className="col-span-6">Check</div>
          <div className="col-span-3 text-center">Lighthouse</div>
          <div className="col-span-3 text-center">Locali11y</div>
        </div>

        {COMPARISONS.map((item, index) => (
          <motion.div
            key={item.check}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <div className="grid grid-cols-12 gap-4 px-4 py-3 border-t border-gray-100 dark:border-gray-700 items-center">
              <div className="col-span-6">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{item.check}</p>
                {item.detail ? (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-0.5">{item.detail}</p>
                ) : null}
              </div>
              <div className="col-span-3 flex justify-center">
                {item.lighthouse === "pass" ? (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/30 rounded-full px-2.5 py-1">
                    <CheckCircle className="h-3.5 w-3.5" />
                    Pass
                  </span>
                ) : (
                  <span className="inline-flex items-center text-xs font-medium text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800 rounded-full px-2.5 py-1">
                    N/A
                  </span>
                )}
              </div>
              <div className="col-span-3 flex justify-center">
                {item.locali11y === "pass" ? (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/30 rounded-full px-2.5 py-1">
                    <CheckCircle className="h-3.5 w-3.5" />
                    Pass
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/30 rounded-full px-2.5 py-1">
                    <XCircle className="h-3.5 w-3.5" />
                    Fail
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
