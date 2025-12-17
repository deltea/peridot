<script lang="ts">
  import { page } from "$app/state";
  import { setEntry } from "$lib/storage.js";
  import type { Board, ImagePiece, LinkPiece, Piece, NotePiece } from "$lib/types.js";
  import { onMount, tick } from "svelte";
  import hotkeys from "hotkeys-js";
  import Masonry from "svelte-masonry";
  import { isValidURL } from "$lib/utils.js";

  import PieceComponent from "$components/Piece.svelte";
  import Nav from "$components/Nav.svelte";
  import Button from "$components/Button.svelte";
  import PlaceholderPieces from "$components/PlaceholderPieces.svelte";

  const gridSizes = ["12em", "15em", "20em", "25em"];

  let { data } = $props();
  let board: Board = $state(data.board);
  let isAddingPiece = $state(false);
  let newPieceContent = $state("");
  let newPieceInput: HTMLTextAreaElement | null = $state(null);
  let refreshLayout: () => void = $state(() => {});
  let selected: Piece[] = $state([]);
  let isMultiSelect = false;

  $effect(() => {
    if (board.pieces) {
      tick().then(() => refreshLayout());
    }
  });

  function getFocusedOnInput(): boolean {
    const activeElement = document.activeElement;
    return !!activeElement && (
      activeElement.tagName === "INPUT" ||
      activeElement.tagName === "TEXTAREA" ||
      (activeElement as HTMLElement).isContentEditable
    );
  }

  function addPiece() {
    if (newPieceContent.length === 0) return;

    if (isValidURL(newPieceContent)) {
      board.pieces = [
        ...board.pieces,
        { type: "link", url: newPieceContent } as LinkPiece,
      ];
    } else {
      board.pieces = [
        ...board.pieces,
        { type: "note", content: newPieceContent } as NotePiece,
      ];
    }
    setEntry(data.root, `boards/${page.params.slug}.peridot`, board);
    newPieceContent = "";
    isAddingPiece = false;
  }

  function handlePaste(e: ClipboardEvent) {
    if (getFocusedOnInput()) return;

    const pasted = e.clipboardData?.items;
    if (!pasted) return;
    for (const item of pasted) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (!file) continue;
        const reader = new FileReader();
        reader.onload = async (e) => {
          const imgUrl = e.target?.result as string;
          board.pieces = [
            ...board.pieces,
            { type: "image", url: imgUrl } as ImagePiece,
          ];
          await setEntry(data.root, `boards/${page.params.slug}.peridot`, board);
        };
        reader.readAsDataURL(file);
      } else if (item.type === "text/plain") {
        const text = e.clipboardData?.getData("text/plain");
        if (!text) continue;
        if (isValidURL(text)) {
          board.pieces = [
            ...board.pieces,
            { type: "link", url: text } as LinkPiece,
          ];
        } else {
          board.pieces = [
            ...board.pieces,
            { type: "note", content: text } as NotePiece,
          ];
        }
      }
    }
  }

  function selectPiece(piece: Piece) {
    if (isMultiSelect) {
      if (selected.includes(piece)) {
        selected = selected.filter((p) => p !== piece);
      } else {
        selected = [...selected, piece];
      }
    } else {
      if (selected.includes(piece) && selected.length === 1) {
        selected = [];
        return;
      } else {
        selected = [piece];
      }
    }
  }

  function clickOutside(e: MouseEvent) {
    const target = e.target as HTMLElement;
    if (!target.closest("#piece")) {
      selected = [];
    }
  }

  function focusOnAddPiece() {
    isAddingPiece = !isAddingPiece;
    tick().then(() => newPieceInput?.focus());
  }

  onMount(() => {
    document.addEventListener("paste", handlePaste);
    document.addEventListener("click", clickOutside);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Shift") isMultiSelect = true;
    });
    document.addEventListener("keyup", (e) => {
      if (e.key === "Shift") isMultiSelect = false;
    });

    // hotkeys
    hotkeys.filter = () => true;
    hotkeys("ctrl+n", (e) => {
      e.preventDefault();
      focusOnAddPiece();
    });
    hotkeys("cmd+enter", (e) => {
      if (isAddingPiece) {
        e.preventDefault();
        addPiece();
      }
    });
    hotkeys("esc", (e) => {
      e.preventDefault();
      isAddingPiece = false;
      selected = [];
    });

    // selection hotkeys
    hotkeys("backspace", (e) => {
      if (getFocusedOnInput()) return;
      if (selected.length > 0) {
        e.preventDefault();
        board.pieces = board.pieces.filter((p) => !selected.includes(p));
        setEntry(data.root, `boards/${page.params.slug}.peridot`, board);
        selected = [];
      }
    });

    return () => {
      document.removeEventListener("paste", handlePaste);
      document.removeEventListener("click", clickOutside);
      document.removeEventListener("keydown", () => {});
      document.removeEventListener("keyup", () => {});

      hotkeys.unbind("ctrl+n");
      hotkeys.unbind("cmd+enter");
      hotkeys.unbind("esc");
      hotkeys.unbind("shift");
      hotkeys.unbind("backspace");
    };
  });
</script>

<Nav path="boards/{board.name}">
  <div class="flex gap-3">
    <Button onclick={focusOnAddPiece}>+ add piece</Button>
    <Button variant="secondary" class="gap-2">
      <iconify-icon icon="mingcute:settings-3-fill" class="text-base"></iconify-icon>
      <span>edit board</span>
    </Button>
  </div>
</Nav>

<div class="w-4xl mx-8 h-fit space-y-2" style="column-fill: balance;">
  {#if board.pieces && board.pieces.length > 0 || isAddingPiece}
    <Masonry
      items={board.pieces}
      stretchFirst={isAddingPiece}
      gridGap="0.5rem"
      colWidth="minmax(min({gridSizes[2]}, 100%), 1fr)"
      bind:refreshLayout
    >
      {#if isAddingPiece}
        <div class="bg-bg-1 flex flex-col w-full">
          <textarea
            bind:value={newPieceContent}
            bind:this={newPieceInput}
            placeholder="start typing here..."
            class="w-full p-4 outline-none resize-none"
          ></textarea>

          <div class="flex justify-between px-4 pb-4 pt-2">
            <div></div>
            <button
              onclick={addPiece}
              class="cursor-pointer size-6 bg-fg text-bg font-black text-base"
            >+</button>
          </div>
        </div>
      {/if}

      {#if board.pieces.length > 0}
        {#each board.pieces.slice().reverse() as piece, i}
          <PieceComponent
            {piece}
            selected={selected.includes(piece)}
            {selectPiece}
            {refreshLayout}
          />
        {/each}
      {/if}
    </Masonry>
  {:else}
    <PlaceholderPieces />
  {/if}
</div>
