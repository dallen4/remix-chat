
export interface Env {
    SESSIONS_DO: DurableObjectNamespace;
}

export type User = {
    id: string;
    username: string;
    avatar: string;
};
