"use client";

import { useState, useCallback, useRef } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Textarea,
  Select,
  SelectItem,
} from "@heroui/react";
import { generateAIWriting, type AIWritingRequest } from "@/lib/api/ai-writing";

interface AIWritingDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onInsert: (content: string) => void;
}

const STYLE_OPTIONS = [
  { key: "professional", label: "专业技术" },
  { key: "casual", label: "轻松随意" },
  { key: "academic", label: "学术严谨" },
  { key: "creative", label: "创意文学" },
];

const LENGTH_OPTIONS = [
  { key: "short", label: "短篇 (0~800字)" },
  { key: "medium", label: "中篇 (800~2000字)" },
  { key: "long", label: "长篇 (2000~5000字)" },
];

export function AIWritingDialog({ isOpen, onOpenChange, onInsert }: AIWritingDialogProps) {
  const [topic, setTopic] = useState("");
  const [style, setStyle] = useState<AIWritingRequest["style"]>("professional");
  const [length, setLength] = useState<AIWritingRequest["length"]>("medium");
  const [customPrompt, setCustomPrompt] = useState("");
  const [preview, setPreview] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const controllerRef = useRef<AbortController | null>(null);

  const handleGenerate = useCallback(() => {
    if (!topic.trim()) return;

    setIsGenerating(true);
    setPreview("");
    setError("");

    controllerRef.current = generateAIWriting(
      { topic: topic.trim(), style, length, customPrompt: customPrompt.trim() || undefined },
      {
        onChunk: chunk => {
          setPreview(prev => prev + chunk);
        },
        onDone: fullContent => {
          setPreview(fullContent);
          setIsGenerating(false);
        },
        onError: err => {
          setError(err.message);
          setIsGenerating(false);
        },
      }
    );
  }, [topic, style, length, customPrompt]);

  const handleCancel = useCallback(() => {
    controllerRef.current?.abort();
    setIsGenerating(false);
  }, []);

  const handleInsert = useCallback(() => {
    if (preview) {
      onInsert(preview);
      onOpenChange(false);
      // Reset
      setPreview("");
      setTopic("");
      setCustomPrompt("");
    }
  }, [preview, onInsert, onOpenChange]);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="3xl"
      scrollBehavior="inside"
      classNames={{ wrapper: "z-[200]", backdrop: "z-[199]" }}
    >
      <ModalContent>
        {onClose => (
          <>
            <ModalHeader className="flex items-center gap-2">
              <span>✨</span>
              <span>AI 写作助手</span>
            </ModalHeader>
            <ModalBody className="gap-4">
              {/* Topic */}
              <Textarea
                label="写作主题"
                placeholder="请描述你想写的文章主题、大纲或关键点..."
                value={topic}
                onValueChange={setTopic}
                minRows={2}
                maxRows={4}
                isRequired
              />

              <div className="grid grid-cols-2 gap-3">
                <Select
                  label="写作风格"
                  selectedKeys={style ? [style] : []}
                  onSelectionChange={keys => {
                    const key = Array.from(keys)[0] as string;
                    if (key) setStyle(key as AIWritingRequest["style"]);
                  }}
                  size="sm"
                >
                  {STYLE_OPTIONS.map(opt => (
                    <SelectItem key={opt.key}>{opt.label}</SelectItem>
                  ))}
                </Select>

                <Select
                  label="文章长度"
                  selectedKeys={length ? [length] : []}
                  onSelectionChange={keys => {
                    const key = Array.from(keys)[0] as string;
                    if (key) setLength(key as AIWritingRequest["length"]);
                  }}
                  size="sm"
                >
                  {LENGTH_OPTIONS.map(opt => (
                    <SelectItem key={opt.key}>{opt.label}</SelectItem>
                  ))}
                </Select>
              </div>

              <Textarea
                label="自定义提示词（可选）"
                placeholder="额外的写作要求或限制..."
                value={customPrompt}
                onValueChange={setCustomPrompt}
                minRows={1}
                maxRows={3}
                size="sm"
              />

              {/* Error */}
              {error && <div className="text-danger text-sm p-3 bg-danger-50 rounded-lg">{error}</div>}

              {/* Preview */}
              {(preview || isGenerating) && (
                <div className="border border-border rounded-lg">
                  <div className="flex items-center justify-between px-3 py-2 bg-muted/30 border-b border-border">
                    <span className="text-xs text-default-500 font-medium">
                      {isGenerating ? "生成中..." : "生成结果"}
                    </span>
                    <span className="text-xs text-default-400">{preview.length} 字</span>
                  </div>
                  <div className="p-3 max-h-[300px] overflow-auto">
                    <pre className="whitespace-pre-wrap text-sm font-sans">{preview || "等待生成..."}</pre>
                  </div>
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button variant="flat" onPress={onClose} size="sm">
                关闭
              </Button>
              {isGenerating ? (
                <Button color="danger" variant="flat" onPress={handleCancel} size="sm">
                  停止生成
                </Button>
              ) : (
                <Button color="primary" onPress={handleGenerate} isDisabled={!topic.trim()} size="sm">
                  {preview ? "重新生成" : "开始生成"}
                </Button>
              )}
              {preview && !isGenerating && (
                <Button color="success" onPress={handleInsert} size="sm">
                  插入到编辑器
                </Button>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
