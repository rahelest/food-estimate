<script lang="ts">
  import '../reset.css'
  import '../app.css'
</script>

<main>
  <slot />
</main>

<style>
  main {
    padding: 16px;
    margin: 0 auto;
  }

  @media (min-width: 768px) {
    main {
      padding: 32px;
      width: 750px;
    }
  }
</style>
