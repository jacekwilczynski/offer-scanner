import { runWithServices } from 'src/dependency-injection';

runWithServices(['refresh'], ({ refresh }) => {
    refresh.execute();
    setInterval(() => refresh.execute().catch(console.error), 60_000);
});
