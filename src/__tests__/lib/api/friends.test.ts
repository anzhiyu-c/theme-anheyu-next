import { afterEach, describe, expect, it } from "vitest";
import type { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { axiosInstance } from "@/lib/api/client";
import { friendsApi } from "@/lib/api/friends";
import type { LinkMomentsData, MomentsListData, MomentsStatistics } from "@/types/friends";

const EMPTY_STATISTICS: MomentsStatistics = {
  total_links: 0,
  active_links: 0,
  total_moments: 0,
  last_updated_time: "",
};

const createOkResponse = <T>(config: AxiosRequestConfig, data: T): AxiosResponse => ({
  data: { code: 200, data, message: "ok" },
  status: 200,
  statusText: "OK",
  headers: {},
  config: config as InternalAxiosRequestConfig,
});

describe("friendsApi moments query params", () => {
  const originalAdapter = axiosInstance.defaults.adapter;

  afterEach(() => {
    axiosInstance.defaults.adapter = originalAdapter;
  });

  it("getMomentsList 会正确拼接分页与排序参数", async () => {
    axiosInstance.defaults.adapter = async config => {
      expect(config.url).toBe("/api/pro/moments?page=2&page_size=30&sort_type=fetched_at");

      const payload: MomentsListData = {
        list: [],
        total: 0,
        page: 2,
        page_size: 30,
        statistics: EMPTY_STATISTICS,
      };
      return createOkResponse(config, payload);
    };

    const data = await friendsApi.getMomentsList(2, 30, "fetched_at");
    expect(data.page).toBe(2);
    expect(data.page_size).toBe(30);
  });

  it("getLinkMoments 会正确拼接 linkId 与分页参数", async () => {
    axiosInstance.defaults.adapter = async config => {
      expect(config.url).toBe("/api/pro/moments/link/7?page=3&page_size=9");

      const payload: LinkMomentsData = {
        list: [],
        total: 0,
        page: 3,
        page_size: 9,
      };
      return createOkResponse(config, payload);
    };

    const data = await friendsApi.getLinkMoments(7, 3, 9);
    expect(data.page).toBe(3);
    expect(data.page_size).toBe(9);
  });
});
