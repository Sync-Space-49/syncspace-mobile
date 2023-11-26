interface Organization {
    id: string, 
    owner_id: string,
    name: string,
    description: string
}
interface Board {
    id: string,
    owner_id: string,
    title: string,
    created_at: string,
    modified_at: string,
    is_private: boolean,
    organization_id: string
    panels: []
}

interface Panel {
    id: string,
    title: string,
    position: number,
    boardId: string
    stacks: []
}

interface Stack {
    id: string,
    title: string,
    position: Number,
    panel_id: string,
    cards: []
    stack_id?: string
}

interface Card {
    assignments?: [],
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