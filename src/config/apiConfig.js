const DEFAULT_LOCAL_API_URL = "http://localhost:4000/api";
const DEFAULT_PROD_API_URL = "https://mabesteticaback.onrender.com/api";

const normalizeBaseUrl = (url) => url.replace(/\/+$/, "");

const envApiUrl = import.meta.env.VITE_API_URL?.trim();
const isLocalHost =
	typeof window !== "undefined" &&
	(window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

const fallbackApiUrl = isLocalHost ? DEFAULT_LOCAL_API_URL : DEFAULT_PROD_API_URL;
const API_BASE_URL = normalizeBaseUrl(envApiUrl || fallbackApiUrl);

export { API_BASE_URL };
