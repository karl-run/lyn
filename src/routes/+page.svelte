<script lang="ts">
  import type { Load } from './+page.server';
  import LightningMap from '../components/LightningMap.svelte';

  export let data: Load;
</script>

<LightningMap initialHits={data.initialHits} />
