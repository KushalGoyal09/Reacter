import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';
import { getIP } from '@/lib/getIP';

const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(5, '1 h'),
});

export const ratelimitMiddleware = async (): Promise<{ allowed: boolean; error?: string }> => {
    if (process.env.NODE_ENV === 'development') {
        return { allowed: true };
    }
    try {
        const key = await getIP();
        console.log(key);
        if (!key) {
            return { allowed: false, error: 'Unable to identify your IP address' };
        }
        const { success } = await ratelimit.limit(key);
        if (!success) {
            return { allowed: false, error: 'You are rate limited. Please try again after 1 hour' };
        }
        return { allowed: true };
    } catch (error) {
        console.error('Error in ratelimitMiddleware:', error);
        return { allowed: false, error: 'Service temporarily unavailable. Please try again later' };
    }
};
