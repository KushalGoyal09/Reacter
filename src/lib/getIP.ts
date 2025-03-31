import { headers} from "next/headers"

export const getIP = async () => {
    const h = await headers();
    const ip = h.get("x-forwarded-for");
    return ip;
}