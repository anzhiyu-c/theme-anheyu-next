"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface HelpStep {
  title: string;
  description: string;
}

export interface HelpParam {
  name: string;
  meaning: string;
  example?: string;
  required?: boolean;
}

export interface HelpSection {
  title: string;
  description?: string;
  params: HelpParam[];
}

interface SettingsHelpPanelProps {
  title: string;
  description?: string;
  steps?: HelpStep[];
  sections?: HelpSection[];
  className?: string;
  /** 默认是否展开，默认 false（收起） */
  defaultOpen?: boolean;
}

export function SettingsHelpPanel({
  title,
  description,
  steps = [],
  sections = [],
  className,
  defaultOpen = false,
}: SettingsHelpPanelProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  if (!steps.length && !sections.length && !description) return null;

  return (
    <div className={cn("rounded-xl border border-default-200 bg-default-50/50", className)}>
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className="flex w-full items-center gap-2 p-3 text-left transition-colors hover:bg-default-100/50 rounded-xl cursor-pointer"
      >
        <ChevronRight
          className={cn(
            "h-3.5 w-3.5 shrink-0 text-default-400 transition-transform duration-200",
            isOpen && "rotate-90"
          )}
        />
        <span className="text-sm font-semibold text-foreground/80">{title}</span>
      </button>

      {isOpen && (
        <div className="px-3 pb-3 pt-0">
          {description && <p className="text-xs leading-relaxed text-default-600">{description}</p>}

          {steps.length > 0 && (
            <div className="mt-1 space-y-1.5">
              {steps.map((step, index) => (
                <div key={`${step.title}-${index}`} className="text-xs text-default-600">
                  <span className="font-medium text-foreground/80">{`${index + 1}. ${step.title}：`}</span>
                  <span>{step.description}</span>
                </div>
              ))}
            </div>
          )}

          {sections.length > 0 && (
            <div className="mt-3 space-y-3">
              {sections.map(section => (
                <div key={section.title} className="rounded-lg border border-default-200 bg-content1 p-2.5">
                  <div className="text-xs font-medium text-foreground/80">{section.title}</div>
                  {section.description && <p className="mt-1 text-xs text-default-500">{section.description}</p>}
                  <div className="mt-2 space-y-1.5">
                    {section.params.map(param => (
                      <div key={`${section.title}-${param.name}`} className="text-xs text-default-600">
                        <code className="rounded bg-default-100 px-1 py-0.5 font-mono text-[11px] text-foreground/80">
                          {param.name}
                        </code>
                        {param.required && <span className="ml-1 text-danger">*</span>}
                        <span className="ml-1.5">{param.meaning}</span>
                        {param.example && <span className="ml-1.5 text-default-500">{`示例：${param.example}`}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
