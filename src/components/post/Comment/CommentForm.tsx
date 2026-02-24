"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type ChangeEvent,
} from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { Icon } from "@iconify/react";
import { addToast, Button } from "@heroui/react";
import DOMPurify from "dompurify";
import { marked } from "marked";
import hljs from "highlight.js";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import { useCreateComment } from "@/hooks/queries";
import { commentApi, type CreateCommentPayload } from "@/lib/api/comment";
import { extractQQFromEmail, generateAnonymousNickname, isValidEmail } from "./comment-utils";
import styles from "./CommentForm.module.css";

interface CommentFormConfig {
  limitLength: number;
  loginRequired: boolean;
  anonymousEmail: string;
  allowImageUpload: boolean;
  emojiCdn?: string;
  placeholder?: string;
}

export interface CommentFormHandle {
  showAnonymousDialog: () => boolean | undefined;
}

interface CommentFormProps {
  targetPath: string;
  targetTitle?: string;
  pageSize: number;
  parentId?: string | null;
  replyToId?: string | null;
  replyToNick?: string | null;
  replyToIsAnonymous?: boolean;
  showCancelButton?: boolean;
  config: CommentFormConfig;
  onAnonymousStateChange?: (state: boolean) => void;
  onSubmitted?: () => void;
  onCancel?: () => void;
}

interface EmojiPackage {
  name: string;
  type: string;
  iconHtml: string;
  items: { icon: string; text: string }[];
}

marked.setOptions({
  gfm: true,
  breaks: true,
});

export const CommentForm = forwardRef<CommentFormHandle, CommentFormProps>(function CommentForm(
  {
    targetPath,
    targetTitle,
    pageSize,
    parentId,
    replyToId,
    replyToNick,
    replyToIsAnonymous,
    showCancelButton,
    config,
    onAnonymousStateChange,
    onSubmitted,
    onCancel,
  }: CommentFormProps,
  ref
) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const emojiPickerRef = useRef<HTMLButtonElement | null>(null);
  const router = useRouter();

  const contentId = useId();
  const nicknameId = useId();
  const emailId = useId();
  const websiteId = useId();
  const emojiPanelId = useId();

  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [content, setContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [nicknameTouched, setNicknameTouched] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isAnonymousDialogOpen, setIsAnonymousDialogOpen] = useState(false);
  const [emojiPackages, setEmojiPackages] = useState<EmojiPackage[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeEmojiPackageIndex, setActiveEmojiPackageIndex] = useState(0);
  const [previewEmojiUrl, setPreviewEmojiUrl] = useState("");
  const [isEmojiPreviewVisible, setIsEmojiPreviewVisible] = useState(false);
  const [emojiPreviewPosition, setEmojiPreviewPosition] = useState({ x: 0, y: 0 });
  const [quoteText, setQuoteText] = useState("");
  const uploadedFileUrlsRef = useRef<Map<string, string>>(new Map());

  const accessToken = useAuthStore(state => state.accessToken);
  const user = useAuthStore(state => state.user);
  const isLoggedIn = Boolean(accessToken && user);
  const loginRedirectUrl = useMemo(() => `/login?redirect=${encodeURIComponent(targetPath || "/")}`, [targetPath]);
  const registerRedirectUrl = useMemo(
    () => `/login?register=1&redirect=${encodeURIComponent(targetPath || "/")}`,
    [targetPath]
  );

  const createComment = useCreateComment(targetPath, pageSize);

  const isReply = Boolean(parentId);
  const shouldShowCancel = Boolean(showCancelButton ?? isReply);

  const emojiMap = useMemo(() => {
    const map = new Map<string, string>();
    emojiPackages.forEach(pkg => {
      pkg.items.forEach(item => {
        map.set(item.text, item.icon);
      });
    });
    return map;
  }, [emojiPackages]);

  const previewHtml = useMemo(() => {
    if (!isPreview) return "";
    const rawHtml = marked.parse(content || "");
    let html = typeof rawHtml === "string" ? rawHtml : "";
    // 将 anzhiyu://file/{id} 替换为本地预览 blob URL
    html = html.replace(/anzhiyu:\/\/file\/([a-zA-Z0-9_-]+)/g, (_match, fileId: string) => {
      const blobUrl = uploadedFileUrlsRef.current.get(fileId);
      return blobUrl || _match;
    });
    if (emojiMap.size > 0) {
      const escaped = Array.from(emojiMap.keys()).map(text => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
      if (escaped.length > 0) {
        const pattern = new RegExp(`(${escaped.join("|")})`, "g");
        html = html.replace(pattern, match => {
          const icon = emojiMap.get(match);
          if (!icon) return match;
          return `<img src="${icon}" alt="${match}" class="anzhiyu-owo-emotion" />`;
        });
      }
    }
    // 允许 blob: 协议，用于预览上传的图片
    return DOMPurify.sanitize(html, {
      ALLOWED_URI_REGEXP:
        /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sip|cid|xmpp|blob):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
    });
  }, [content, isPreview, emojiMap]);

  useEffect(() => {
    if (!isPreview || !previewRef.current) return;
    const blocks = previewRef.current.querySelectorAll("pre code");
    blocks.forEach(block => {
      if ((block as HTMLElement).dataset.highlighted === "yes") return;
      hljs.highlightElement(block as HTMLElement);
      (block as HTMLElement).dataset.highlighted = "yes";
    });
  }, [previewHtml, isPreview]);

  // 组件卸载时释放 blob URL，防止内存泄漏
  useEffect(() => {
    const urlsRef = uploadedFileUrlsRef;
    return () => {
      urlsRef.current.forEach(url => URL.revokeObjectURL(url));
      urlsRef.current.clear();
    };
  }, []);

  const loadUserInfo = useCallback(() => {
    if (isLoggedIn && user) {
      setNickname(user.nickname || user.username || "");
      setEmail(user.email || "");
      return;
    }
    const stored = localStorage.getItem("comment-user-info");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as { nickname?: string; email?: string; website?: string };
        setNickname(parsed.nickname || "");
        setEmail(parsed.email || "");
        setWebsite(parsed.website || "");
      } catch {
        // ignore
      }
    }
  }, [isLoggedIn, user]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    loadUserInfo();
  }, [loadUserInfo]);

  useEffect(() => {
    const qq = extractQQFromEmail(email);
    if (!qq || nicknameTouched || isAnonymous) return;
    let isCancelled = false;
    commentApi
      .getQQInfo(qq)
      .then(res => {
        if (!isCancelled && res?.nickname) {
          setNickname(res.nickname);
        }
      })
      .catch(() => undefined);
    return () => {
      isCancelled = true;
    };
  }, [email, nicknameTouched, isAnonymous]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isLoggedIn) {
      localStorage.removeItem("comment-anonymous-state");
      if (isAnonymous) {
        setIsAnonymous(false);
        onAnonymousStateChange?.(false);
      }
      return;
    }
    const savedState = localStorage.getItem("comment-anonymous-state");
    if (savedState === "true") {
      setIsAnonymous(true);
      setNickname(generateAnonymousNickname());
      setEmail(config.anonymousEmail || "");
      onAnonymousStateChange?.(true);
    }
  }, [config.anonymousEmail, isLoggedIn, onAnonymousStateChange, isAnonymous]);

  useEffect(() => {
    const emojiCdn = config.emojiCdn;
    if (!emojiCdn) return;
    let isCancelled = false;
    const fetchEmojis = async () => {
      try {
        const response = await fetch(emojiCdn);
        if (!response.ok) throw new Error("Failed to fetch emojis");
        const data = (await response.json()) as Record<
          string,
          { type: string; container: Array<{ icon: string; text: string }> }
        >;
        const packages = Object.keys(data).map(key => {
          const packageData = data[key];
          const items = packageData.container.map(item => ({
            icon: item.icon.match(/src="([^"]+)"/)?.[1] || "",
            text: `:${item.text}:`,
          }));
          return {
            name: key.match(/title="([^"]+)"/)?.[1] || "Emojis",
            type: packageData.type,
            iconHtml: key,
            items,
          };
        });
        if (!isCancelled) {
          setEmojiPackages(packages);
          setActiveEmojiPackageIndex(0);
        }
      } catch {
        if (!isCancelled) {
          setEmojiPackages([]);
        }
      }
    };
    fetchEmojis();
    return () => {
      isCancelled = true;
    };
  }, [config.emojiCdn]);

  useEffect(() => {
    if (!showEmojiPicker) return;
    const handleClick = (event: globalThis.MouseEvent) => {
      if (!emojiPickerRef.current) return;
      if (emojiPickerRef.current.contains(event.target as Node)) return;
      setShowEmojiPicker(false);
    };
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [showEmojiPicker]);

  useEffect(() => {
    if (!showEmojiPicker) {
      setIsEmojiPreviewVisible(false);
    }
  }, [showEmojiPicker]);

  useEffect(() => {
    const handleSetQuote = (event: Event) => {
      const customEvent = event as CustomEvent<{ text?: string; targetPath?: string }>;
      const incomingText = customEvent.detail?.text?.trim();
      const quoteTargetPath = customEvent.detail?.targetPath;

      if (!incomingText) return;
      if (quoteTargetPath && quoteTargetPath !== targetPath) return;

      setQuoteText(incomingText);
      requestAnimationFrame(() => {
        textareaRef.current?.focus();
      });
    };

    window.addEventListener("comment-form-set-quote", handleSetQuote as EventListener);
    return () => {
      window.removeEventListener("comment-form-set-quote", handleSetQuote as EventListener);
    };
  }, [targetPath]);

  const insertAtCursor = (text: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setContent(prev => `${prev}${text}`);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const nextValue = `${content.slice(0, start)}${text}${content.slice(end)}`;
    setContent(nextValue);
    requestAnimationFrame(() => {
      textarea.focus();
      const pos = start + text.length;
      textarea.setSelectionRange(pos, pos);
    });
  };

  const addEmoji = (emojiText: string) => {
    const newText = ` ${emojiText} `;
    insertAtCursor(newText);
  };

  const handleEmojiEnter = (event: ReactMouseEvent<HTMLLIElement>, emoji: { icon: string }) => {
    if (!emoji.icon) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const previewWidth = 80;
    const previewHeight = 80;
    setEmojiPreviewPosition({
      x: rect.left + rect.width / 2 - previewWidth / 2,
      y: rect.top - previewHeight + 3,
    });
    setPreviewEmojiUrl(emoji.icon);
    setIsEmojiPreviewVisible(true);
  };

  const handleEmojiLeave = () => {
    setIsEmojiPreviewVisible(false);
  };

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      addToast({ title: "请选择有效的图片文件", color: "danger", timeout: 2000 });
      return;
    }
    setIsUploading(true);
    try {
      const res = await commentApi.uploadCommentImage(file);
      const fileId = res?.id;
      if (!fileId) {
        throw new Error("服务器未返回有效的文件 ID");
      }
      // 创建本地预览 URL，用于预览时替换 anzhiyu:// 协议
      const blobUrl = URL.createObjectURL(file);
      uploadedFileUrlsRef.current.set(fileId, blobUrl);
      const markdownImage = `![${file.name}](anzhiyu://file/${fileId})`;
      insertAtCursor(markdownImage);
      addToast({ title: "图片已插入，可预览查看效果", color: "success", timeout: 2000 });
    } catch {
      addToast({ title: "图片上传失败，请稍后再试", color: "danger", timeout: 2000 });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
    event.target.value = "";
  };

  const validateForm = () => {
    if (replyToIsAnonymous) {
      setErrorMessage("匿名评论不允许被回复");
      return false;
    }
    if (!content.trim()) {
      setErrorMessage("请输入评论内容");
      return false;
    }
    if (!isLoggedIn && !isAnonymous) {
      if (!nickname.trim()) {
        setErrorMessage("请输入昵称");
        return false;
      }
      if (!email.trim() || !isValidEmail(email)) {
        setErrorMessage("请输入有效的邮箱地址");
        return false;
      }
    }
    setErrorMessage(null);
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const finalContent = quoteText ? `> ${quoteText}\n\n${content.trim()}` : content.trim();

    const payload: CreateCommentPayload = {
      target_path: targetPath,
      target_title: targetTitle,
      parent_id: parentId,
      reply_to_id: replyToId,
      nickname: isLoggedIn && user ? user.nickname || user.username || "" : nickname,
      email: isLoggedIn && user ? user.email || "" : email,
      website: website || undefined,
      content: finalContent,
      is_anonymous: isAnonymous,
    };

    try {
      await createComment.mutateAsync(payload);
      if (!isLoggedIn) {
        localStorage.setItem(
          "comment-user-info",
          JSON.stringify({ nickname: payload.nickname, email: payload.email, website })
        );
      }
      setContent("");
      setQuoteText("");
      setIsPreview(false);
      addToast({ title: "评论已提交", color: "success", timeout: 2000 });
      onSubmitted?.();
    } catch (error) {
      const message = error instanceof Error ? error.message : "评论提交失败";
      setErrorMessage(message);
      addToast({ title: message, color: "danger", timeout: 2000 });
    }
  };

  const handleAnonymousDialogConfirm = () => {
    setIsAnonymous(true);
    setNickname(generateAnonymousNickname());
    setEmail(config.anonymousEmail || "");
    localStorage.setItem("comment-anonymous-state", "true");
    onAnonymousStateChange?.(true);
    setIsAnonymousDialogOpen(false);
    addToast({ title: "已开启匿名评论模式", color: "success", timeout: 2000 });
  };

  const handleAnonymousDialogCancel = () => {
    setIsAnonymousDialogOpen(false);
  };

  const showAnonymousDialog = useCallback(() => {
    if (config.loginRequired || isLoggedIn) return undefined;
    if (!isAnonymous) {
      setIsAnonymousDialogOpen(true);
      return false;
    }
    setIsAnonymous(false);
    localStorage.setItem("comment-anonymous-state", "false");
    loadUserInfo();
    onAnonymousStateChange?.(false);
    addToast({ title: "已关闭匿名评论模式", color: "success", timeout: 2000 });
    return false;
  }, [config.loginRequired, isLoggedIn, isAnonymous, loadUserInfo, onAnonymousStateChange]);

  useImperativeHandle(
    ref,
    () => ({
      showAnonymousDialog,
    }),
    [showAnonymousDialog]
  );

  if (config.loginRequired && !isLoggedIn) {
    return (
      <div className={styles.loginRequiredWrapper}>
        <div className={styles.loginRequiredContent}>
          <svg
            className={styles.loginIcon}
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <h3 className={styles.loginTitle}>请登录后发表评论</h3>
          <div className={styles.loginActions}>
            <button
              className={cn(styles.loginButton, styles.loginActionButton)}
              type="button"
              onClick={() => router.push(loginRedirectUrl)}
            >
              去登录
            </button>
            <button
              className={cn(styles.registerButton, styles.loginActionButton)}
              type="button"
              onClick={() => router.push(registerRedirectUrl)}
            >
              立即注册
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.commentForm}>
      {quoteText ? (
        <div className={styles.quotePreview}>
          <div className={styles.quotePreviewHeader}>
            <Icon icon="fa6-solid:quote-left" width={14} height={14} />
            <span className={styles.quotePreviewTitle}>正在引用</span>
            <button
              type="button"
              className={styles.quotePreviewClose}
              onClick={() => setQuoteText("")}
              aria-label="取消引用"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className={styles.quotePreviewContent}>{quoteText}</div>
        </div>
      ) : null}
      <div className={styles.textareaContainer}>
        <div className={cn(styles.textareaWrapper, isLoggedIn && styles.textareaWrapperLoggedIn)}>
          <label htmlFor={contentId} className={styles.srOnly}>
            评论内容
          </label>
          <textarea
            ref={textareaRef}
            id={contentId}
            name="content"
            className={styles.textareaInner}
            rows={5}
            placeholder={isReply ? `回复 @${replyToNick || "评论"}` : config.placeholder || "欢迎留下宝贵的建议啦～"}
            value={content}
            maxLength={config.limitLength}
            onChange={e => setContent(e.target.value)}
            aria-label="评论内容"
          />
          <div className={styles.textareaActions}>
            {emojiPackages.length > 0 && (
              <button
                ref={emojiPickerRef}
                className={cn(styles.actionIcon, styles.owo, showEmojiPicker && styles.owoOpen)}
                type="button"
                aria-label={showEmojiPicker ? "关闭表情面板" : "打开表情面板"}
                aria-haspopup="dialog"
                aria-expanded={showEmojiPicker}
                aria-controls={emojiPanelId}
                onClick={() => setShowEmojiPicker(prev => !prev)}
              >
                <div className={styles.owoLogo}>
                  <Icon icon="ri:emoji-sticker-line" width="18" height="18" />
                </div>
                {showEmojiPicker && (
                  <div
                    id={emojiPanelId}
                    className={styles.owoBody}
                    role="dialog"
                    aria-label="表情选择器"
                    onClick={event => event.stopPropagation()}
                  >
                    <ul className={styles.owoItems}>
                      {emojiPackages[activeEmojiPackageIndex]?.items.map(emoji => (
                        <li
                          key={emoji.text}
                          className={styles.owoItem}
                          title={emoji.text}
                          onClick={() => addEmoji(emoji.text)}
                          onMouseEnter={event => handleEmojiEnter(event, emoji)}
                          onMouseLeave={handleEmojiLeave}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={emoji.icon} alt={emoji.text} />
                        </li>
                      ))}
                    </ul>
                    <div className={styles.owoBar}>
                      <ul className={styles.owoPackages}>
                        {emojiPackages.map((pkg, index) => (
                          <li
                            key={pkg.name}
                            className={cn(index === activeEmojiPackageIndex && styles.owoPackageActive)}
                            onClick={() => setActiveEmojiPackageIndex(index)}
                          >
                            <div dangerouslySetInnerHTML={{ __html: pkg.iconHtml }} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </button>
            )}
            {config.allowImageUpload && (
              <>
                <button
                  className={styles.actionIcon}
                  type="button"
                  disabled={isUploading}
                  title={isUploading ? "上传中..." : "上传图片"}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Icon icon="jam:picture-f" width="18" height="18" />
                </button>
                <input ref={fileInputRef} type="file" hidden accept="image/*" onChange={handleFileChange} />
              </>
            )}
            <button
              className={cn(styles.actionIcon, styles.previewButton, isPreview && styles.actionIconActive)}
              type="button"
              title={isPreview ? "编辑" : "预览"}
              onClick={() => setIsPreview(prev => !prev)}
            >
              <Icon icon="fa6-brands:markdown" width="18" height="18" />
            </button>
          </div>
          <div className={styles.inputCount}>
            {content.length}/{config.limitLength}
          </div>
          {isLoggedIn && (
            <div className={styles.loggedInSubmitWrapper}>
              {shouldShowCancel && onCancel && (
                <Button size="sm" variant="flat" className={styles.cancelButton} onPress={onCancel}>
                  取消
                </Button>
              )}
              <Button
                size="sm"
                color="primary"
                className={styles.loggedInSubmitButton}
                isDisabled={!content.trim()}
                isLoading={createComment.isPending}
                onPress={handleSubmit}
              >
                发送
              </Button>
            </div>
          )}
        </div>

        {isPreview && (
          <div className={styles.markdownPreviewContainer}>
            <div className={styles.previewLabel}>预览</div>
            <div
              ref={previewRef}
              className={cn(styles.markdownPreview, styles.commentContent)}
              dangerouslySetInnerHTML={{ __html: previewHtml }}
            />
          </div>
        )}
      </div>

      {!isLoggedIn && (
        <div className={cn(styles.formMetaActions, shouldShowCancel && styles.formMetaActionsReply)}>
          <div className={styles.metaInputs}>
            <div className={styles.metaInput} data-hint="输入QQ号会自动获取昵称和头像">
              <label className={styles.metaLabel} htmlFor={nicknameId}>
                昵称
              </label>
              <input
                className={styles.metaField}
                id={nicknameId}
                name="nickname"
                autoComplete="nickname"
                placeholder="必填"
                value={nickname}
                onChange={e => {
                  setNickname(e.target.value);
                  setNicknameTouched(true);
                }}
                disabled={isAnonymous}
              />
            </div>
            <div className={styles.metaInput} data-hint="收到回复将会发送到你的邮箱">
              <label className={styles.metaLabel} htmlFor={emailId}>
                邮箱
              </label>
              <input
                className={styles.metaField}
                id={emailId}
                name="email"
                autoComplete="email"
                type="email"
                placeholder="必填"
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={isAnonymous}
              />
            </div>
            <div className={styles.metaInput}>
              <label className={styles.metaLabel} htmlFor={websiteId}>
                网址
              </label>
              <input
                className={styles.metaField}
                id={websiteId}
                name="website"
                autoComplete="url"
                placeholder="选填"
                value={website}
                onChange={e => setWebsite(e.target.value)}
              />
            </div>
          </div>
          <div className={styles.buttonsWrapper}>
            {shouldShowCancel && onCancel && (
              <Button size="sm" variant="flat" className={styles.cancelButton} onPress={onCancel}>
                取消
              </Button>
            )}
            <Button
              size="sm"
              color="primary"
              className={styles.submitButton}
              isDisabled={!content.trim()}
              isLoading={createComment.isPending}
              onPress={handleSubmit}
            >
              发送
            </Button>
          </div>
        </div>
      )}

      {errorMessage && <div className={styles.errorText}>{errorMessage}</div>}

      {isAnonymousDialogOpen && (
        <div className={styles.dialogOverlay} onClick={handleAnonymousDialogCancel}>
          <div className={styles.dialog} onClick={e => e.stopPropagation()}>
            <div className={styles.dialogHeader}>
              <div className={styles.dialogTitle}>开启匿名评论</div>
              <button className={styles.dialogClose} onClick={handleAnonymousDialogCancel} aria-label="关闭">
                <X size={16} />
              </button>
            </div>
            <div className={styles.dialogContent}>开启后将使用随机昵称与匿名邮箱进行评论，是否继续？</div>
            <div className={styles.dialogActions}>
              <button className={styles.cancelButton} type="button" onClick={handleAnonymousDialogCancel}>
                取消
              </button>
              <button className={styles.submitButton} type="button" onClick={handleAnonymousDialogConfirm}>
                确认开启
              </button>
            </div>
          </div>
        </div>
      )}

      {isEmojiPreviewVisible &&
        previewEmojiUrl &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className={styles.emojiPreview}
            style={{ left: `${emojiPreviewPosition.x}px`, top: `${emojiPreviewPosition.y}px` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewEmojiUrl} alt="emoji-preview" />
          </div>,
          document.body
        )}
    </div>
  );
});
