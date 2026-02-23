/*
 * @Description:
 * @Author: 安知鱼
 * @Date: 2026-02-07 12:19:42
 * @LastEditTime: 2026-02-07 12:21:53
 * @LastEditors: 安知鱼
 */
"use client";

import { Input, Button } from "@heroui/react";
import { Search, RotateCcw, X } from "lucide-react";

interface DocSeriesFilterBarProps {
  searchInput: string;
  onSearchInputChange: (value: string) => void;
  onReset: () => void;
  onPageReset: () => void;
}

export function DocSeriesFilterBar({
  searchInput,
  onSearchInputChange,
  onReset,
  onPageReset,
}: DocSeriesFilterBarProps) {
  return (
    <div className="shrink-0 px-5 pb-3">
      <div className="flex items-center gap-3">
        <Input
          size="sm"
          className="w-full sm:max-w-[300px]"
          placeholder="搜索系列名称..."
          startContent={<Search className="w-3.5 h-3.5 text-default-400" />}
          endContent={
            searchInput ? (
              <button
                type="button"
                className="shrink-0 text-default-400 hover:text-default-600 transition-colors"
                onClick={() => {
                  onSearchInputChange("");
                  onPageReset();
                }}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : null
          }
          value={searchInput}
          onValueChange={v => {
            onSearchInputChange(v);
            onPageReset();
          }}
          classNames={{
            inputWrapper:
              "h-8 min-h-8 bg-white! dark:bg-default-50! shadow-none! [border:var(--style-border)] data-[hover=true]:bg-white! dark:data-[hover=true]:bg-default-50! group-data-[focus=true]:bg-white! dark:group-data-[focus=true]:bg-default-50! group-data-[focus=true]:[border:var(--style-border-hover)] transition-all duration-200",
          }}
        />
        <div className="ml-auto">
          <Button
            size="sm"
            variant="flat"
            startContent={<RotateCcw className="w-3.5 h-3.5" />}
            onPress={onReset}
            isDisabled={!searchInput}
            className="text-default-600"
          >
            重置
          </Button>
        </div>
      </div>
    </div>
  );
}
