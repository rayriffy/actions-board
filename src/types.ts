export interface Config {
    token: string
    projects: Project[]
}

export interface Project {
    name: string
    owner: string
    repo: string
}