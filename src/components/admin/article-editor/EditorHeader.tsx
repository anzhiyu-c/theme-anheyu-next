"use client";

import { Button, Tooltip } from "@heroui/react";
import { ArrowLeft, PanelRight, SmilePlus, X, Lock, Cloud, Loader2, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect, useCallback } from "react";
import type { AutoSaveStatus } from "./use-auto-save";

// ---- Emoji 数据（带搜索关键词） ----
// n=tooltip名称（也用于搜索）, k=额外搜索关键词
type EmojiItem = { e: string; n: string; k: string };
const EMOJI_CATEGORIES: { key: string; label: string; emojis: EmojiItem[] }[] = [
  {
    key: "recommend",
    label: "推荐",
    emojis: [
      { e: "🔥", n: "火", k: "火 热 fire hot" },
      { e: "🥇", n: "金牌", k: "金牌 第一 gold first" },
      { e: "🥈", n: "银牌", k: "银牌 第二 silver second" },
      { e: "🥉", n: "铜牌", k: "铜牌 第三 bronze third" },
      { e: "🏅", n: "奖牌", k: "奖牌 medal" },
      { e: "🎖️", n: "勋章", k: "勋章 badge" },
      { e: "🚩", n: "旗", k: "旗 flag" },
      { e: "🎯", n: "目标", k: "目标 靶子 target" },
      { e: "🚀", n: "火箭", k: "火箭 rocket launch" },
      { e: "💯", n: "满分", k: "满分 hundred perfect" },
      { e: "📅", n: "日历", k: "日历 calendar date" },
      { e: "📈", n: "增长", k: "增长 上升 chart up" },
      { e: "📉", n: "下降", k: "下降 chart down" },
      { e: "📊", n: "图表", k: "图表 统计 bar chart" },
      { e: "📋", n: "剪贴板", k: "剪贴板 clipboard" },
      { e: "🔔", n: "铃铛", k: "铃铛 通知 bell notification" },
      { e: "🔍", n: "搜索", k: "搜索 放大镜 search" },
      { e: "💡", n: "灯泡", k: "灯泡 想法 idea light" },
      { e: "💌", n: "情书", k: "情书 信 letter love" },
      { e: "❤️", n: "红心", k: "红心 爱 heart love red" },
      { e: "🧡", n: "橙心", k: "橙心 orange heart" },
      { e: "💛", n: "黄心", k: "黄心 yellow heart" },
      { e: "💚", n: "绿心", k: "绿心 green heart" },
      { e: "💙", n: "蓝心", k: "蓝心 blue heart" },
      { e: "💜", n: "紫心", k: "紫心 purple heart" },
      { e: "🖤", n: "黑心", k: "黑心 black heart" },
      { e: "🤍", n: "白心", k: "白心 white heart" },
      { e: "💥", n: "爆炸", k: "爆炸 boom explosion" },
      { e: "⭐", n: "星", k: "星 star" },
      { e: "🌟", n: "闪星", k: "闪星 star glow" },
      { e: "✨", n: "闪闪", k: "闪闪 sparkle" },
      { e: "🎉", n: "庆祝", k: "庆祝 party 撒花" },
      { e: "🏆", n: "奖杯", k: "奖杯 冠军 trophy champion" },
    ],
  },
  {
    key: "face",
    label: "表情",
    emojis: [
      { e: "😀", n: "笑", k: "笑 开心 grin happy" },
      { e: "😃", n: "笑", k: "笑 大笑 smile" },
      { e: "😄", n: "笑", k: "笑 开心 happy" },
      { e: "😁", n: "笑", k: "笑 嘿嘿 grin" },
      { e: "😆", n: "笑", k: "笑 哈哈 laugh" },
      { e: "😅", n: "汗", k: "汗 尴尬 sweat" },
      { e: "🤣", n: "笑死", k: "笑死 rolling laugh" },
      { e: "😂", n: "笑哭", k: "笑哭 joy tears" },
      { e: "🙂", n: "微笑", k: "微笑 slight smile" },
      { e: "😉", n: "眨眼", k: "眨眼 wink" },
      { e: "😊", n: "害羞", k: "害羞 blush" },
      { e: "😇", n: "天使", k: "天使 angel" },
      { e: "🥰", n: "爱", k: "爱 喜欢 love hearts" },
      { e: "😍", n: "花痴", k: "花痴 heart eyes love" },
      { e: "🤩", n: "星星眼", k: "星星眼 star struck" },
      { e: "😘", n: "飞吻", k: "飞吻 kiss blow" },
      { e: "🥲", n: "感动", k: "感动 含泪 smile tear" },
      { e: "😋", n: "好吃", k: "好吃 yummy delicious" },
      { e: "😜", n: "调皮", k: "调皮 wink tongue" },
      { e: "🤪", n: "疯狂", k: "疯狂 crazy zany" },
      { e: "🤑", n: "发财", k: "发财 money rich" },
      { e: "🤗", n: "拥抱", k: "拥抱 hug" },
      { e: "🤭", n: "偷笑", k: "偷笑 giggle" },
      { e: "🤫", n: "嘘", k: "嘘 安静 shush quiet" },
      { e: "🤔", n: "思考", k: "思考 想 thinking hmm" },
      { e: "😐", n: "无语", k: "无语 neutral" },
      { e: "😏", n: "得意", k: "得意 smirk" },
      { e: "🙄", n: "翻白眼", k: "翻白眼 eye roll" },
      { e: "😬", n: "尴尬", k: "尴尬 grimace awkward" },
      { e: "😔", n: "失望", k: "失望 sad" },
      { e: "😴", n: "睡觉", k: "睡觉 sleep zzz" },
      { e: "🤒", n: "生病", k: "生病 sick" },
      { e: "🤮", n: "呕吐", k: "呕吐 vomit" },
      { e: "🥵", n: "热", k: "热 hot" },
      { e: "🥶", n: "冷", k: "冷 cold freezing" },
      { e: "🤯", n: "爆炸", k: "爆炸 mind blown" },
      { e: "🥳", n: "派对", k: "派对 party celebrate" },
      { e: "😎", n: "酷", k: "酷 cool sunglasses" },
      { e: "🤓", n: "书呆子", k: "书呆子 nerd" },
      { e: "😱", n: "惊恐", k: "惊恐 尖叫 scream horror" },
      { e: "😭", n: "大哭", k: "大哭 cry loud" },
      { e: "😤", n: "生气", k: "生气 angry huff" },
      { e: "🫠", n: "融化", k: "融化 melting" },
    ],
  },
  {
    key: "people",
    label: "人物",
    emojis: [
      { e: "👋", n: "挥手", k: "挥手 你好 wave hello" },
      { e: "✋", n: "举手", k: "举手 停 hand stop" },
      { e: "👌", n: "OK", k: "OK 好的 okay" },
      { e: "✌️", n: "胜利", k: "胜利 和平 victory peace" },
      { e: "🤞", n: "祈祷", k: "祈祷 crossed fingers" },
      { e: "🤟", n: "爱你", k: "爱你 love you" },
      { e: "🤘", n: "摇滚", k: "摇滚 rock" },
      { e: "👈", n: "左", k: "左 left point" },
      { e: "👉", n: "右", k: "右 right point" },
      { e: "👆", n: "上", k: "上 up point" },
      { e: "👇", n: "下", k: "下 down point" },
      { e: "👍", n: "赞", k: "赞 好 thumbs up good" },
      { e: "👎", n: "踩", k: "踩 差 thumbs down bad" },
      { e: "✊", n: "拳", k: "拳 加油 fist" },
      { e: "👊", n: "打拳", k: "打拳 punch" },
      { e: "👏", n: "鼓掌", k: "鼓掌 拍手 clap" },
      { e: "🙌", n: "举手", k: "举手 万岁 raised hands hooray" },
      { e: "🤝", n: "握手", k: "握手 合作 handshake" },
      { e: "🙏", n: "祈祷", k: "祈祷 拜托 pray please" },
      { e: "💪", n: "肌肉", k: "肌肉 力量 muscle strong" },
      { e: "🧠", n: "大脑", k: "大脑 聪明 brain smart" },
      { e: "👀", n: "看", k: "看 眼睛 eyes look" },
      { e: "💋", n: "嘴唇", k: "嘴唇 亲亲 kiss lips" },
    ],
  },
  {
    key: "nature",
    label: "自然",
    emojis: [
      { e: "🌸", n: "樱花", k: "樱花 cherry blossom" },
      { e: "🌹", n: "玫瑰", k: "玫瑰 rose" },
      { e: "🌻", n: "向日葵", k: "向日葵 sunflower" },
      { e: "🌷", n: "郁金香", k: "郁金香 tulip" },
      { e: "🌱", n: "种子", k: "种子 发芽 seedling sprout" },
      { e: "🌲", n: "松树", k: "松树 pine tree" },
      { e: "🍀", n: "四叶草", k: "四叶草 幸运 clover lucky" },
      { e: "🍁", n: "枫叶", k: "枫叶 秋天 maple autumn" },
      { e: "🌍", n: "地球", k: "地球 earth globe" },
      { e: "🌕", n: "满月", k: "满月 full moon" },
      { e: "🌙", n: "月亮", k: "月亮 moon crescent" },
      { e: "🌈", n: "彩虹", k: "彩虹 rainbow" },
      { e: "☀️", n: "太阳", k: "太阳 晴天 sun sunny" },
      { e: "⛅", n: "多云", k: "多云 cloudy" },
      { e: "🌧️", n: "下雨", k: "下雨 rain" },
      { e: "❄️", n: "雪花", k: "雪花 snow" },
      { e: "💧", n: "水滴", k: "水滴 water drop" },
    ],
  },
  {
    key: "food",
    label: "食物",
    emojis: [
      { e: "🍎", n: "苹果", k: "苹果 apple red" },
      { e: "🍊", n: "橙子", k: "橙子 orange" },
      { e: "🍉", n: "西瓜", k: "西瓜 watermelon" },
      { e: "🍇", n: "葡萄", k: "葡萄 grape" },
      { e: "🍓", n: "草莓", k: "草莓 strawberry" },
      { e: "🍑", n: "桃子", k: "桃子 peach" },
      { e: "🍕", n: "披萨", k: "披萨 pizza" },
      { e: "🍔", n: "汉堡", k: "汉堡 burger hamburger" },
      { e: "🍟", n: "薯条", k: "薯条 fries" },
      { e: "🍿", n: "爆米花", k: "爆米花 popcorn" },
      { e: "🍳", n: "鸡蛋", k: "鸡蛋 煎蛋 egg fry" },
      { e: "🍞", n: "面包", k: "面包 bread" },
      { e: "🍰", n: "蛋糕", k: "蛋糕 cake" },
      { e: "🎂", n: "生日蛋糕", k: "生日蛋糕 birthday cake" },
      { e: "🍩", n: "甜甜圈", k: "甜甜圈 donut" },
      { e: "🍪", n: "饼干", k: "饼干 cookie" },
      { e: "☕", n: "咖啡", k: "咖啡 coffee" },
      { e: "🍵", n: "茶", k: "茶 tea" },
      { e: "🧋", n: "奶茶", k: "奶茶 珍珠 boba milk tea bubble" },
    ],
  },
  {
    key: "activity",
    label: "活动",
    emojis: [
      { e: "⚽", n: "足球", k: "足球 soccer football" },
      { e: "🏀", n: "篮球", k: "篮球 basketball" },
      { e: "🎾", n: "网球", k: "网球 tennis" },
      { e: "🎮", n: "游戏", k: "游戏 game controller" },
      { e: "🎲", n: "骰子", k: "骰子 dice" },
      { e: "🧩", n: "拼图", k: "拼图 puzzle" },
      { e: "🎯", n: "靶子", k: "靶子 目标 dart target" },
      { e: "🎨", n: "调色板", k: "调色板 画 art palette paint" },
      { e: "🎵", n: "音乐", k: "音乐 music note" },
      { e: "🎶", n: "音符", k: "音符 music notes" },
      { e: "🎤", n: "麦克风", k: "麦克风 唱歌 mic sing" },
      { e: "🎧", n: "耳机", k: "耳机 headphone" },
      { e: "🎸", n: "吉他", k: "吉他 guitar" },
    ],
  },
  {
    key: "objects",
    label: "物品",
    emojis: [
      { e: "💻", n: "电脑", k: "电脑 笔记本 laptop computer" },
      { e: "📱", n: "手机", k: "手机 phone mobile" },
      { e: "📷", n: "相机", k: "相机 camera photo" },
      { e: "💡", n: "灯泡", k: "灯泡 想法 idea bulb" },
      { e: "🔋", n: "电池", k: "电池 battery" },
      { e: "📚", n: "书", k: "书 books read" },
      { e: "📝", n: "笔记", k: "笔记 写 memo write note" },
      { e: "✏️", n: "铅笔", k: "铅笔 pencil" },
      { e: "📌", n: "图钉", k: "图钉 pin" },
      { e: "🔑", n: "钥匙", k: "钥匙 key" },
      { e: "🔒", n: "锁", k: "锁 lock" },
      { e: "🔧", n: "扳手", k: "扳手 工具 wrench tool" },
      { e: "⚙️", n: "齿轮", k: "齿轮 设置 gear settings" },
      { e: "💎", n: "钻石", k: "钻石 宝石 diamond gem" },
    ],
  },
];

interface EditorHeaderProps {
  title: string;
  onTitleChange: (title: string) => void;
  onSave: () => void;
  isSaving: boolean;
  isEditMode: boolean;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  /** 文章 ID（编辑模式） */
  articleId?: string;
  /** 自动保存状态 */
  autoSaveStatus?: AutoSaveStatus;
  /** 上次自动保存时间 */
  lastSavedAt?: Date | null;
  /** 文章最后更新时间（用于编辑模式初始显示） */
  articleUpdatedAt?: string;
}

/** 格式化时间为 HH:mm:ss */
function formatTime(date: Date): string {
  return date.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
}

export function EditorHeader({
  title,
  onTitleChange,
  onSave,
  isSaving,
  isEditMode,
  sidebarOpen,
  onToggleSidebar,
  articleId,
  autoSaveStatus = "idle",
  lastSavedAt,
  articleUpdatedAt,
}: EditorHeaderProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [emojiCategory, setEmojiCategory] = useState("recommend");
  const [emojiSearch, setEmojiSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const emojiRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      // 全选标题文字
      inputRef.current.select();
    }
  }, [isEditing]);

  // 点击外部关闭 emoji picker
  useEffect(() => {
    if (!showEmoji) return;
    const handler = (e: MouseEvent) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target as Node)) {
        setShowEmoji(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showEmoji]);

  const handleFinishEdit = useCallback(() => {
    // 延迟检查：如果焦点移到了 emoji 面板内（如搜索框），不关闭编辑态
    setTimeout(() => {
      if (emojiRef.current?.contains(document.activeElement)) return;
      if (!showEmoji) {
        setIsEditing(false);
      }
    }, 0);
  }, [showEmoji]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setIsEditing(false);
      setShowEmoji(false);
    }
    if (e.key === "Escape") {
      setIsEditing(false);
      setShowEmoji(false);
    }
  };

  const insertEmoji = useCallback(
    (emoji: string) => {
      const input = inputRef.current;
      if (input) {
        const start = input.selectionStart ?? 0;
        const end = input.selectionEnd ?? 0;
        const newTitle = title.slice(0, start) + emoji + title.slice(end);
        onTitleChange(newTitle);
        // 恢复光标到 emoji 后面
        const newPos = start + emoji.length;
        setTimeout(() => {
          input.focus();
          input.setSelectionRange(newPos, newPos);
        }, 0);
      } else {
        // 未聚焦时默认加在最前面
        onTitleChange(emoji + title);
      }
    },
    [title, onTitleChange]
  );

  // 过滤 emoji（按关键词搜索）
  const filteredEmojis = emojiSearch
    ? EMOJI_CATEGORIES.flatMap(c => c.emojis).filter(
        item => item.k.toLowerCase().includes(emojiSearch.toLowerCase()) || item.e.includes(emojiSearch)
      )
    : EMOJI_CATEGORIES.find(c => c.key === emojiCategory)?.emojis || [];

  // 用于切换分类/搜索时重新触发动画
  const emojiGridKey = emojiSearch || emojiCategory;

  // emoji hover 预览
  const [hoveredEmoji, setHoveredEmoji] = useState<EmojiItem | null>(null);

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 border-b border-border bg-background shrink-0">
      {/* 返回按钮 */}
      <Button
        isIconOnly
        variant="light"
        size="sm"
        onPress={() => router.push("/admin/post-management")}
        aria-label="返回文章列表"
      >
        <ArrowLeft className="w-4 h-4" />
      </Button>

      {/* 标题区域 -- 统一容器高度，切换内容不跳动 */}
      <div className="flex-1 relative" ref={emojiRef}>
        {isEditing ? (
          /* 激活态：输入框 + emoji 按钮 */
          <div className="flex items-center gap-2 rounded-lg h-9 px-3 bg-card ring-2 ring-primary/40 focus-within:ring-primary transition-shadow">
            <button
              type="button"
              onMouseDown={e => e.preventDefault()}
              onClick={() => setShowEmoji(!showEmoji)}
              className="shrink-0 text-default-400 hover:text-primary transition-colors"
              title="插入表情"
            >
              <SmilePlus className="w-4.5 h-4.5" />
            </button>
            <input
              ref={inputRef}
              type="text"
              value={title}
              onChange={e => onTitleChange(e.target.value)}
              onBlur={handleFinishEdit}
              onKeyDown={handleKeyDown}
              placeholder="无标题文章"
              className="flex-1 text-base font-semibold bg-transparent border-none outline-none placeholder:text-default-300 min-w-0"
            />
          </div>
        ) : (
          /* 非激活态：纯文字 */
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="w-full text-left text-base font-semibold truncate h-9 flex items-center px-3 rounded-lg hover:bg-default-100/5 transition-colors"
            title="点击编辑标题"
          >
            {title || <span className="text-default-300">无标题文章</span>}
          </button>
        )}

        {/* Emoji 选择器（带进出动画） */}
        <div
          className={`absolute top-full left-0 mt-2 w-[380px] bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden
            transition-all duration-200 origin-top-left
            ${
              isEditing && showEmoji
                ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                : "opacity-0 scale-95 translate-y-1 pointer-events-none"
            }`}
          onMouseDown={e => {
            if ((e.target as HTMLElement).tagName !== "INPUT") {
              e.preventDefault();
            }
          }}
        >
          {/* 搜索框 */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
            <input
              type="text"
              value={emojiSearch}
              onChange={e => setEmojiSearch(e.target.value)}
              placeholder="搜索表情..."
              className="flex-1 text-sm bg-muted/30 border border-border rounded-lg px-3 py-1.5 outline-none focus:border-primary transition-colors"
            />
            <button
              type="button"
              onMouseDown={e => e.preventDefault()}
              onClick={() => setShowEmoji(false)}
              className="text-default-400 hover:text-default-600 text-sm shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Emoji 网格 */}
          <div className="p-2 h-[260px] overflow-auto">
            {!emojiSearch && (
              <div className="text-xs text-default-400 mb-1.5 px-1">
                {EMOJI_CATEGORIES.find(c => c.key === emojiCategory)?.label}
              </div>
            )}
            <div key={emojiGridKey} className="grid grid-cols-10 gap-0.5 emoji-grid-animate">
              {filteredEmojis.map((item, i) => (
                <button
                  key={`${item.e}-${i}`}
                  type="button"
                  className="w-8 h-8 flex items-center justify-center text-xl rounded
                    hover:bg-default-100 hover:scale-125 active:scale-95
                    transition-all duration-150 cursor-pointer
                    opacity-0 animate-[emojiItemIn_0.25s_ease-out_forwards]"
                  style={{ animationDelay: `${Math.min(i * 12, 300)}ms` }}
                  onClick={() => insertEmoji(item.e)}
                  onMouseDown={e => e.preventDefault()}
                  onMouseEnter={() => setHoveredEmoji(item)}
                  onMouseLeave={() => setHoveredEmoji(null)}
                >
                  {item.e}
                </button>
              ))}
            </div>
            {filteredEmojis.length === 0 && (
              <div className="text-sm text-default-300 text-center py-8">未找到匹配的表情</div>
            )}
          </div>

          {/* Hover 提示条 */}
          <div className="flex items-center gap-2 px-3 py-1.5 border-t border-border min-h-[32px]">
            {hoveredEmoji ? (
              <>
                <span className="text-lg">{hoveredEmoji.e}</span>
                <span className="text-xs text-default-500">{hoveredEmoji.n}</span>
              </>
            ) : (
              <span className="text-xs text-default-300">移到表情上查看名称</span>
            )}
          </div>

          {/* 分类标签 */}
          {!emojiSearch && (
            <div className="flex border-t border-border overflow-x-auto">
              {EMOJI_CATEGORIES.map(cat => (
                <button
                  key={cat.key}
                  type="button"
                  className={`px-3 py-2 text-xs whitespace-nowrap transition-colors ${
                    emojiCategory === cat.key
                      ? "text-primary border-b-2 border-primary font-medium"
                      : "text-default-500 hover:text-default-700"
                  }`}
                  onClick={() => setEmojiCategory(cat.key)}
                  onMouseDown={e => e.preventDefault()}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 自动保存状态指示 */}
      {isEditMode ? (
        <Tooltip content="查看历史版本" placement="bottom">
          <button
            type="button"
            onClick={() => articleId && router.push(`/admin/post-management/${articleId}/history`)}
            className="flex items-center gap-1.5 text-xs text-default-400 hover:text-default-600 transition-colors shrink-0 cursor-pointer px-2 py-1 rounded-md hover:bg-default-100"
          >
            <Lock className="w-3.5 h-3.5" />
            {autoSaveStatus === "saving" && (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>自动保存中...</span>
              </>
            )}
            {autoSaveStatus === "saved" && lastSavedAt && <span>已保存 {formatTime(lastSavedAt)}</span>}
            {autoSaveStatus === "error" && <span className="text-danger">保存失败</span>}
            {autoSaveStatus === "idle" && !lastSavedAt && articleUpdatedAt && (
              <span>已保存 {formatTime(new Date(articleUpdatedAt))}</span>
            )}
            {autoSaveStatus === "idle" && !lastSavedAt && !articleUpdatedAt && <span>未保存</span>}
            {autoSaveStatus === "idle" && lastSavedAt && <span>已保存 {formatTime(lastSavedAt)}</span>}
            <Cloud className="w-3.5 h-3.5" />
          </button>
        </Tooltip>
      ) : (
        <div className="flex items-center gap-1.5 text-xs text-default-400 shrink-0 px-2 py-1">
          <Lock className="w-3.5 h-3.5" />
          <span>新建文章</span>
          <Cloud className="w-3.5 h-3.5" />
        </div>
      )}

      {/* 右侧操作 */}
      <div className="flex items-center gap-1.5 shrink-0">
        <Button color="primary" size="sm" onPress={onSave} isLoading={isSaving}>
          {isEditMode ? "更新" : "发布"}
        </Button>
        {isEditMode && articleId && (
          <Tooltip content="查看文章" placement="bottom">
            <Button
              isIconOnly
              variant="light"
              size="sm"
              as="a"
              href={`/posts/${articleId}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="查看文章"
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          </Tooltip>
        )}
        <Button
          isIconOnly
          variant={sidebarOpen ? "flat" : "light"}
          size="sm"
          onPress={onToggleSidebar}
          aria-label="切换属性面板"
        >
          <PanelRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
