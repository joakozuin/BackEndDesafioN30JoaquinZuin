import express from "express";
import morgan from 'morgan'

import cluster from 'cluster'
import os from 'os'

import dotenv from 'dotenv';
dotenv.config();


/**💡routes */
import indexRoutes from "./src/routes/indexRoutes.cjs";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/", indexRoutes);

const PORT = parseInt(process.argv[2]) || 8080;
const numProc = os.cpus().length

console.log('Proceso')
console.log(process.argv)
console.log(typeof(modo))

const MODO=process.argv[3]==='CLUSTER'

  if (MODO && cluster.isMaster) {
    console.log(`🔥​Master ${process.pid} se está ejecutando`);

    for (let i = 0; i < numProc; i++) {
      cluster.fork();
    }
    //💡Aca queda escuchando es un evento, cuando muere un proceso, este
    //lo levanta de nuevo
    cluster.on(" exit", (worker, code, signal) => {
      console.log(`Master ${worker.process.pid} se está ejecutando`);
      cluster.fork();
    });
  } else {
    const server = app.listen(PORT, () =>
      console.log(
        `​🚀 ​ Servidor ejecutando en Modo Cluster http://localhost:${PORT}-PID:${
          process.pid
        }-Hora:${new Date().toLocaleString()} `
      )
    );
    server.on(`error`, (err) => console.log(err));
  }



