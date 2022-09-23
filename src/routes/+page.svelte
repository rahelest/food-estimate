<script lang="ts">
  import EnterFoods from "$lib/EnterFoods.svelte";
  import ViewResults from "$lib/ViewResults.svelte";
  import { perDay } from "$lib/stores";

  const MIN_VALUE = 400
  const MAX_VALUE = 10000

  $: isOutOfBounds = $perDay < MIN_VALUE || $perDay > MAX_VALUE
</script>

<template>
  Food consumed per day:
  <input bind:value={$perDay} type="number" class="perDayInput" class:inputError={isOutOfBounds} />
  grams

  {#if isOutOfBounds}
    <label class="error">
      Per day value should be between {MIN_VALUE} and {MAX_VALUE}
    </label>
  {/if}

  <EnterFoods />

  {#if !isOutOfBounds}
    <ViewResults />
  {/if}
</template>

<style>
  .perDayInput {
    border-top: 0;
    border-left: 0;
    border-right: 0;
    border-radius: 0;
    margin: 0 8px;
    padding: 0;
    text-align: center;
    width: 70px;
  }

  .error {
    color: red;
    display: block;
    margin: 8px 0;
  }

  .inputError {
    border: 1px solid red;
  }
</style>
