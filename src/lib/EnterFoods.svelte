<script lang="ts">
  import { getEmptyRow } from './editList'
  import { list } from '$lib/stores'

  $: week = new Date(Date.now() + 1000 * 3600 * 24 * 7)

  $: dateSuggestions = () => {
    const dayMillis = 1000 * 3600 * 24
    const pad = (num: number) => num.toString().padStart(2, '0')
    const range = (n: number) => new Array(n).fill(1).map((e, i) => i + 1)
    return range(7).map((day) => {
      const date = new Date(Date.now() + dayMillis * day)
      return pad(date.getUTCDate()) + '.' + pad(date.getUTCMonth() + 1)
    })
  }

  function addRow() {
    list.update(oldList => [...oldList, getEmptyRow()]);
  }


  function addRowIfNeeded() {
    if ($list[$list.length -1].grams) {
      addRow()
    }
  }

  function removeRow(rowId: number) {
    list.update(oldList => oldList.filter(({ id }) => id !== rowId));
  }

  function clear() {
    list.set([getEmptyRow()])
  }
</script>

<div>
  <div class="foodInput">
    {#each $list as row (row.id)}
      <div class="foodRow">
        <div class="foodColumnName">
          <label>
            <span>Name</span>
            <input type="text" bind:value={row.name} />
          </label>
        </div>
        <div class="foodColumnAmount center">
          <label>
            <span>×</span>
            <input
              class="right"
              type="number"
              min="1"
              bind:value={row.amount}
              on:click={(e) => e.target.select()}
            />
          </label>
        </div>
        <div class="foodColumnDate center">
          <label>
            <span title="Enter DDMM and see how dive dot appears automatically!">Date (!)</span>
            <input
              class="center"
              type="number"
              step="0.01"
              lang="en"
              list="dateList"
              bind:value={row.date}
              placeholder={week.getDate().toString().padStart(2, '0') +
                '.' +
                (week.getMonth() + 1).toString().padStart(2, '0')}
            />
          </label>

          <datalist id="dateList">
            {#each dateSuggestions() as s}
              <option value={s}>{s}</option>
            {/each}
          </datalist>
        </div>
        <div class="foodColumnGrams right">
          <label>
            <span>Grams</span>
            <input
              class="right"
              type="number"
              min="0"
              list="gramList"
              bind:value={row.grams}
              on:change={addRowIfNeeded}
            />
          </label>
          <datalist id="gramList">
            {#each [100, 200, 250, 500, 1000] as g}
              <option value={g}>{g}</option>
            {/each}
          </datalist>
        </div>
        <div class="foodColumnRemove">
          <button class="removeButton" on:click={() => removeRow(row.id)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="removeIcon"
              viewBox="0 0 16 16"
            >
              <path
                d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
              />
            </svg>
          </button>
        </div>
      </div>
    {/each}
  </div>

  <p class="center">
    <button on:click={addRow} class="primaryButton"> Add row </button>
    <button on:click={clear} class="secondaryButton"> Clear list </button>
  </p>
</div>

<style>
  .foodInput {
    margin: 24px auto;
    overflow: hidden;
  }

  .foodRow {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    padding: 16px 0;
    gap: 4px 16px;
  }

  .foodColumnName {
    flex: 6;
  }

  @media screen and (max-width: 500px) {
    .foodColumnName {
      min-width: 100%;
    }
  }

  .foodColumnAmount {
    flex: 1;
  }

  .foodColumnAmount input {
    min-width: 45px;
  }

  .foodColumnDate {
    flex: 2;
  }

  .foodColumnDate input {
    min-width: 60px;
  }

  .foodColumnGrams {
    flex: 2;
  }

  .foodColumnGrams input {
    min-width: 60px;
  }

  .foodColumnRemove {
    flex: 0 0 auto;
  }

  .foodInput input {
    margin: 0;
    width: 100%;
  }

  .removeButton {
    display: block;
    padding: 0;
  }

  .removeIcon {
    width: auto;
    height: 27px;
  }


  .primaryButton {
    border: 1px solid #000;
    border-radius: 8px;
    letter-spacing: 1px;
  }

  .secondaryButton {
    composes: primaryButton;
    background-color: white;
  }

  .center {
    text-align: center;
  }

  .right {
    text-align: right;
  }
</style>
