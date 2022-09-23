<script lang="ts">
  import { calculateResults } from './calculateResults'
  import { list, perDay } from './stores'

  $: omitEmpty = $list.filter(({ grams }) => grams)

  $: results = calculateResults(omitEmpty, $perDay)
</script>

<template>
  <section class="summary">
    <div>
      <label>Food:</label>
      {omitEmpty.length} item{omitEmpty.length !== 1 ? 's' : ''}
    </div>
    <div>
      <label>Lasts until:</label>
      {results.date}
    </div>
  </section>

  <div class="results">
    {#if results.date && results.expirations?.length}
      <section class="block">
        <h3 class="title">Food that will expire</h3>
        <ul class="list">
          {#each results.expirations as { name, date, grams }, i (i)}
            <li>
              {name} ({grams}g), {date.replace(/(\d\d)(\d\d)/, '$2.$1')}
            </li>
          {/each}
        </ul>
      </section>
    {/if}

    {#if results.date}
      <section class="block">
        <h3 class="title">Plan</h3>
        <ul class="list">
          {#each Object.entries(results.datePlan) as [day, foodList], i (i)}
            <li>
              <div class="day">{day}:</div>
              <ul class="list">
                {#each foodList as { foodItem: { name, date, grams, usedGrams, nr } }, innerIndex (innerIndex)}
                  <li>
                    {name} #{nr} ({usedGrams} / {grams}g),{' '}
                    {date.replace(/(\d\d)(\d\d)/, '$2.$1')}
                  </li>
                {/each}
              </ul>
            </li>
          {/each}
        </ul>
      </section>
    {/if}
  </div>
</template>

<style>
  .summary {
    background: linear-gradient(135deg, #ddd, #ccc);
    border-radius: 8px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    margin: 32px 0;
    padding: 12px;
  }

  .results {
    display: flex;
    gap: 40px;
    justify-content: space-evenly;
    overflow: hidden;
    margin: 2em auto 0;
  }

  @media screen and (max-width: 500px) {
    .results {
      flex-direction: column;
    }
  }

  .title {
    margin: 0 0 16px;
  }

  .list {
    padding-left: 16px;
    list-style: square;
  }

  .day {
    color: #666;
  }
</style>
