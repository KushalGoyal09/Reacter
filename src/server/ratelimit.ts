import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';
import { getIP } from '@/lib/getIP';

const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(5, '1 h'),
});

export const ratelimitMiddleware = async () => {
    try {
        const key = await getIP();
        console.log(key);
        if (!key) {
            return false;
        }
        const { success } = await ratelimit.limit(key);
        return success;
    } catch (error) {
        return false;
    }
};
