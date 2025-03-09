import { WebContainer } from '@webcontainer/api';
import { useState, useEffect } from 'react';

export function useWebContainer() {
    const [webcontainer, setWebcontainer] = useState<WebContainer | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function mountWebContainer() {
            try {
                setIsLoading(true);
                const instance = await WebContainer.boot({ workdirName: 'project' });
                setWebcontainer(instance);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Failed to mount WebContainer'));
            } finally {
                setIsLoading(false);
            }
        }
        if (!webcontainer) {
            mountWebContainer();
        }

        return () => {
            if (webcontainer) {
                webcontainer.teardown();
            }
        };
    }, [webcontainer]);

    return {
        webcontainer,
        isLoading,
        error,
    };
}
