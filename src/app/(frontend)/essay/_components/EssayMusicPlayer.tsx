"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import { Icon } from "@iconify/react";
import { useLyrics } from "@/hooks/use-lyrics";
import type { Song } from "@/types/music";

interface EssayMusicPlayerProps {
  musicId: string;
  onLoaded?: () => void;
}

interface SongV1Response {
  status: number;
  success: boolean;
  message?: string;
  data: {
    id: string;
    name: string;
    ar_name: string;
    al_name: string;
    url: string;
    pic: string;
    lyric: string;
    tlyric: string;
    level: string;
    size: string;
  };
}

interface SongV1Data {
  id: string;
  name: string;
  ar_name: string;
  al_name: string;
  url: string;
  pic: string;
  lyric: string;
  level: string;
  size: string;
  error?: "server_error" | "not_found";
}

const ensureHttps = (url: string): string => {
  if (!url) return url;
  return url.startsWith("http://") ? url.replace("http://", "https://") : url;
};

async function fetchSongV1(songId: string, level: "exhigh" | "standard"): Promise<SongV1Data | null> {
  try {
    const formData = new URLSearchParams();
    formData.append("url", songId);
    formData.append("level", level);
    formData.append("type", "json");

    const response = await fetch("https://metings.qjqq.cn/Song_V1", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    });

    if (!response.ok) {
      if (response.status >= 500) {
        return {
          id: "",
          name: "",
          ar_name: "",
          al_name: "",
          url: "",
          pic: "",
          lyric: "",
          level: "",
          size: "",
          error: "server_error",
        };
      }
      return {
        id: "",
        name: "",
        ar_name: "",
        al_name: "",
        url: "",
        pic: "",
        lyric: "",
        level: "",
        size: "",
        error: "not_found",
      };
    }

    const data: SongV1Response = await response.json();
    if (data.status !== 200 || !data.success) {
      return {
        id: "",
        name: "",
        ar_name: "",
        al_name: "",
        url: "",
        pic: "",
        lyric: "",
        level: "",
        size: "",
        error: "not_found",
      };
    }

    return {
      id: data.data.id,
      name: data.data.name,
      ar_name: data.data.ar_name,
      al_name: data.data.al_name,
      url: ensureHttps(data.data.url || ""),
      pic: ensureHttps(data.data.pic || ""),
      lyric: data.data.lyric || "",
      level: data.data.level,
      size: data.data.size,
    };
  } catch {
    return {
      id: "",
      name: "",
      ar_name: "",
      al_name: "",
      url: "",
      pic: "",
      lyric: "",
      level: "",
      size: "",
      error: "server_error",
    };
  }
}

async function fetchSingleSong(songId: string): Promise<Song> {
  let result = await fetchSongV1(songId, "exhigh");

  if (result?.error === "server_error") {
    throw new Error("音乐服务暂时不可用");
  }

  if (!result || !result.url) {
    result = await fetchSongV1(songId, "standard");
    if (result?.error === "server_error") {
      throw new Error("音乐服务暂时不可用");
    }
  }

  if (!result || !result.url) {
    throw new Error("该歌曲暂无可用音源");
  }

  return {
    id: result.id || songId,
    neteaseId: result.id || songId,
    name: result.name || "未知歌曲",
    artist: result.ar_name || "未知艺术家",
    url: result.url,
    pic: ensureHttps(result.pic || ""),
    lrc: result.lyric,
  };
}

export function EssayMusicPlayer({ musicId, onLoaded }: EssayMusicPlayerProps) {
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const currentTimeRef = useRef(0);

  const [song, setSong] = useState<Song | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadedPercentage, setLoadedPercentage] = useState(0);
  const [audioState, setAudioState] = useState({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 0.7,
    isMuted: false,
  });

  const { lyrics, lyricsState, setLyricRef, setLyrics, clearLyrics, onTimeUpdate, cleanup } = useLyrics(currentTimeRef);

  useEffect(() => {
    currentTimeRef.current = audioState.currentTime;
    onTimeUpdate();
  }, [audioState.currentTime, onTimeUpdate]);

  useEffect(() => {
    if (song?.lrc) {
      setLyrics(song.lrc);
      return;
    }
    clearLyrics();
  }, [song?.lrc, setLyrics, clearLyrics]);

  useEffect(() => {
    let isCancelled = false;

    const loadSong = async () => {
      setIsLoading(true);
      setError(null);
      setSong(null);
      setLoadedPercentage(0);
      setAudioState(prev => ({
        ...prev,
        isPlaying: false,
        currentTime: 0,
        duration: 0,
      }));

      try {
        const songData = await fetchSingleSong(musicId);
        if (!isCancelled) {
          setSong(songData);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err instanceof Error ? err.message : "获取歌曲数据失败");
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
          onLoaded?.();
        }
      }
    };

    void loadSong();

    return () => {
      isCancelled = true;
    };
  }, [musicId, onLoaded]);

  useEffect(() => {
    const audio = audioElementRef.current;
    if (!audio || !song?.url) {
      return;
    }

    const updateDuration = () => {
      const duration = audio.duration;
      if (Number.isFinite(duration) && duration > 0) {
        setAudioState(prev => ({
          ...prev,
          duration,
        }));
      }
    };

    audio.src = song.url;
    audio.load();
    audio.addEventListener("durationchange", updateDuration);
    audio.addEventListener("canplay", updateDuration);

    return () => {
      audio.pause();
      audio.removeEventListener("durationchange", updateDuration);
      audio.removeEventListener("canplay", updateDuration);
      audio.src = "";
    };
  }, [song?.url]);

  useEffect(() => {
    const handleGlobalMusicPlay = () => {
      const audio = audioElementRef.current;
      if (audio && !audio.paused) {
        audio.pause();
      }
    };

    window.addEventListener("music-player-toggle-play", handleGlobalMusicPlay);
    window.addEventListener("music-player-play", handleGlobalMusicPlay);
    window.addEventListener("ai-podcast-play", handleGlobalMusicPlay);

    return () => {
      window.removeEventListener("music-player-toggle-play", handleGlobalMusicPlay);
      window.removeEventListener("music-player-play", handleGlobalMusicPlay);
      window.removeEventListener("ai-podcast-play", handleGlobalMusicPlay);
    };
  }, []);

  useEffect(() => {
    return () => {
      clearLyrics();
      cleanup();
    };
  }, [clearLyrics, cleanup]);

  const playedPercentage = useMemo(() => {
    if (!audioState.duration || audioState.duration <= 0) {
      return 0;
    }
    return (audioState.currentTime / audioState.duration) * 100;
  }, [audioState.currentTime, audioState.duration]);

  const formatTime = useCallback((seconds: number) => {
    if (!Number.isFinite(seconds) || seconds <= 0) {
      return "0:00";
    }
    const minutes = Math.floor(seconds / 60);
    const remain = Math.floor(seconds % 60);
    return `${minutes}:${remain.toString().padStart(2, "0")}`;
  }, []);

  const togglePlay = useCallback(async () => {
    const audio = audioElementRef.current;
    if (!audio || !song) {
      return;
    }

    if (!audio.paused) {
      audio.pause();
      return;
    }

    audio.volume = audioState.volume;
    window.dispatchEvent(new CustomEvent("essay-music-play"));

    try {
      await audio.play();
    } catch {
      setError("播放失败，请稍后重试");
    }
  }, [audioState.volume, song]);

  const handleProgressClick = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      const audio = audioElementRef.current;
      if (!audio || !audioState.duration) {
        return;
      }

      const target = event.currentTarget;
      const rect = target.getBoundingClientRect();
      const percentage = (event.clientX - rect.left) / rect.width;
      const targetTime = percentage * audioState.duration;

      audio.currentTime = targetTime;
      setAudioState(prev => ({
        ...prev,
        currentTime: targetTime,
      }));
    },
    [audioState.duration]
  );

  const handleLoadedMetadata = useCallback(() => {
    const audio = audioElementRef.current;
    if (!audio) return;
    const duration = audio.duration;
    if (Number.isFinite(duration) && duration > 0) {
      setAudioState(prev => ({
        ...prev,
        duration,
      }));
    }
  }, []);

  const handleTimeUpdate = useCallback(() => {
    const audio = audioElementRef.current;
    if (!audio) {
      return;
    }

    const nextDuration = Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : audioState.duration;
    const nextCurrentTime = audio.currentTime;

    setAudioState(prev => ({
      ...prev,
      currentTime: nextCurrentTime,
      duration: nextDuration,
    }));

    if (audio.buffered.length > 0 && nextDuration > 0) {
      const bufferedEnd = audio.buffered.end(audio.buffered.length - 1);
      setLoadedPercentage((bufferedEnd / nextDuration) * 100);
    }
  }, [audioState.duration]);

  const handlePlay = useCallback(() => {
    setAudioState(prev => ({
      ...prev,
      isPlaying: true,
    }));
  }, []);

  const handlePause = useCallback(() => {
    setAudioState(prev => ({
      ...prev,
      isPlaying: false,
    }));
  }, []);

  const handleEnded = useCallback(() => {
    const audio = audioElementRef.current;
    if (audio) {
      audio.currentTime = 0;
    }
    setAudioState(prev => ({
      ...prev,
      isPlaying: false,
      currentTime: 0,
    }));
  }, []);

  const handleError = useCallback(() => {
    setError("音频播放出错");
    setAudioState(prev => ({
      ...prev,
      isPlaying: false,
    }));
  }, []);

  if (isLoading) {
    return (
      <div className="essay-music-player">
        <div className="music-loading">
          <Icon icon="fa6-solid:spinner" width={18} height={18} className="is-loading" />
          <span>加载音乐中...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="essay-music-player">
        <div className="music-error">
          <Icon icon="fa6-solid:circle-exclamation" width={18} height={18} />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!song) {
    return null;
  }

  return (
    <div className="essay-music-player">
      <div className="music-player-container">
        <div className="music-main">
          <div className="music-cover" onClick={() => void togglePlay()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={song.pic} alt={song.name} loading="lazy" />
            <div className={`play-overlay ${audioState.isPlaying ? "playing" : ""}`}>
              <Icon icon={audioState.isPlaying ? "fa6-solid:pause" : "fa6-solid:play"} width={20} height={20} />
            </div>
          </div>

          <div className="music-right">
            <div className="music-info">
              <div className="music-title">
                {song.name} - {song.artist}
              </div>
            </div>

            {lyrics.length > 0 ? (
              <div className="music-lyrics">
                <div className="lyrics-container">
                  <div
                    className="lyrics-wrapper"
                    style={{
                      transform: `translateY(${lyricsState.translateY}px)`,
                      transition: "transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                    }}
                  >
                    {lyrics.map((lyric, index) => (
                      <div
                        key={`${lyric.time}-${index}`}
                        ref={el => setLyricRef(el, index)}
                        className={`lyric-line ${index === lyricsState.currentIndex ? "active" : ""} ${
                          lyricsState.shouldScroll[index] ? "should-scroll" : ""
                        }`}
                      >
                        <span className="lyric-text">{lyric.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}

            <div className="music-progress">
              <div className="progress-time">{formatTime(audioState.currentTime)}</div>
              <div className="progress-bar-wrapper" onClick={handleProgressClick}>
                <div className="progress-bar">
                  <div className="progress-bar-loaded" style={{ width: `${loadedPercentage}%` }} />
                  <div className="progress-bar-played" style={{ width: `${playedPercentage}%` }} />
                </div>
              </div>
              <div className="progress-time">{formatTime(audioState.duration)}</div>
            </div>
          </div>
        </div>

        <audio
          ref={audioElementRef}
          preload="metadata"
          crossOrigin="anonymous"
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={handleTimeUpdate}
          onPlay={handlePlay}
          onPause={handlePause}
          onEnded={handleEnded}
          onError={handleError}
        />
      </div>
    </div>
  );
}
