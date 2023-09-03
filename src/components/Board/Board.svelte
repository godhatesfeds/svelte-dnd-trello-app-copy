<script lang="ts">
	import { List, lists } from "@src/stores/lists"
	import DraggableList from "../DraggableList/DraggableList.svelte"

	let isDragging: boolean = false
	let draggedElement: HTMLElement | null = null
	let hoveredElement: HTMLElement | null = null
	let placeholder: HTMLElement | null = null
	let startX: number, startY: number, elemStartX: number, elemStartY: number

	// Creates a placeholder element with the same dimensions as the element being dragged
	function createPlaceholder(element: HTMLElement): HTMLElement {
		placeholder = document.createElement("div")
		placeholder.className = "placeholder"
		placeholder.style.width = `${element.offsetWidth}px`
		placeholder.style.height = `${element.offsetHeight}px`
		placeholder.style.backgroundColor = "gray"
		placeholder.style.opacity = "0.3"
		placeholder.style.border = "2px dashed #aaa"
		placeholder.style.borderRadius = "12px"
		placeholder.style.margin = "0 6px"
		return placeholder
	}

	function handleMouseDown(event: MouseEvent): void {
		const listWrapper: HTMLElement = (event.target as Element).closest(
			".list-wrapper"
		) as HTMLElement
		const list: HTMLElement = (event.target as Element).closest(".list") as HTMLElement
		const isHeaderClick: boolean = (event.target as Element).className.includes(
			"list-header-target"
		)
		// Check if the mouse down event is on the header of the list
		if (isHeaderClick) {
			draggedElement = listWrapper
			if (draggedElement) {
				const rect: DOMRect = draggedElement.getBoundingClientRect()
				// Set the dimensions of the dragged element to the dimensions of the list
				draggedElement.style.width = `${list.offsetWidth}px`
				draggedElement.style.height = `${list.offsetHeight}px`
				startX = event.clientX
				startY = event.clientY
				elemStartX = rect.left
				elemStartY = rect.top
				// Add event listeners for mouse move and mouse up events
				document.addEventListener("mousemove", handleMouseMove)
				document.addEventListener("mouseup", handleMouseUp)
			}
		}
	}

	function handleMouseMove(event: MouseEvent): void {
		if (draggedElement) {
			event.preventDefault()

			if (!isDragging) isDragging = true

			const boardCanvas: Element | null = document.querySelector(".board-canvas")
			const listsNodeList: NodeListOf<Element> = document.querySelectorAll(".list-wrapper")
			const listsArray: Element[] = Array.from(listsNodeList)

			// Create placeholder if it doesn't exist
			if (!placeholder && boardCanvas) {
				placeholder = createPlaceholder(draggedElement)
				boardCanvas.replaceChild(placeholder, draggedElement)
				document.body.appendChild(draggedElement)
			}

			const deltaX: number = event.clientX - startX
			const deltaY: number = event.clientY - startY
			setDraggedElementStyles(deltaX, deltaY)
			handleHoveredElement(event, listsArray)
		}
	}

	// Set the styles of the dragged element
	function setDraggedElementStyles(deltaX: number, deltaY: number) {
		const x = elemStartX + deltaX
		const y = elemStartY + deltaY

		if (draggedElement)
			Object.assign(draggedElement.style, {
				position: "absolute",
				top: `${y}px`,
				left: `${x}px`,
				transform: "rotate(5deg)",
				zIndex: "1000"
			})
	}

	// Handle the element being hovered over
	function handleHoveredElement(event: MouseEvent, listsArray: Element[]) {
		listsArray.forEach((list) => {
			const listRect: DOMRect = list.getBoundingClientRect()

			const isMouseOverList: boolean =
				event.clientX >= listRect.left &&
				event.clientX <= listRect.right &&
				event.clientY >= listRect.top &&
				event.clientY <= listRect.bottom

			if (draggedElement && list.id !== draggedElement.id && isMouseOverList) {
				hoveredElement = list as HTMLElement
				if (placeholder) placeholder.remove()

				const isMouseCloserToLeft: boolean =
					Math.abs(event.clientX - listRect.left) > Math.abs(event.clientX - listRect.right)
				const nextElement: Element | null = list.nextElementSibling

				if (list.parentNode) {
					if (isMouseCloserToLeft) {
						list.parentNode.insertBefore(placeholder as Node, list)
					} else if (nextElement) {
						list.parentNode.insertBefore(placeholder as Node, nextElement)
					} else {
						list.parentNode.appendChild(placeholder as Node)
					}
				}
			}
		})
	}

	// Handler for mouse up event
	function handleMouseUp(event: MouseEvent): void {
		if (isDragging) {
			isDragging = false
			if (draggedElement && placeholder) {
				replacePlaceholder()
				resetStoreAndStyles()
				updateStoreOrder()
			}
		} else {
			const textarea: HTMLTextAreaElement = (event.target as Element)
				.nextElementSibling as HTMLTextAreaElement
			const targetHeader: HTMLElement = event.target as HTMLElement
			if (textarea) {
				textarea.focus()
				targetHeader.style.display = "none"
			}
		}
		document.removeEventListener("mousemove", handleMouseMove)
		document.removeEventListener("mouseup", handleMouseUp)
	}

	// Replace the placeholder with the dragged element
	function replacePlaceholder(): void {
		if (draggedElement && placeholder && placeholder.parentNode) {
			placeholder.parentNode.replaceChild(draggedElement, placeholder)
			placeholder = null
		}
	}

	// Reset the styles of the dragged element and update the store
	function resetStoreAndStyles(): void {
		if (draggedElement) {
			draggedElement.style.position = ""
			draggedElement.style.top = ""
			draggedElement.style.left = ""
			draggedElement.style.width = ""
			draggedElement.style.height = ""
			draggedElement.style.transform = ""
			draggedElement.style.zIndex = ""
			draggedElement = null
			hoveredElement = null
		}
	}

	// Update the order of the lists in the store
	function updateStoreOrder(): void {
		const listsNodeList: NodeListOf<Element> = document.querySelectorAll(".list-wrapper")
		const newOrder: (List | undefined)[] = Array.from(listsNodeList).map((list) =>
			$lists.find((l: List) => l.id === list.id)
		)
		if (newOrder.length && newOrder[0] !== undefined) lists.set(newOrder as List[])
	}
</script>

<div class="board">
	<div class="board-canvas">
		{#each $lists as list (list.id)}
			<DraggableList {list} {handleMouseDown} />
		{/each}
	</div>
</div>

<style lang="scss">
	.board {
		border: 1px solid rgb(171, 171, 171);
		height: 80vh;
		width: 80vw;
		position: absolute;
		top: 50%;
		transform: translate(0, -50%);
	}
	.board-canvas {
		flex-grow: 1;
		margin-top: 12px;
		position: relative;
		height: 100%;
		display: flex;
	}
</style>
