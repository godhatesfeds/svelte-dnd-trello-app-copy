import { writable } from "svelte/store"
import type { Writable } from "svelte/store"

export type List = {
	id: string
	name: string
}

export const lists: Writable<List[]> = writable([
	{ id: "list-1", name: "List 1" },
	{ id: "list-2", name: "List 2" },
	{ id: "list-3", name: "List 3" }
])


