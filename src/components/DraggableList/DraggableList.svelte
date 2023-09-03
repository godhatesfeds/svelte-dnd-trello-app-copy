<script lang="ts">
	import type { List } from "../../stores/lists"

	export let list: List
	export let handleMouseDown: (event: MouseEvent, list: List) => void

	let textarea: HTMLElement
	let listElement: HTMLElement

	const MAX_TEXTAREA_HEIGHT: number = 256
	const DEFAULT_TEXTAREA_HEIGHT: number = 28

	function handleTextArea(): void {
		setTimeout(function () {
			textarea.style.cssText = `height:${DEFAULT_TEXTAREA_HEIGHT}x`
			if (textarea.scrollHeight < MAX_TEXTAREA_HEIGHT) {
				textarea.style.cssText = "height:" + textarea.scrollHeight + "px"
			} else {
				textarea.style.cssText = `height:${MAX_TEXTAREA_HEIGHT}x`
				textarea.style.overflow = "auto"
			}
		}, 0)
	}

	function handleBlur(event: FocusEvent) {
		const targetHeader: HTMLElement = (event.target as Element)
			.previousElementSibling as HTMLElement
		if (targetHeader) targetHeader.style.display = "block"
	}
</script>

<div
	id={list.id}
	on:dragstart|preventDefault
	on:mousedown={(e) => handleMouseDown(e, list)}
	class="list-wrapper"
>
	<div bind:this={listElement} class="list">
		<div class="list-header">
			<div class="list-header-target" />
			<textarea
				on:keydown={handleTextArea}
				on:blur={handleBlur}
				bind:this={textarea}
				class="list-header-name"
				value={list.name}
			/>
		</div>
	</div>
</div>

<style lang="scss">
	.list-wrapper {
		height: 100%;
		display: inline-block;
		width: 272px;
		scroll-margin: 8px;
		vertical-align: top;
		white-space: nowrap;
		margin: 0 6px;
	}

	.list {
		background-color: #f1f2f4;
		border-radius: 12px;
		box-shadow: var(--ds-shadow-raised, 0 1px 1px #091e4240, 0 0 1px #091e424f);
		box-sizing: border-box;
		display: flex;
		height: auto;
		flex-direction: column;
		position: relative;
		white-space: normal;
		transition: 0.1s ease transform;
	}

	.list-header {
		flex: 0 0 auto;
		min-height: 20px;
		padding: 14px 8px;
		position: relative;
	}
	.list-header-target {
		bottom: 0;
		cursor: pointer;
		left: 0;
		position: absolute;
		right: 0;
		top: 0;
	}
	.list-header-name {
		background: #0000;
		border-radius: 3px;
		box-shadow: none;
		color: #172b4d;
		font-weight: 600;
		overflow: hidden;
		margin: -4px 0;
		max-height: 256px;
		border: none;
		min-height: 20px;
		max-height: 256px;
		padding: 4px 8px 4px 12px;
		resize: none;
		width: 224px;
		height: 28px;
		overflow-wrap: break-word;
		display: block;
		line-height: 20px;
		outline: none;
		user-select: none;
		transition-duration: 85ms;
		transition-property: background-color, border-color, box-shadow;
		transition-timing-function: ease;
		font-size: 14px;
		&:focus {
			background-color: #ffffff;
			box-shadow: inset 0 0 0 2px #388bff;
		}
	}
</style>
