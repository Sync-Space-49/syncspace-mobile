interface Organization {
    id: string, 
    owner_id: string,
    name: string,
    description: string
}
interface Board {
    id: string,
    ownerId: string,
    title: string,
    created_at: string,
    modified_at: string,
    is_private: boolean,
    organization_id: string
}

interface Panel {
    id: string,
    title: string,
    position: Number,
    boardId: string
}

interface Stack {
    id: string,
    title: string,
    position: Number,
    panel_d: string,
    stack_id: string
}

interface Card {
    id: string,
    title: string,
    description: string,
    position: Number,
    stack_id: string
}

interface User {
    user_id: string
    email: string
    username: string
    name: string
    created_at: string
    updated_at: string
    picture: string
}

export type { Organization, Board, Panel, Stack, Card, User };