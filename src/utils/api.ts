import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { getTokenFromCookies } from "@/utils/cookies";
import chalk from "chalk";
import util from "util";

export async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function axiosReq<TRes = any, TReq = any>(
  config: AxiosRequestConfig<TReq>
): Promise<AxiosResponse<TRes>> {
  const token = await getTokenFromCookies();

  console.log(
    chalk.bold.hex("#000000").bgHex("#FFBF00")(
      "➡ Testing axiosReq with token in header"
    ),
    util.inspect(config, { depth: 3, colors: true })
  );

  try {
    const res = await axios({
      baseURL: config.baseURL ?? "http://localhost:3000", // ganti sesuai env
      ...config,
      headers: {
        ...config.headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (process.env.NODE_ENV === "development") {
      console.log(
        chalk.bold.hex("#000000").bgHex("#FFBF00")("✅ axiosReq Response:"),
        util.inspect(res.data, { depth: 2, colors: true })
      );
    }

    return res;
  } catch (err: any) {
    if (process.env.NODE_ENV === "development") {
      console.error(
        chalk.bold.bgRed.white("❌ axiosReq Error:"),
        util.inspect(err.response ?? err, { depth: 1, colors: true })
      );
    } else {
      console.error("axiosReq Error:", err.response ?? err);
    }

    throw err;
  }
}

export async function apiRequest(
  url: string,
  config: RequestInit = {}
): Promise<Response> {
  const res = await fetch(url, {
    credentials: "include", // default utama
    headers: {
      "Content-Type": "application/json",
      ...(config.headers || {}), // header tambahan (misal Authorization)
    },
    ...config, // sisanya bisa override method, body, dsb
  });

  await throwIfResNotOk(res);
  return res;
}
