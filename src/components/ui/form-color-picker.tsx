"use client";

import { useCallback, useMemo } from "react";
import {
  ColorArea as AriaColorArea,
  ColorSlider as AriaColorSlider,
  ColorThumb,
  ColorField as AriaColorField,
  SliderTrack,
  Input,
  Label,
  parseColor,
  type Color,
} from "react-aria-components";
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/react";
import { Shuffle } from "lucide-react";
import { cn } from "@/lib/utils";

const PRESET_COLORS = ["#E11D48", "#EA580C", "#EAB308", "#16A34A", "#14B8A6", "#2563EB", "#7C3AED", "#DB2777"];

function randomHexColor() {
  return (
    "#" +
    Math.floor(Math.random() * 0xffffff)
      .toString(16)
      .padStart(6, "0")
  );
}

const THUMB_CLASS = cn(
  "w-5 h-5 rounded-full border-2 border-white",
  "shadow-[0_0_0_1px_rgba(0,0,0,0.1),0_2px_4px_rgba(0,0,0,0.2)]",
  "forced-colors:bg-[Highlight]!"
);

interface FormColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  className?: string;
}

export function FormColorPicker({ value, onChange, className }: FormColorPickerProps) {
  const color = useMemo(() => {
    try {
      return parseColor(value).toFormat("hsb");
    } catch {
      return parseColor("#3B82F6").toFormat("hsb");
    }
  }, [value]);

  const handleColorChange = useCallback((c: Color) => onChange(c.toString("hex")), [onChange]);

  return (
    <Popover placement="bottom" offset={6}>
      <PopoverTrigger>
        <button
          type="button"
          className={cn(
            "shrink-0 w-8 h-8 rounded-lg border-2 border-default-200 cursor-pointer",
            "transition-all hover:scale-110 hover:border-default-300",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
            className
          )}
          style={{ backgroundColor: value }}
          aria-label={`选择颜色: ${value}`}
        />
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <div className="p-3 w-[232px] space-y-3">
          {/* Presets */}
          <div className="flex items-center justify-between">
            {PRESET_COLORS.map((preset, i) => (
              <button
                key={`${preset}-${i}`}
                type="button"
                className={cn(
                  "w-5.5 h-5.5 rounded-full cursor-pointer transition-transform",
                  "hover:scale-115",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                  value.toLowerCase() === preset.toLowerCase() && "ring-2 ring-offset-1 ring-default-400 scale-110"
                )}
                style={{ backgroundColor: preset }}
                onClick={() => onChange(preset)}
                aria-label={preset}
              />
            ))}
          </div>

          {/* Color Area */}
          <AriaColorArea
            colorSpace="hsb"
            xChannel="saturation"
            yChannel="brightness"
            value={color}
            onChange={handleColorChange}
            className="w-full h-36 rounded-xl overflow-hidden"
          >
            <ColorThumb className={THUMB_CLASS} />
          </AriaColorArea>

          {/* Hue Slider + Shuffle */}
          <div className="flex items-center gap-2">
            <AriaColorSlider
              channel="hue"
              colorSpace="hsb"
              value={color}
              onChange={handleColorChange}
              className="flex-1"
            >
              <SliderTrack className="h-3 w-full rounded-full">
                <ColorThumb className={cn(THUMB_CLASS, "top-1/2")} />
              </SliderTrack>
            </AriaColorSlider>
            <button
              type="button"
              onClick={() => onChange(randomHexColor())}
              className={cn(
                "shrink-0 w-7 h-7 flex items-center justify-center rounded-full",
                "bg-default-100 hover:bg-default-200 transition-colors cursor-pointer",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              )}
              aria-label="随机颜色"
            >
              <Shuffle className="w-3.5 h-3.5 text-default-500" />
            </button>
          </div>

          {/* Hex Input */}
          <div className="flex items-center gap-2 pt-2 border-t border-default-100">
            <div className="w-6 h-6 rounded-md shrink-0" style={{ backgroundColor: value }} />
            <AriaColorField
              value={color}
              onChange={c => {
                if (c) handleColorChange(c);
              }}
              className="flex-1"
            >
              <Label className="sr-only">Hex</Label>
              <Input
                className="w-full h-7 px-2 text-xs font-mono rounded-md border border-default-200 bg-default-50
                           outline-none focus:border-primary transition-colors"
              />
            </AriaColorField>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
