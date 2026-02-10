"use client";

import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { ChevronDown, RotateCcw } from "lucide-react";
import { ALBUM_SORT_OPTIONS } from "@/types/album";

interface AlbumFilterBarProps {
  sortFilter: string;
  onSortFilterChange: (value: string) => void;
  onReset: () => void;
  onPageReset: () => void;
}

export function AlbumFilterBar({ sortFilter, onSortFilterChange, onReset, onPageReset }: AlbumFilterBarProps) {
  return (
    <div className="shrink-0 px-5 pb-3">
      <div className="flex items-center gap-3">
        <Dropdown>
          <DropdownTrigger className="hidden sm:flex">
            <Button size="sm" variant="flat" endContent={<ChevronDown className="w-3.5 h-3.5" />} className="h-8">
              {sortFilter ? ALBUM_SORT_OPTIONS.find(o => o.key === sortFilter)?.label ?? "排序方式" : "排序方式"}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="排序方式"
            selectedKeys={sortFilter ? new Set([sortFilter]) : new Set()}
            selectionMode="single"
            onSelectionChange={keys => {
              const v = Array.from(keys)[0];
              onSortFilterChange(v ? (v as string) : "display_order_asc");
              onPageReset();
            }}
          >
            {ALBUM_SORT_OPTIONS.map(opt => (
              <DropdownItem key={opt.key}>{opt.label}</DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
        <div className="ml-auto">
          <Button
            size="sm"
            variant="flat"
            startContent={<RotateCcw className="w-3.5 h-3.5" />}
            onPress={onReset}
            isDisabled={sortFilter === "display_order_asc"}
            className="text-default-600"
          >
            重置
          </Button>
        </div>
      </div>
    </div>
  );
}
