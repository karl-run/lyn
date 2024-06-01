export type Load = Awaited<ReturnType<typeof load>>;

export async function load() {
  let nowInEpoch = +(Date.now() / 1000).toFixed(0);

  console.log(`Fetching data from ${nowInEpoch} (${new Date(nowInEpoch * 1000).toISOString()})`);
  const response = await fetch(`https://lyn.met.no/fetch/${nowInEpoch - 600}/600?format=lite`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data: [time: number, lat: number, lon: number][] = await response.json();

  return {
    initialHits: data,
  };
}
