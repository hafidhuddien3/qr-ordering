import axios, { AxiosRequestConfig, Method } from "axios";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const api = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

type RequestOptions<T = unknown> = {
  method?: Method;
  url: string;
  data?: T;
  params?: Record<string, unknown>;
  config?: AxiosRequestConfig;
};

export async function request<R = unknown, D = unknown>({
  method = "GET",
  url,
  data,
  params,
  config,
}: RequestOptions<D>): Promise<R> {
  const response = await api.request<R>({
    method,
    url,
    data,
    params,
    ...config,
  });

  return response.data;
}
