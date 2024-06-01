<script lang="ts">
  import { GeoJSON, MapLibre, MarkerLayer } from 'svelte-maplibre';
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';

  const liveHits = writable<[number, number, number][]>([]);

  onMount(() => {
    const eventSource = new EventSource('https://lyn.met.no/events');

    eventSource.addEventListener('lx', (event) => {
      try {
        // Split lines into array of JSON-strings
        const lines = event.data.split('\n');
        const newHits: [number, number, number][] = lines.map(JSON.parse).flat();

        liveHits.update((hits) => [...hits, ...newHits]);
      } catch (e) {
        console.log('Unable to parse:');
        console.log(event.data);
      }
    });

    return () => {
      eventSource.close();
    };
  });

  export let initialHits: [number, number, number][];
</script>

<MapLibre
  style="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
  class="relative w-screen h-screen"
  standardControls
  zoom={11}
  center={[10.75, 59.91]}
>
  <GeoJSON
    id="initialHits"
    data={{
      type: 'FeatureCollection',
      features: initialHits.map(([time, lat, lon]) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [lat, lon],
        },
        properties: { time },
      })),
    }}
    cluster={{
      radius: 369,
      maxZoom: 15,
    }}
  >
    <MarkerLayer applyToClusters let:feature>
      {#if feature.properties?.point_count > 10}
        <div class="h-8 w-8 rounded-full bg-blue-500 flex justify-center items-center">
          {feature.properties?.point_count}
        </div>
      {:else}
        <div class="h-4 w-4 rounded-full bg-blue-500 flex justify-center items-center">
          {feature.properties?.point_count}
        </div>
      {/if}
    </MarkerLayer>
    <MarkerLayer applyToClusters={false} asButton>
      <div class="h-2 w-2 rounded-full bg-blue-300 flex justify-center items-center"></div>
    </MarkerLayer>
  </GeoJSON>
  <GeoJSON
    id="liveHits"
    data={{
      type: 'FeatureCollection',
      features: $liveHits.map(([time, lat, lon]) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [lat, lon],
        },
        properties: { time },
      })),
    }}
    cluster={{
      radius: 369,
      maxZoom: 15,
    }}
  >
    <MarkerLayer applyToClusters let:feature>
      {#if feature.properties?.point_count > 10}
        <div class="h-8 w-8 rounded-full bg-red-400 flex justify-center items-center">
          {feature.properties?.point_count}
        </div>
      {:else}
        <div class="h-4 w-4 rounded-full bg-red-400 flex justify-center items-center">
          {feature.properties?.point_count}
        </div>
      {/if}
    </MarkerLayer>
    <MarkerLayer applyToClusters={false} asButton>
      <div class="h-2 w-2 rounded-full bg-red-400 flex justify-center items-center"></div>
    </MarkerLayer>
  </GeoJSON>
  <!--{#each initialHits as [time, lat, lon]}
		<Marker lngLat={[lat, lon]} class="h-2 w-2 rounded-full bg-blue-300" />
	{/each}
	{#each $liveHits as [time, lat, lon]}
		<Marker lngLat={[lat, lon]} class="h-2 w-2 rounded-full bg-red-700" />
	{/each}-->
</MapLibre>
