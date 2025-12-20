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
  let zoomedInPiece: Piece | null = $state(null);

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
        setEntry(data.root, `boards/${page.params.slug}.peridot`, board);
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
    refreshLayout();

    document.addEventListener("paste", handlePaste);
    document.addEventListener("mousedown", clickOutside);

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
      zoomedInPiece = null;
    });
    hotkeys("space", (e) => {
      if (getFocusedOnInput()) return;
      e.preventDefault();
      if (zoomedInPiece) {
        zoomedInPiece = null;
        return;
      }
      if (selected.length === 1 && selected[0].type === "image") {
        zoomedInPiece = selected[0];
      }
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

<Nav title={board.name}>
  <div class="flex gap-3">
    <Button onclick={focusOnAddPiece}>+ add piece</Button>
    <Button variant="secondary" class="gap-2">
      <iconify-icon icon="mingcute:settings-3-fill" class="text-base"></iconify-icon>
      <span>edit board</span>
    </Button>
  </div>
</Nav>

<div class="w-4xl mx-8 h-fit">
  {#if board.pieces && board.pieces.length > 0 || isAddingPiece}
    <Masonry
      items={board.pieces}
      stretchFirst={isAddingPiece}
      gridGap="0.5rem"
      colWidth="minmax(min({gridSizes[2]}, 100%), 1fr)"
      bind:refreshLayout
    >
      {#if isAddingPiece}
        <div class="bg-bg-1 p-4 w-full h-26 relative">
          <textarea
            bind:value={newPieceContent}
            bind:this={newPieceInput}
            placeholder="start typing here..."
            class="w-full outline-none resize-none h-full"
          ></textarea>

          <button
            onclick={addPiece}
            class="absolute bottom-2 right-2 cursor-pointer size-8 bg-fg text-bg font-black text-xl"
          >+</button>
        </div>
      {/if}

      {#if board.pieces.length > 0}
        {#each board.pieces.slice().reverse() as piece, i}
          <PieceComponent
            {piece}
            selected={selected.includes(piece)}
            isZoomed={zoomedInPiece === piece}
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

<!-- <div class="fixed left-4 top-1/2 -translate-y-1/2 flex flex-col gap-4">
  <Button variant="primary" class="gap-2 size-12 justify-center">
    <iconify-icon icon="mdi:plus" class="text-3xl"></iconify-icon>
  </Button>
  <Button variant="secondary" class="gap-2 size-12 justify-center">
    <iconify-icon icon="mingcute:settings-3-fill" class="text-2xl"></iconify-icon>
  </Button>
</div> -->
