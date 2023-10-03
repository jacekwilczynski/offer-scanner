import { runWithServices } from 'src/dependency-injection';

runWithServices(['refresh'], ({ refresh }) => refresh.execute());
