"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { friendsApi } from "@/lib/api/friends";
import type { RandomPostData } from "@/types/friends";

const RANDOM_POST_TIPS = [
  "钓到了绝世好文！",
  "在河边打了个喷嚏，吓跑了",
  "你和小伙伴抢夺着",
  "你击败了巨龙，在巢穴中发现了",
  "挖掘秦始皇坟时找到了",
  "在路边闲逛的时候随手买了一个",
  "从学校班主任那拿来了孩子上课偷偷看的",
  "你的同桌无情的从你的语文书中撕下了那篇你最喜欢的",
  "考古学家近日发现了",
  "外星人降临地球学习地球文化，落地时被你塞了",
  "从图书馆顶层的隐秘角落里发现了闪着金光的",
  "徒弟修炼走火入魔，为师立刻掏出了",
  "在大山中唱山歌，隔壁的阿妹跑来了，带着",
  "隔壁家的孩子数学考了满分，都是因为看了",
  "隔壁家的孩子英语考了满分，都是因为看了",
  "小米研发了全新一代MIX手机，据说灵感",
  "修炼渡劫成功，还好提前看了",
  "库克坐上了苹果CEO的宝座，因为他面试的时候看了",
  "阿里巴巴大喊芝麻开门，映入眼帘的就是",
  "师傅说练武要先炼心，然后让我好生研读",
  "科考队在南极大陆发现了被冰封的",
  "飞机窗户似乎被一张纸糊上了，仔细一看是",
  "历史上满写的仁义道德四个字，透过字缝里却全是",
  "十几年前的录音机似乎还能够使用，插上电发现正在播的是",
  "新版语文书拟增加一篇熟读并背诵的",
  "经调查，99%的受访者都没有背诵过",
  "今年的高考满分作文是",
  "唐僧揭开了佛祖压在五指山上的",
  "科学家发现能够解决衰老的秘密，就是每日研读",
  "英特尔发布了全新的至强处理器，其芯片的制造原理都是",
  "新的iPhone产能很足，新的进货渠道是",
  "今年亩产突破了八千万斤，多亏了",
  "陆隐一统天上宗，在无数祖境高手的目光下宣读了",
  "黑钻风跟白钻风说道，吃了唐僧肉能长生不老，他知道是因为看了",
  "上卫生间没带纸，直接提裤跑路也不愿意玷污手中",
  "种下一篇文章就会产生很多很多文章，我种下了",
  "三十年河东，三十年河西，莫欺我没有看过",
  "踏破铁血无觅处，得来全靠",
  "今日双色球中了两千万，预测全靠",
  "因为卷子上没写名字，老师罚抄",
  "为了抗议世间的不公，割破手指写下了",
  "在艺术大街上被贴满了相同的纸，走近一看是",
  "这区区迷阵岂能难得住我？其实能走出来多亏了",
  "今日被一篇文章顶上了微博热搜，它是",
  "你送给乞丐一个暴富秘籍，它是",
  "UZI一个走A拿下五杀，在事后采访时说他当时回想起了",
  "科学家解刨了第一个感染丧尸病毒的人，发现丧尸抗体存在于",
  "如果你有梦想的话，就要努力去看",
  "决定我们成为什么样人的，不是我们的能力，而是是否看过",
  "有信心不一定会成功，没信心就去看",
  "你真正是谁并不重要，重要的是你看没看过",
  "玄天境重要的是锻体，为师赠你此书，好好修炼去吧，这是",
  "上百祖境高手在天威湖大战三天三夜为了抢夺",
  "这化仙池水乃上古真仙对后人的考校，要求熟读并背诵",
  "庆氏三千年根基差点竟被你小子毁于一旦，能够被我拯救全是因为我看了",
];

const DEFAULT_FISH = 5;
const HUNGRY_FISH = 10;

function getHonor(times: number): string {
  if (times > 10000) return "愿者上钩";
  if (times > 1000) return "俯览天下";
  if (times > 100) return "绝世渔夫";
  if (times > 75) return "钓鱼王者";
  if (times > 50) return "钓鱼宗师";
  if (times > 20) return "钓鱼专家";
  if (times > 5) return "钓鱼高手";
  return "钓鱼新手";
}

function getRandomNum(min: number, max?: number): number {
  if (max === undefined) {
    return Number(Math.random() * min + 1);
  }
  return Number(Math.random() * (max - min + 1) + min);
}

function getStoredCount(key: string): number {
  if (typeof window === "undefined") {
    return 0;
  }

  try {
    const value = localStorage.getItem(key);
    if (!value) {
      return 0;
    }

    const parsed = parseInt(value, 10);
    return Number.isNaN(parsed) ? 0 : parsed;
  } catch {
    return 0;
  }
}

export function RandomPost() {
  const pathname = usePathname();
  const router = useRouter();

  const isLinkPage = useMemo(() => pathname === "/link", [pathname]);

  const [randomPostTip, setRandomPostTip] = useState("");
  const [randomPostInfo, setRandomPostInfo] = useState<RandomPostData>({
    author: "",
    avatar: "",
    created: "",
    link: "",
    title: "",
    updated: "",
  });
  const [loading, setLoading] = useState(true);
  const [hungerError, setHungerError] = useState(false);
  const [honor, setHonor] = useState("");
  const [randomPostTimes, setRandomPostTimes] = useState(0);
  const [isOpacity, setIsOpacity] = useState(false);

  const mountedRef = useRef(true);
  const randomPostTimesRef = useRef(0);
  const randomPostClickRef = useRef(0);
  const storageLoadedRef = useRef(false);
  const randomPostWorkingRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const ensureStorageLoaded = useCallback(() => {
    if (storageLoadedRef.current) {
      return;
    }

    randomPostTimesRef.current = getStoredCount("randomPostTimes");
    randomPostClickRef.current = getStoredCount("randomPostClick");
    storageLoadedRef.current = true;
  }, []);

  const fetchRandomPost = useCallback(async () => {
    if (randomPostWorkingRef.current || !document.getElementById("random-post")) {
      return;
    }

    ensureStorageLoaded();
    setLoading(true);
    randomPostWorkingRef.current = true;
    setRandomPostTip(RANDOM_POST_TIPS[Math.floor(Math.random() * RANDOM_POST_TIPS.length)]);
    setHonor(getHonor(randomPostTimesRef.current));

    const nextTimes = randomPostTimesRef.current + 1;
    randomPostTimesRef.current = nextTimes;
    setRandomPostTimes(nextTimes);

    try {
      localStorage.setItem("randomPostTimes", String(nextTimes));
    } catch {
      // ignore localStorage errors
    }

    let delay = getRandomNum(1000, 3000);
    if (nextTimes === 1) {
      delay = 0;
    }

    setIsOpacity(true);

    const shouldHungerFail =
      !isLinkPage &&
      randomPostClickRef.current * HUNGRY_FISH + DEFAULT_FISH < nextTimes &&
      Math.round(Math.random()) === 0;

    if (shouldHungerFail) {
      setHungerError(true);
      setLoading(false);
      randomPostWorkingRef.current = false;
      setIsOpacity(false);
      return;
    }

    try {
      const data = await friendsApi.getRandomPost();

      timerRef.current = setTimeout(() => {
        if (!mountedRef.current) {
          return;
        }
        setRandomPostInfo(data);
        setLoading(false);
        randomPostWorkingRef.current = false;
        setIsOpacity(false);
        setHungerError(false);
      }, delay);
    } catch {
      setLoading(false);
      randomPostWorkingRef.current = false;
      setIsOpacity(false);
    }
  }, [ensureStorageLoaded, isLinkPage]);

  useEffect(() => {
    mountedRef.current = true;
    const initTimer = window.setTimeout(() => {
      void fetchRandomPost();
    }, 0);

    return () => {
      mountedRef.current = false;
      clearTimeout(initTimer);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [fetchRandomPost]);

  const handleRandomClickLink = useCallback(() => {
    const nextClick = randomPostClickRef.current + 1;
    randomPostClickRef.current = nextClick;
    try {
      localStorage.setItem("randomPostClick", String(nextClick));
    } catch {
      // ignore localStorage errors
    }
  }, []);

  const goToLinkPage = useCallback(() => {
    router.push("/link");
  }, [router]);

  return (
    <div className="random-post-container">
      <div className="title-section">
        <div className="title-left">
          <h2>🎣 钓鱼</h2>
          <button
            type="button"
            aria-label="刷新钓鱼文章"
            className={`random-post-start ${isOpacity ? "opacity" : ""}`}
            style={{ transform: `rotate(${360 * randomPostTimes}deg)`, transitionDuration: "0.3s" }}
            onClick={() => void fetchRandomPost()}
          >
            <Icon icon="fa6-solid:rotate-right" width={16} height={16} />
          </button>
        </div>

        {!isLinkPage ? (
          <div className="title-right">
            <button type="button" className="random-post-all" onClick={goToLinkPage}>
              全部友链
            </button>
          </div>
        ) : null}
      </div>

      <div id="random-post" className="random-post-content">
        {loading ? (
          <div>{randomPostTimes >= 5 ? `钓鱼中... （Lv.${randomPostTimes} 当前称号：${honor}）` : "钓鱼中..."}</div>
        ) : null}

        {!loading && hungerError ? (
          <div>因为只钓鱼不吃鱼，过分饥饿导致本次钓鱼失败...(点击任意一篇钓鱼获得的文章即可恢复）</div>
        ) : null}

        {!loading && !hungerError ? (
          <div>
            {randomPostTip} 来自友链 <b>{randomPostInfo.author}</b> 的文章：
            <a
              className="random-friends-post"
              target="_blank"
              href={randomPostInfo.link}
              rel="external nofollow"
              onClick={handleRandomClickLink}
            >
              {randomPostInfo.title}
            </a>
          </div>
        ) : null}
      </div>
    </div>
  );
}
