import axios, { AxiosRequestConfig, Method } from "axios";

const apiUrlDev = process.env.EXPO_PUBLIC_API_URL;
const apiUrlProd = process.env.EXPO_PUBLIC_API_URL_PROD;

const isProd = true // change this to false if you want to test with development API, or set the environment variable EXPO_PUBLIC_API_ISPROD to "true" or "false" to control it without changing the code.
const apiUrl = isProd ? apiUrlProd : apiUrlDev;

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
