export interface Config {
    token: string
    projects: Project[]
}

export interface Project {
    name: string
    owner: string
    repo: string
}

export interface Timepart {
    months: number
    days: number
    hours: number
    minutes: number
    seconds: number
}
