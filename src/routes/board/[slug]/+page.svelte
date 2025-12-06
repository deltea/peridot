<script lang="ts">
  import { page } from "$app/state";
  import { setEntry } from "$lib/storage.js";
  import type { Board, ImagePiece, LinkPiece, NotePiece } from "$lib/types.js";
  import { onMount, tick } from "svelte";
  import hotkeys from "hotkeys-js";
  import Masonry from "svelte-masonry";

  let { data } = $props();
  let board: Board = $state(data.board);
  let isAddingPiece = $state(false);
  let newPieceContent = $state("");
  let newPieceInput: HTMLTextAreaElement | null = $state(null);
  let refreshLayout: () => void = $state(() => {});

  $effect(() => {
    if (board.pieces) {
      tick().then(() => refreshLayout());
    }
  });

  function addPiece() {
    if (newPieceContent.length === 0) return;

    try {
      new URL(newPieceContent);
      board.pieces = [
        ...board.pieces,
        {
          type: "link",
          url: newPieceContent,
        } as LinkPiece,
      ];
    } catch {
      board.pieces = [
        ...board.pieces,
        {
          type: "note",
          content: newPieceContent,
        } as NotePiece,
      ];
    }
    setEntry(data.root, `boards/${page.params.slug}.peridot`, board);
    newPieceContent = "";
    isAddingPiece = false;
  }

  function handlePaste(e: ClipboardEvent) {
    // don't paste if focused on an input
    const activeElement = document.activeElement;
    if (activeElement && (activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA" || (activeElement as HTMLElement).isContentEditable)) {
      return;
    }

    const pasted = e.clipboardData?.items;
    if (!pasted) return;
    for (const item of pasted) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = async (event) => {
            const imgUrl = event.target?.result as string;
            board.pieces = [
              ...board.pieces,
              {
                type: "image",
                url: imgUrl,
                caption: "",
              } as ImagePiece,
            ];
            await setEntry(data.root, `boards/${page.params.slug}.peridot`, board);
          };
          reader.readAsDataURL(file);
        }
      } else if (item.type === "text/plain") {
        const text = e.clipboardData?.getData("text/plain");
        if (text) {
          // check if text is a valid url
          try {
            new URL(text);
            board.pieces = [
              ...board.pieces,
              {
                type: "link",
                url: text,
              } as LinkPiece,
            ];
            setEntry(data.root, `boards/${page.params.slug}.peridot`, board);
          } catch {
            // not a valid url, add as note
            board.pieces = [
              ...board.pieces,
              {
                type: "note",
                content: text,
              } as NotePiece,
            ];
            setEntry(data.root, `boards/${page.params.slug}.peridot`, board);
          }
        }
      }
    }
  }

  onMount(() => {
    document.addEventListener("paste", handlePaste);

    // keyboard hotkeys
    hotkeys.filter = () => true;
    hotkeys("ctrl+n", (e) => {
      e.preventDefault();
      isAddingPiece = !isAddingPiece;
      tick().then(() => newPieceInput?.focus());
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
    });

    return () => {
      document.removeEventListener("paste", handlePaste);
      hotkeys.unbind("ctrl+n");
      hotkeys.unbind("cmd+enter");
      hotkeys.unbind("esc");
    };
  });
</script>

<div class="w-4xl mx-8 h-fit space-y-2">
  {#if board.pieces && board.pieces.length > 0 || isAddingPiece}
    <Masonry items={board.pieces} stretchFirst={isAddingPiece} gridGap={"0.5rem"} bind:refreshLayout>
      {#if isAddingPiece}
        <div class="bg-bg-1 flex flex-col w-full">
          <textarea
            bind:value={newPieceContent}
            bind:this={newPieceInput}
            placeholder="start typing here..."
            class="w-full p-4 outline-none resize-none"
          ></textarea>

          <div class="flex justify-between px-2 pb-2">
            <button
              onclick={addPiece}
              class="cursor-pointer size-6 bg-fg text-bg font-black text-base"
            >+</button>
          </div>
        </div>
      {/if}
      {#if board.pieces.length > 0}
        {#each board.pieces.slice().reverse() as piece, i}
          {#if piece.type === "note"}
            <p class="bg-bg-1 flex flex-col w-full p-4 wrap-anywhere whitespace-pre-wrap">
              {piece.content}
            </p>
          {:else if piece.type === "link"}
            <a href={piece.url} target="_blank" class="underline bg-bg-1 flex flex-col w-full p-4 wrap-anywhere whitespace-pre-wrap">
              {piece.url}
            </a>
          {:else if piece.type === "image"}
            <img src={piece.url} alt={piece.caption} onload={refreshLayout} class="w-full object-contain" />
          {/if}
        {/each}
      {/if}
    </Masonry>
  {:else}
    <div class="flex gap-8 h-full relative">
      <div class="grow flex flex-col gap-8 items-center h-full">
        <div class="w-full h-40 bg-bg-1"></div>
        <div class="w-full h-20 bg-bg-1"></div>
        <div class="w-full h-80 bg-bg-1"></div>
      </div>
      <div class="grow flex flex-col gap-8 items-center">
        <div class="w-full h-80 bg-bg-1"></div>
        <div class="w-full h-40 bg-bg-1"></div>
        <div class="w-full h-20 bg-bg-1"></div>
      </div>

      <div class="absolute top-24 text-center w-full">
        press <span class="bg-muted py-1 px-1.5">ctrl+n</span> to add a new piece
      </div>
      <div class="h-2/3 absolute bottom-0 left-0 bg-linear-to-t from-bg to-transparent w-full"></div>
    </div>
  {/if}
</div>
