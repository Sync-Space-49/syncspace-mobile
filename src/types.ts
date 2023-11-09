interface Organization {
    id: string, 
    ownerId: string,
    name: string,
    description: string
}
interface Board {
    id: string,
    ownerId: string,
    title: string,
    createdAt: string,
    modifiedAt: string,
    isPrivate: boolean,
    organizationId: string
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
    panelId: string,
    stackId: string
}

export type { Organization, Board, Panel, Stack };