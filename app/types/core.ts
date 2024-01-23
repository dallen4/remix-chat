
export interface Env {
    sessions: DurableObjectNamespace;
    WORKER_URI: string;
}

export type User = {
    id: string;
    username: string;
    avatar: string;
};
