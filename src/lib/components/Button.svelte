<script lang="ts">
  import { cn } from "$lib/utils";
  import type { Snippet } from "svelte";
  import type { HTMLButtonAttributes } from "svelte/elements";

  interface Props extends HTMLButtonAttributes {
    children: Snippet<[]>;
    class?: string;
    disabled?: boolean;
    variant?: "primary" | "secondary";
    [key: string]: unknown;
  };

  let {
    children,
    class: className,
    disabled = false,
    variant = "primary",
    ...restProps
  }: Props = $props();
</script>

<button
  {disabled}
  class={cn(
    "flex items-center px-2.5 py-1 font-bold cursor-pointer outline-none",
    {
      "bg-fg text-bg hover:bg-fg-1": variant === "primary",
      "bg-muted text-fg hover:bg-muted-1": variant === "secondary"
    },
    className
  )}
  {...restProps}
>
  {@render children()}
</button>
